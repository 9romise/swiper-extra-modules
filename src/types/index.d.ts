import type { Swiper as OriginalSwiper, SwiperEvents as OriginalSwiperEvents, SwiperOptions as OriginalSwiperOptions } from 'swiper/types';
import type { BetterScrollerEvents, BetterScrollerMethods, BetterScrollerOptions } from './better-scroller';

export type Swiper = OriginalSwiper & {
  params: SwiperOptions;
  originalParams: SwiperOptions;
  betterScroller: BetterScrollerMethods;
};

export type SwiperOptions = OriginalSwiperOptions & {
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

export interface SwiperEvents
  extends OriginalSwiperEvents,
  BetterScrollerEvents,
{}

export * from './better-scroller';
