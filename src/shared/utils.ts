export const isArray = Array.isArray;

export function isString(v: any): v is String {
  return typeof v === 'string';
}

export function loopChildren(el: HTMLElement, loopFn: (el: Element) => void) {
  let _loopFn = (el: Element) => {
    loopFn(el);
    Array.from(el.children).forEach(_loopFn);
  };
  _loopFn(el);
}

export function isScrollable(el: Element) {
  if (!(el instanceof HTMLElement)) return false;
  if (el.scrollHeight === el.clientHeight && el.scrollWidth === el.clientWidth) return false;
  const style = getComputedStyle(el);
  return ['overflow', 'overflow-x', 'overflow-y'].some((prop) => {
    const value = style.getPropertyValue(prop);
    return value === 'auto' || value === 'scroll' || value === 'overlay';
  });
}

export function getScrollParent(el?: Element) {
  let crtParent = el?.parentElement;
  while (crtParent) {
    if (isScrollable(crtParent)) {
      return crtParent;
    }
    crtParent = crtParent.parentElement;
  }
  return document.scrollingElement || document.documentElement;
}
