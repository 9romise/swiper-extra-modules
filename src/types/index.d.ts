import type { Swiper as OriSwiper, SwiperOptions as OriSwiperOptions, SwiperEvents as OriSwiperEvents } from 'swiper/types';
import { BetterScrollerEvents, BetterScrollerMethods, BetterScrollerOptions } from './better-scroller';

export type Swiper = OriSwiper & {
  params: SwiperOptions;
  originalParams: SwiperOptions;
  betterScroller: BetterScrollerMethods;
};

export type SwiperOptions = OriSwiperOptions & {
  betterScroller?: BetterScrollerOptions;
};

export type SwiperModule = (options: {
  params: SwiperOptions;
  swiper: Swiper;
  extendParams: (params: SwiperOptions) => void;
  on: Swiper['on'];
  once: Swiper['once'];
  off: Swiper['off'];
  emit: Swiper['emit'];
}) => void;

export interface SwiperEvents extends OriSwiperEvents, BetterScrollerEvents {};

export * from './better-scroller';
