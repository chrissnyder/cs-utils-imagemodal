// Generated by CoffeeScript 1.7.1
(function() {
  var ImageModal, fadeIn, fadeOut, loadImage, requestAnimationFrame,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.oRequestAnimationFrame;

  loadImage = function(src, callback) {
    var img;
    img = new Image;
    img.onload = function() {
      return callback(img);
    };
    return img.src = src;
  };

  fadeIn = function(element, params, callback) {
    var duration, progress, start;
    if (params == null) {
      params = {};
    }
    if (typeof params === 'function') {
      callback = params;
      params = {};
    }
    progress = params.progress || 0;
    duration = params.duration || 300;
    start = params.start || Date.now();
    if (progress === 0) {
      element.style.display = 'block';
    }
    progress = Date.now() - start;
    element.style.opacity = Math.min(progress / duration, 1);
    if (+element.style.opacity === 1) {
      if (element.style.opacity === 1) {
        return typeof callback === "function" ? callback() : void 0;
      }
    } else {
      return requestAnimationFrame(function() {
        return fadeIn(element, {
          progress: progress,
          duration: duration,
          start: start
        }, callback);
      });
    }
  };

  fadeOut = function(element, params, callback) {
    var duration, progress, start;
    if (params == null) {
      params = {};
    }
    if (typeof params === 'function') {
      callback = params;
      params = {};
    }
    progress = params.progress || 0;
    duration = params.duration || 300;
    start = params.start || Date.now();
    progress = Date.now() - start;
    element.style.opacity = Math.max(1 - (progress / duration), 0);
    if (+element.style.opacity === 0) {
      element.style.display = 'none';
      return typeof callback === "function" ? callback() : void 0;
    } else {
      return requestAnimationFrame(function() {
        return fadeOut(element, {
          progress: progress,
          duration: duration,
          start: start
        }, callback);
      });
    }
  };

  ImageModal = (function() {
    ImageModal.prototype.el = null;

    ImageModal.prototype.targets = null;

    ImageModal.prototype.selector = '["data-imagemodal"]';

    ImageModal.prototype.template = "<div id=\"cs-utils-imagemodal\">\n  <div class=\"modal-overlay\"></div>\n  <div class=\"modal-content\"></div>\n</div>";

    function ImageModal(params) {
      this.onClick = __bind(this.onClick, this);
      this.onClickTarget = __bind(this.onClickTarget, this);
      var key, value;
      for (key in params) {
        value = params[key];
        this[key] = value;
      }
      document.body.insertAdjacentHTML('beforeend', this.template);
      this.el = document.querySelector('#cs-utils-imagemodal');
      this.el.addEventListener('click', this.onClick);
      window.addEventListener('click', (function(_this) {
        return function(e) {
          var _ref;
          if (!('imagemodal' in ((_ref = e.target) != null ? _ref.dataset : void 0))) {
            return;
          }
          return _this.onClickTarget(e);
        };
      })(this));
    }

    ImageModal.prototype.onClickTarget = function(_arg) {
      var image, modalContent, target;
      target = _arg.target;
      modalContent = this.el.querySelector('.modal-content');
      image = null;
      if (target.dataset['imagemodal']) {
        if (image == null) {
          image = target.dataset['imagemodal'];
        }
      }
      if (image == null) {
        image = target.src;
      }
      if (!image) {
        throw new Error('no source provided');
      }
      fadeIn(this.el);
      return loadImage(image, (function(_this) {
        return function(img) {
          modalContent.appendChild(img);
          img.style.display = 'block';
          img.style.top = "" + (-(img.clientHeight / 2)) + "px";
          return img.style.left = "" + (-(img.clientWidth / 2)) + "px";
        };
      })(this));
    };

    ImageModal.prototype.onClick = function(e) {
      return fadeOut(this.el, (function(_this) {
        return function() {
          var modalContent;
          modalContent = _this.el.querySelector('.modal-content');
          return modalContent.removeChild(modalContent.firstChild);
        };
      })(this));
    };

    return ImageModal;

  })();

  if (typeof module !== "undefined" && module !== null) {
    module.exports = ImageModal;
  }

  window.ImageModal = ImageModal;

}).call(this);
