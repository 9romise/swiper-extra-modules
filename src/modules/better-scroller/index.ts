import type { SwiperModule } from '../../types'
import { isBoolean, isFunction, throttle } from 'es-toolkit'
import { isScrollable, loopChildren } from '../../shared/utils'

export const BetterScroller: SwiperModule = ({ swiper, extendParams, on }) => {
  extendParams({
    betterScroller: {
      resetScroll: true,
    },
  })

  let noSwipingClass = ''

  const scrollableElements: HTMLElement[] = []
  let moveFrom: 'start' | 'end' | null = null
  let startPoint: Record<'x' | 'y', number> | null = null
  let moveDirection: 'prev' | 'next' | 'changed' | null = null

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
    },
  } as const
  let measure: (typeof MEASURE_PRESET)['horizontal' | 'vertical']

  on('slideChangeTransitionEnd', () => {
    const { resetScroll } = swiper.params.betterScroller!

    if (resetScroll === false)
      return

    scrollableElements.forEach((el) => {
      let options: ScrollToOptions = { left: 0, top: 0 }

      if (isFunction(resetScroll)) {
        const res = resetScroll(el) ?? true

        if (res === false)
          return
        else if (!isBoolean(res))
          options = res
      } else if (!isBoolean(resetScroll)) {
        options = resetScroll as ScrollToOptions
      }

      el.scrollTo(options)
    })
  })

  function getScrollTarget(el: HTMLElement) {
    if (scrollableElements.includes(el))
      return el
    let crtParent = el?.parentElement
    while (crtParent) {
      if (isScrollable(crtParent))
        return crtParent

      crtParent = crtParent.parentElement
    }
    return document.scrollingElement || document.documentElement
  }

  const onWheel = (e: WheelEvent) => {
    if (swiper.destroyed || !swiper.params.enabled || !swiper.mousewheel.enabled)
      return
    let wheelDelta = e[measure.wheelDelta]
    // Press and hold the Shift with the mouse scroll wheel will scroll horizontally.
    if (e.shiftKey)
      wheelDelta = e.deltaY

    if (Math.abs(wheelDelta) < swiper.params.threshold!)
      return

    const el = getScrollTarget(e.target as HTMLElement)

    if (wheelDelta < 0 && el[measure.scrollStart] <= 0)
      swiper.slidePrev()
    else if (wheelDelta > 0 && el[measure.scrollStart] + 1 >= el[measure.scroll] - el[measure.client])
      swiper.slideNext()
    else
      e.stopPropagation()
  }

  const onTouchStart = (e: TouchEvent) => {
    if (swiper.destroyed || !swiper.params.enabled || !swiper.allowTouchMove)
      return

    const el = getScrollTarget(e.target as HTMLElement)

    if (!el.classList.contains(noSwipingClass))
      return

    if (el[measure.scrollStart] <= 0)
      moveFrom = 'start'
    // https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight#determine_if_an_element_has_been_totally_scrolled
    else if (el[measure.scrollStart] + 1 >= el[measure.scroll] - el[measure.client])
      moveFrom = 'end'
    else
      moveFrom = null

    startPoint = {
      x: e.touches[0].pageX,
      y: e.touches[0].pageY,
    }
    moveDirection = null
  }

  const onTouchMove = throttle((e: TouchEvent) => {
    if (swiper.destroyed || !swiper.params.enabled || !swiper.allowTouchMove || !startPoint)
      return

    const el = getScrollTarget(e.target as HTMLElement)

    if (!el.classList.contains(noSwipingClass))
      return

    const direction = e.touches[0][measure.touchAxis] > startPoint[measure.startAxis] ? 'next' : 'prev'

    if (!moveDirection)
      moveDirection = direction
    if (direction !== moveDirection && moveDirection !== 'changed')
      moveDirection = 'changed'
  }, 200, { edges: ['leading', 'trailing'] })

  const onTouchEnd = (e: TouchEvent) => {
    if (swiper.destroyed || !swiper.params.enabled || !swiper.allowTouchMove || !startPoint || !moveDirection || moveDirection === 'changed')
      return

    const scrollBox = getScrollTarget(e.target as HTMLElement)

    if (!scrollBox.classList.contains(noSwipingClass))
      return

    const moveDistance = e.changedTouches[0][measure.touchAxis] - startPoint[measure.startAxis]

    if (moveDistance > swiper.params.threshold! && moveFrom === 'start')
      swiper.slidePrev()
    else if (moveDistance < swiper.params.threshold! && moveFrom === 'end')
      swiper.slideNext()
  }

  const attachEvents = () => {
    scrollableElements.forEach((el) => {
      if (!el)
        return

      if (swiper.mousewheel)
        el.addEventListener('wheel', onWheel)

      el.addEventListener('touchstart', onTouchStart)
      el.addEventListener('touchmove', onTouchMove)
      el.addEventListener('touchend', onTouchEnd)
    })
  }

  const detachEvents = () => {
    scrollableElements.forEach((el) => {
      if (!el)
        return
      if (swiper.mousewheel)
        el.removeEventListener('wheel', onWheel)
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
      el.removeEventListener('touchend', onTouchEnd)
    })
  }

  const update = () => {
    detachEvents()
    loopElements((el) => {
      el.classList.remove(noSwipingClass)
    })

    noSwipingClass = swiper.params.noSwipingClass!
    measure = MEASURE_PRESET[swiper.params.direction!]

    scrollableElements.length = 0
    swiper.slides.forEach((slide) => {
      loopChildren(slide, (el) => {
        if (isScrollable(el) && !el.classList.contains(noSwipingClass))
          scrollableElements.push(el as HTMLElement)
      })
    })

    loopElements((el) => {
      el.classList.add(noSwipingClass)
    })
    attachEvents()
  }

  on('init', (swiper) => {
    swiper.el.classList.add(`${swiper.params.containerModifierClass}better-scroller`)
    update()
  })

  on('update', () => {
    update()
  })

  on('destroy', (swiper) => {
    swiper.el.classList.remove(`${swiper.params.containerModifierClass}better-scroller`)
    detachEvents()
  })

  function loopElements(fn: (el: HTMLElement) => void) {
    scrollableElements.forEach((el) => {
      if (!el)
        return
      fn(el)
    })
  }

  swiper.betterScroller = {
    update,
  }
}
