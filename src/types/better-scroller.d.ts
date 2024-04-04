export interface BetterScrollerMethods {
  /**
   * Update scrollable elements and their eventListeners.
   */
  update(): void;
}

export interface BetterScrollerEvents {}

/**
 * Object with betterScroller parameters.
 *
 * @example
 * ```js
 * const swiper = new Swiper('.swiper', {
 *   betterScroller: {
 *   },
 * });
 * ```
 */
export interface BetterScrollerOptions {
  /**
   * Defines how scrolling should behavior after a slide transition.
  *
   * Set to `false` to skip.
   *
   * It could be a function that determines scrolling options for each scrollable element.
   *
   * @default true
   */
  resetScroll?: boolean | ScrollToOptions | ((scrollableElement: Element) => boolean | ScrollToOptions);
}
