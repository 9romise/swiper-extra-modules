import type { Swiper as OriSwiper, SwiperOptions as OriSwiperOptions, SwiperEvents as OriSwiperEvents } from 'swiper/types';
import { ScrollFixEvents, ScrollFixMethods, ScrollFixOptions } from './scroll-fix';

export type Swiper = OriSwiper & {
  params: SwiperOptions;
  originalParams: SwiperOptions;
  scrollFix: ScrollFixMethods;
};

export type SwiperOptions = OriSwiperOptions & {
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

export interface SwiperEvents extends OriSwiperEvents, ScrollFixEvents {};

export * from './scroll-fix';
