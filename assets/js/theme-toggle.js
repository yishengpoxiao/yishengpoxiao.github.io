;(function () {
  var storageKey = 'site-theme-mode'
  var modes = ['auto', 'light', 'dark']
  var defaultMode = (window.siteAutoDarkMode === false) ? 'light' : 'auto'
  var refreshTimerId

  function getStoredMode() {
    try {
      var storedMode = window.localStorage.getItem(storageKey)
      if (modes.indexOf(storedMode) !== -1) {
        return storedMode
      }
    } catch (error) {}

    return defaultMode
  }

  function getEffectiveTheme(mode) {
    var hour = new Date().getHours()
    var autoTheme = hour >= 7 && hour < 19 ? 'light' : 'dark'

    return mode === 'auto' ? autoTheme : mode
  }

  function getThemeText(mode, effectiveTheme) {
    if (mode === 'auto') {
      return effectiveTheme === 'dark' ? 'Auto · Night' : 'Auto · Day'
    }

    return mode === 'dark' ? 'Night' : 'Day'
  }

  function getThemeIcon(mode) {
    if (mode === 'dark') {
      return 'fa-moon'
    }

    if (mode === 'light') {
      return 'fa-sun'
    }

    return 'fa-circle-half-stroke'
  }

  function saveMode(mode) {
    try {
      window.localStorage.setItem(storageKey, mode)
    } catch (error) {}
  }

  function applyTheme(mode) {
    var effectiveTheme = getEffectiveTheme(mode)
    var root = document.documentElement
    var button = document.getElementById('theme-toggle')
    var label = button ? button.querySelector('.theme-toggle-label') : null
    var icon = button ? button.querySelector('.theme-toggle-icon i') : null
    var buttonText = getThemeText(mode, effectiveTheme)

    root.setAttribute('data-theme-mode', mode)
    root.setAttribute('data-theme', effectiveTheme)

    if (!button || !label || !icon) {
      return
    }

    label.textContent = buttonText
    icon.className = 'fa-solid ' + getThemeIcon(mode)
    button.setAttribute(
      'aria-label',
      'Theme mode: ' + buttonText + '. Click to switch between auto, day, and night.'
    )
    button.setAttribute('title', 'Switch theme mode')
  }

  function setMode(mode) {
    applyTheme(mode)
    saveMode(mode)
  }

  function startAutoRefresh() {
    if (refreshTimerId) {
      window.clearInterval(refreshTimerId)
    }

    refreshTimerId = window.setInterval(function () {
      if (document.documentElement.getAttribute('data-theme-mode') === 'auto') {
        applyTheme('auto')
      }
    }, 60000)
  }

  function bindToggle() {
    var button = document.getElementById('theme-toggle')
    if (!button) {
      return
    }

    button.addEventListener('click', function () {
      var currentMode = document.documentElement.getAttribute('data-theme-mode') || getStoredMode()
      var currentIndex = modes.indexOf(currentMode)
      var nextMode = modes[(currentIndex + 1) % modes.length]

      setMode(nextMode)
    })
  }

  document.addEventListener('DOMContentLoaded', function () {
    var initialMode = getStoredMode()

    applyTheme(initialMode)
    bindToggle()
    startAutoRefresh()

    document.addEventListener('visibilitychange', function () {
      if (!document.hidden && document.documentElement.getAttribute('data-theme-mode') === 'auto') {
        applyTheme('auto')
      }
    })
  })
})()
