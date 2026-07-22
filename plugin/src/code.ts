// Main thread: thin adapter between Figma nodes and the pure helpers in lib/.
import type { ChitraComponent, MainToUi, StringItem, UiToMain } from './lib/types';
import { toStatus } from './lib/strings';
import { addComponent, parseRegistry, updateComponentText } from './lib/components';
import { matchImportRows, parseImport } from './lib/export';

const PD_STATUS = 'chitra.status';
const PD_COMPONENT = 'chitra.componentId';
const PD_REGISTRY = 'chitra.components';
const PD_COUNTER = 'chitra.counter';

figma.showUI(__html__, { width: 380, height: 620, themeColors: true });

// ---- scan --------------------------------------------------------------

function topFrameName(node: TextNode): string {
  let top: BaseNode = node;
  while (top.parent && top.parent.type !== 'PAGE') top = top.parent;
  return top.type === 'FRAME' || top.type === 'SECTION' ? top.name : 'Page';
}

function pageName(node: BaseNode): string {
  let p: BaseNode | null = node.parent;
  while (p && p.type !== 'PAGE') p = p.parent;
  return p ? p.name : '';
}

function allPages(): PageNode[] {
  return figma.root.children.filter((c): c is PageNode => c.type === 'PAGE');
}

/**
 * Every TEXT node in the document, across all pages — the "one source of
 * truth" index. TODO: very large files will want the async `dynamic-page`
 * documentAccess + incremental per-page scanning; that's a dedicated,
 * in-Figma-tested pass, not attempted here.
 */
function allTextNodes(): TextNode[] {
  const nodes: TextNode[] = [];
  for (const page of allPages()) {
    nodes.push(...page.findAllWithCriteria({ types: ['TEXT'] }));
  }
  return nodes;
}

function collectTextNodes(): TextNode[] {
  const selection = figma.currentPage.selection;
  // No selection → index the whole document, not just the current page.
  if (selection.length === 0) return allTextNodes();
  const byId = new Map<string, TextNode>();
  for (const node of selection) {
    if (node.type === 'TEXT') byId.set(node.id, node);
    else if ('findAllWithCriteria' in node) {
      for (const t of node.findAllWithCriteria({ types: ['TEXT'] })) byId.set(t.id, t);
    }
  }
  return [...byId.values()];
}

function toItem(node: TextNode): StringItem {
  return {
    id: node.id,
    characters: node.characters,
    frameName: topFrameName(node),
    pageName: pageName(node),
    status: toStatus(node.getPluginData(PD_STATUS)),
    componentId: node.getPluginData(PD_COMPONENT) || null,
  };
}

// ---- component registry (stored once, as JSON, on figma.root) ----------

function getRegistry(): ChitraComponent[] {
  return parseRegistry(figma.root.getPluginData(PD_REGISTRY));
}

function setRegistry(components: ChitraComponent[]): void {
  figma.root.setPluginData(PD_REGISTRY, JSON.stringify(components));
}

function nextComponentId(): string {
  const n = parseInt(figma.root.getPluginData(PD_COUNTER), 10) || 0;
  figma.root.setPluginData(PD_COUNTER, String(n + 1));
  return `c${n + 1}`;
}

// ---- font-safe text edits ----------------------------------------------

async function setCharacters(node: TextNode, text: string): Promise<void> {
  if (node.hasMissingFont) {
    figma.notify(`"${node.name}" uses a missing font — skipped.`);
    return;
  }
  const fonts =
    node.characters.length > 0
      ? node.getRangeAllFontNames(0, node.characters.length)
      : [node.fontName as FontName];
  await Promise.all(fonts.map((f) => figma.loadFontAsync(f)));
  node.characters = text;
}

// ---- UI messaging -------------------------------------------------------

function post(msg: MainToUi): void {
  figma.ui.postMessage(msg);
}

function postAll(): void {
  post({ type: 'strings', items: collectTextNodes().map(toItem) });
  post({ type: 'components', components: getRegistry() });
}

function textNode(id: string): TextNode | null {
  const node = figma.getNodeById(id);
  return node && node.type === 'TEXT' ? node : null;
}

figma.ui.onmessage = async (msg: UiToMain) => {
  switch (msg.type) {
    case 'edit-text': {
      const node = textNode(msg.id);
      if (node) await setCharacters(node, msg.text);
      break;
    }
    case 'set-status': {
      textNode(msg.id)?.setPluginData(PD_STATUS, msg.status);
      break;
    }
    case 'create-component': {
      const node = textNode(msg.nodeId);
      if (node) {
        const component = { id: nextComponentId(), name: msg.name, text: node.characters };
        setRegistry(addComponent(getRegistry(), component));
        node.setPluginData(PD_COMPONENT, component.id);
      }
      break;
    }
    case 'link-component': {
      const node = textNode(msg.nodeId);
      const component = getRegistry().find((c) => c.id === msg.componentId);
      if (node && component) {
        node.setPluginData(PD_COMPONENT, component.id);
        await setCharacters(node, component.text); // linking adopts the component's copy
      }
      break;
    }
    case 'edit-component': {
      setRegistry(updateComponentText(getRegistry(), msg.componentId, msg.text));
      // Propagate document-wide: linked layers on OTHER pages must update too
      // ("say it once, same everywhere"), not just figma.currentPage.
      const linked = allTextNodes().filter(
        (n) => n.getPluginData(PD_COMPONENT) === msg.componentId,
      );
      for (const node of linked) await setCharacters(node, msg.text);
      break;
    }
    case 'import': {
      const rows = parseImport(msg.text);
      const nodes = new Map(allTextNodes().map((n) => [n.id, n] as const));
      const { matched, missingIds } = matchImportRows(rows, nodes.keys());
      for (const row of matched) {
        const node = nodes.get(row.id);
        if (node) await setCharacters(node, row.text);
      }
      const skipped = missingIds.length > 0 ? `, ${missingIds.length} not found` : '';
      figma.notify(`Imported ${matched.length} string${matched.length === 1 ? '' : 's'}${skipped}.`);
      break;
    }
    case 'refresh':
      break;
  }
  postAll();
};

// Debounce document re-scans so rapid selection changes don't thrash the
// scan/post cycle. (TODO: list virtualization in the UI is the other half of
// staying snappy on huge files — next dedicated, in-Figma-tested pass.)
const SCAN_DEBOUNCE_MS = 150;
let scanTimer: ReturnType<typeof setTimeout> | undefined;
function schedulePostAll(): void {
  if (scanTimer !== undefined) clearTimeout(scanTimer);
  scanTimer = setTimeout(() => {
    scanTimer = undefined;
    postAll();
  }, SCAN_DEBOUNCE_MS);
}

figma.on('selectionchange', schedulePostAll);
figma.on('currentpagechange', schedulePostAll);
postAll();
