import ReactQuill from 'react-quill';

// ReactQuill v2 still uses findDOMNode internally, which triggers strict mode warnings.
// Patch getEditingArea to resolve the stored ref directly so we avoid calling findDOMNode.
const ReactQuillClass = ReactQuill as unknown as {
  prototype?: {
    getEditingArea?: () => Element;
    editingArea?: unknown;
  };
};

const resolveEditingArea = (area: unknown): Element | null => {
  const candidate = (area as any)?.current ?? area;
  if (candidate && typeof (candidate as any).nodeType === 'number') {
    if ((candidate as any).nodeType === 3) {
      throw new Error('Editing area cannot be a text node');
    }
    return candidate as Element;
  }
  return null;
};

if (ReactQuillClass?.prototype) {
  ReactQuillClass.prototype.getEditingArea = function getEditingAreaPatched() {
    const element = resolveEditingArea((this as any).editingArea);
    if (!element) {
      throw new Error('Cannot find element for editing area');
    }
    return element;
  };
}

export type { ReactQuillProps } from 'react-quill';
export default ReactQuill;
