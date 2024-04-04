import { throttle } from 'lodash-es';
import { getScrollParent, isScrollable, loopChildren } from '../../shared/utils';
import { SwiperModule } from '../../types';

export const BetterScroller: SwiperModule = ({ swiper, extendParams, on }) => {
  extendParams({
    betterScroller: {},
  });

  let noSwipingClass = '';

  let scrollableElements: HTMLElement[] = [];
  let moveFrom: 'start' | 'end' | null = null;
  let startPoint: Record<'x' | 'y', number> | null = null;
  let moveDirection: 'prev' | 'next' | 'changed' | null = null;

  const MEASURE_PRESET = {
    horizontal: {
      startAxis: 'x',
      touchAxis: 'pageX',
      wheelDelta: 'deltaX',
      scrollStart: 'scrollLeft',
      scroll: 'scrollWidth',
      client: 'clientWidth',
    },
    vertical: {
      startAxis: 'y',
      touchAxis: 'pageY',
      wheelDelta: 'deltaY',
      scrollStart: 'scrollTop',
      scroll: 'scrollHeight',
      client: 'clientHeight',
    }
  } as const;
  let measure: (typeof MEASURE_PRESET)['horizontal' | 'vertical'];

  const onWheel = (e: WheelEvent) => {
    // prettier-ignore
    if (swiper.destroyed || !swiper.params.enabled || !swiper.mousewheel.enabled) return;
    let wheelDelta = e[measure.wheelDelta];
    // Press and hold the Shift with the mouse scroll wheel will scroll horizontally.
    if (e.shiftKey) wheelDelta = e.deltaY;

    if (Math.abs(wheelDelta) < swiper.params.threshold!) return;

    const el = getScrollParent(e.target as HTMLElement);

    if (wheelDelta < 0 && el[measure.scrollStart] <= 0) {
      swiper.slidePrev();
    } else if (wheelDelta > 0 && el[measure.scrollStart] + 1 >= el[measure.scroll] - el[measure.client]) {
      swiper.slideNext();
    } else {
      e.stopPropagation();
    }
  };

  const onTouchStart = (e: TouchEvent) => {
    // prettier-ignore
    if (swiper.destroyed || !swiper.params.enabled || !swiper.allowTouchMove) return;

    const el = getScrollParent(e.target as HTMLElement);

    if (!el.classList.contains(noSwipingClass)) return;

    if (el[measure.scrollStart] <= 0) {
      moveFrom = 'start';
    }
    // https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight#determine_if_an_element_has_been_totally_scrolled
    else if (el[measure.scrollStart] + 1 >= el[measure.scroll] - el[measure.client]) {
      moveFrom = 'end';
    } else {
      moveFrom = null;
    }

    startPoint = {
      x: e.touches[0].pageX,
      y: e.touches[0].pageY,
    };
    moveDirection = null;
  };

  const onTouchMove = throttle((e: TouchEvent) => {
    // prettier-ignore
    if (swiper.destroyed || !swiper.params.enabled || !swiper.allowTouchMove || !startPoint) return;

    const el = getScrollParent(e.target as HTMLElement);

    if (!el.classList.contains(noSwipingClass)) return;

    const direction = e.touches[0][measure.touchAxis] > startPoint[measure.startAxis] ? 'next' : 'prev';

    if (!moveDirection) moveDirection = direction;
    if (direction !== moveDirection && moveDirection !== 'changed') {
      moveDirection = 'changed';
    }
  }, 200);

  const onTouchEnd = (e: TouchEvent) => {
    // prettier-ignore
    if (swiper.destroyed || !swiper.params.enabled || !swiper.allowTouchMove || !startPoint || !moveDirection || moveDirection === 'changed') return;

    const scrollBox = getScrollParent(e.target as HTMLElement);

    if (!scrollBox.classList.contains(noSwipingClass)) return;

    let moveDistance = e.changedTouches[0][measure.touchAxis] - startPoint[measure.startAxis];

    // prettier-ignore
    if (moveDistance > swiper.params.threshold! && moveFrom === 'start') {
      swiper.slidePrev();
    } else if (moveDistance < swiper.params.threshold! && moveFrom === 'end') {
      swiper.slideNext();
    }
  };

  const attachEvents = () => {
    scrollableElements.forEach((el) => {
      if (!el) return;
      if (swiper.mousewheel) el.addEventListener('wheel', onWheel);
      el.addEventListener('touchstart', onTouchStart);
      el.addEventListener('touchmove', onTouchMove);
      el.addEventListener('touchend', onTouchEnd);
    });
  };

  const detachEvents = () => {
    scrollableElements.forEach((el) => {
      if (!el) return;
      if (swiper.mousewheel) el.removeEventListener('wheel', onWheel);
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
    });
  };

  on('init', (swiper) => {
    swiper.el.classList.add(`${swiper.params.containerModifierClass}scroll-fix`);
    update();
    attachEvents();
  });

  on('update', (swiper) => {
    detachEvents();
    update();
    attachEvents();
  });

  on('destroy', (swiper) => {
    swiper.el.classList.remove(`${swiper.params.containerModifierClass}scroll-fix`);
    detachEvents();
  });

  function loopElements(fn: (el: HTMLElement) => void) {
    scrollableElements.forEach((el) => {
      if (!el) return;
      fn(el);
    });
  }

  const update = () => {
    loopElements((el) => {
      el.classList.remove(noSwipingClass);
    });

    noSwipingClass = swiper.params.noSwipingClass!;
    measure = MEASURE_PRESET[swiper.params.direction!];

    scrollableElements.length = 0;
    swiper.slides.forEach((slide) => {
      loopChildren(slide, (el) => {
        // prettier-ignore
        if (isScrollable(el) && !el.classList.contains(noSwipingClass)) {
          scrollableElements.push(el as HTMLElement);
        }
      });
    });

    loopElements((el) => {
      el.classList.add(noSwipingClass);
    });
  };

  swiper.betterScroller = {
    update,
  };
};
