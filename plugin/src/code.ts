// Main thread: thin adapter between Figma nodes and the pure helpers in lib/.
import type { IdemComponent, MainToUi, StringItem, UiToMain } from './lib/types';
import { toStatus } from './lib/strings';
import { addComponent, parseRegistry, updateComponentText } from './lib/components';

const PD_STATUS = 'idem.status';
const PD_COMPONENT = 'idem.componentId';
const PD_REGISTRY = 'idem.components';
const PD_COUNTER = 'idem.counter';

figma.showUI(__html__, { width: 380, height: 620, themeColors: true });

// ---- scan --------------------------------------------------------------

function topFrameName(node: TextNode): string {
  let top: BaseNode = node;
  while (top.parent && top.parent.type !== 'PAGE') top = top.parent;
  return top.type === 'FRAME' || top.type === 'SECTION' ? top.name : 'Page';
}

function collectTextNodes(): TextNode[] {
  const selection = figma.currentPage.selection;
  if (selection.length === 0) {
    return figma.currentPage.findAllWithCriteria({ types: ['TEXT'] });
  }
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
    status: toStatus(node.getPluginData(PD_STATUS)),
    componentId: node.getPluginData(PD_COMPONENT) || null,
  };
}

// ---- component registry (stored once, as JSON, on figma.root) ----------

function getRegistry(): IdemComponent[] {
  return parseRegistry(figma.root.getPluginData(PD_REGISTRY));
}

function setRegistry(components: IdemComponent[]): void {
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
      const linked = figma.currentPage
        .findAllWithCriteria({ types: ['TEXT'] })
        .filter((n) => n.getPluginData(PD_COMPONENT) === msg.componentId);
      for (const node of linked) await setCharacters(node, msg.text);
      break;
    }
    case 'refresh':
      break;
  }
  postAll();
};

figma.on('selectionchange', postAll);
figma.on('currentpagechange', postAll);
postAll();
