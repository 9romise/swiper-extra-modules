export const isArray = Array.isArray

export function isString(v: any): v is string {
  return typeof v === 'string'
}

export function isNumber(v: any): v is number {
  return typeof v === 'number'
}

export function isBoolean(v: any): v is boolean {
  return typeof v === 'boolean'
}

export function isFunction(v: any): v is Function {
  return typeof v === 'function'
}

export function loopChildren(el: HTMLElement, loopFn: (el: Element) => void) {
  const _loopFn = (el: Element) => {
    loopFn(el)
    Array.from(el.children).forEach(_loopFn)
  }
  _loopFn(el)
}

export function isScrollable(el: Element) {
  if (!(el instanceof HTMLElement))
    return false
  if (el.scrollHeight === el.clientHeight && el.scrollWidth === el.clientWidth)
    return false

  const style = getComputedStyle(el)
  return ['overflow', 'overflow-x', 'overflow-y'].some((prop) => {
    const value = style.getPropertyValue(prop)
    return value === 'auto' || value === 'scroll' || value === 'overlay'
  })
}

interface ThrottleOptions {
  leading?: boolean
  trailing?: boolean
}
export function throttle<T extends (...args: any[]) => void>(func: T, wait = 200, options: ThrottleOptions = {}): T {
  let timeout: ReturnType<typeof setTimeout> | null = null
  let lastArgs: any[] | null = null
  let lastCallTime: number | null = null
  const { leading = true, trailing = true } = options

  return ((...args: any[]) => {
    const now = Date.now()

    if (lastCallTime === null && !leading)
      lastCallTime = now

    const remainingTime = wait - (now - (lastCallTime || 0))

    if (remainingTime <= 0 || remainingTime > wait) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      lastCallTime = now
      func(...args)
    } else if (trailing && !timeout) {
      lastArgs = args
      timeout = setTimeout(() => {
        lastCallTime = leading ? Date.now() : null
        timeout = null
        if (lastArgs) {
          func(...lastArgs)
          lastArgs = null
        }
      }, remainingTime)
    }
  }) as T
}
