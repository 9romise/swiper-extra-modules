import type Swiper from 'swiper';
import { SwiperOptions } from '.';

export interface ScrollFixMethods {
  /**
   * Update scroll elements and eventListeners.
   */
  update(): void;
}

export interface ScrollFixEvents {}

/**
 * Object with scrollFix parameters.
 *
 * @example
 * ```js
 * const swiper = new Swiper('.swiper', {
 *   scrollFix: {
 *   },
 * });
 * ```
 */
export interface ScrollFixOptions {
}
