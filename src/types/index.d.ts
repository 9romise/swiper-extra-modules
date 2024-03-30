import type { Swiper as OriginalSwiper, SwiperOptions as OriginalSwiperOptions, SwiperEvents as OriginalSwiperEvents } from 'swiper/types';
import { ScrollFixEvents, ScrollFixMethods, ScrollFixOptions } from './scroll-fix';

export type Swiper = OriginalSwiper & {
  params: SwiperOptions;
  originalParams: SwiperOptions;
  scrollFix: ScrollFixMethods;
};

export type SwiperOptions = OriginalSwiperOptions & {
  scrollFix?: ScrollFixOptions;
}

export type SwiperModule = (options: {
  params: SwiperOptions;
  swiper: Swiper;
  extendParams: (params: SwiperOptions) => void;
  on: Swiper['on'];
  once: Swiper['once'];
  off: Swiper['off'];
  emit: Swiper['emit'];
}) => void;

export interface SwiperEvents extends OriginalSwiperEvents, ScrollFixEvents {};

export * from './scroll-fix.d.ts';
