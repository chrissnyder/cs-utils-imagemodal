requestAnimationFrame =
  window.requestAnimationFrame || 
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame || 
  window.oRequestAnimationFrame

loadImage = (src, callback) ->
  img = new Image
  img.onload = -> callback img
  img.src = src

fadeIn = (element, params = {}, callback) ->
  if typeof params is 'function'
    callback = params
    params = {}

  progress = params.progress || 0
  duration = params.duration || 300
  start = params.start || Date.now()

  element.style.display = 'block' if progress is 0

  progress = Date.now() - start
  element.style.opacity = Math.min (progress / duration), 1
    
  if +element.style.opacity is 1
    callback?() if element.style.opacity is 1
  else
    requestAnimationFrame ->
      fadeIn element, { progress, duration, start }, callback

fadeOut = (element, params = {}, callback) ->
  if typeof params is 'function'
    callback = params
    params = {}

  progress = params.progress || 0
  duration = params.duration || 300
  start = params.start || Date.now()

  progress = Date.now() - start
  element.style.opacity = Math.max 1 - (progress / duration), 0
    
  if +element.style.opacity is 0
    element.style.display = 'none'
    callback?()
  else
    requestAnimationFrame ->
      fadeOut element, { progress, duration, start }, callback

class ImageModal
  el: null
  targets: null

  selector: '["data-imagemodal"]'
  template: """
    <div id="cs-utils-imagemodal">
      <div class="modal-overlay"></div>
      <div class="modal-content"></div>
    </div>
  """

  constructor: (params) ->
    @[key] = value for key, value of params

    document.body.insertAdjacentHTML 'beforeend', @template

    @el = document.querySelector '#cs-utils-imagemodal'
    @el.addEventListener 'click', @onClick

    window.addEventListener 'click', (e) =>
      return unless 'imagemodal' of e.target?.dataset
      @onClickTarget e

  onClickTarget: ({ target }) =>
    modalContent = @el.querySelector '.modal-content'

    image = null
    image ?= target.dataset['imagemodal'] if target.dataset['imagemodal']
    image ?= target.src
    throw new Error 'no source provided' unless image

    fadeIn @el

    loadImage image, (img) =>
      modalContent.appendChild img
      img.style.display = 'block'
      img.style.top = "#{ -(img.clientHeight / 2) }px"
      img.style.left = "#{ -(img.clientWidth / 2) }px"

  onClick: (e) =>
    fadeOut @el, =>
      modalContent = @el.querySelector '.modal-content'
      modalContent.removeChild modalContent.firstChild

module?.exports = ImageModal
window.ImageModal = ImageModal

