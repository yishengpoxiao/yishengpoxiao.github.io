;(function () {
  function updateSliderProgress(slider, value, max) {
    var progress = max > 0 ? (value / max) * 100 : 0
    slider.style.setProperty('--scroll-progress', progress + '%')
  }

  function syncBlock(block) {
    var list = block.querySelector('[data-research-scroll-list]')
    var sliderWrap = block.querySelector('[data-research-scrollbar]')
    var slider = block.querySelector('[data-research-scroll-slider]')

    if (!list || !sliderWrap || !slider) {
      return function noop() {}
    }

    function syncBounds() {
      var maxScroll = Math.max(list.scrollWidth - list.clientWidth, 0)
      var hasOverflow = maxScroll > 4
      var scrollLeft = Math.min(list.scrollLeft, maxScroll)

      slider.max = String(maxScroll)
      slider.value = String(scrollLeft)
      slider.disabled = !hasOverflow
      sliderWrap.hidden = !hasOverflow
      block.classList.toggle('research-inline-scrollable', hasOverflow)
      updateSliderProgress(slider, scrollLeft, maxScroll)
    }

    slider.addEventListener('input', function () {
      var nextValue = Number(slider.value)
      list.scrollTo({ left: nextValue, behavior: 'auto' })
      updateSliderProgress(slider, nextValue, Number(slider.max))
    })

    list.addEventListener('scroll', function () {
      slider.value = String(Math.min(list.scrollLeft, Number(slider.max)))
      updateSliderProgress(slider, Number(slider.value), Number(slider.max))
    }, { passive: true })

    window.addEventListener('resize', syncBounds)
    window.addEventListener('load', syncBounds)

    if (typeof ResizeObserver === 'function') {
      var resizeObserver = new ResizeObserver(syncBounds)
      resizeObserver.observe(list)
    }

    syncBounds()

    return syncBounds
  }

  document.addEventListener('DOMContentLoaded', function () {
    var blocks = document.querySelectorAll('.research-inline-block')

    blocks.forEach(function (block) {
      syncBlock(block)
    })
  })
})()
