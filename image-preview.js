/**
 *
 * title   : Image Preview JS
 *
 * version : 0.2.0 (Beta)
 *
 * author  : Jaewon
 *
 * license : MIT
 *
 * github  : https://www.github.com/wonism
 *
 * blog    : http://jaewonism.cf
 *
 */

;(function () {
  var imagePreview, ImagePreview;

  // Variable for Singletone instance
  var _imagePreviewInstance;

  imagePreview = {
    init: function (element, width, height, ratio, type, volume, useBins, successFunc, failedFunc, renderFunc) {
      if (arguments.length < 1) {
        throw new Error('Invalid parameters !!!');
      }

      return new ImagePreview(element, width, height, ratio, type, volume, useBins, successFunc, failedFunc, renderFunc);
    },
    version: "0.1.0"
  };

  ImagePreview = function (element, width, height, ratio, type, volume, useBins, successFunc, failedFunc, renderFunc) {
    _imagePreviewInstance = this;

    _imagePreviewInstance.obj = {};

    _imagePreviewInstance.obj.notFittable = false;
    _imagePreviewInstance.obj.wrongFiles = [];
    _imagePreviewInstance.obj.rightFiles = [];

    _imagePreviewInstance.obj.width = width >> 0;
    _imagePreviewInstance.obj.height = height >> 0;
    _imagePreviewInstance.obj.ratio = Number((ratio >> 0).toFixed(2));
    _imagePreviewInstance.obj.type = type ? type.match(/jpg|jpeg|gif|png/) ? String(type) : '' : '';
    _imagePreviewInstance.obj.volume = volume;
    _imagePreviewInstance.obj.useBins = !!useBins;
    _imagePreviewInstance.obj.bins = [];
    _imagePreviewInstance.obj.successFunc = successFunc;
    _imagePreviewInstance.obj.failedFunc = failedFunc;
    _imagePreviewInstance.obj.renderFunc = renderFunc;

    _imagePreviewInstance.obj.acceptType = [];
    _imagePreviewInstance.obj.useValidate = false;
    _imagePreviewInstance.obj.validateType = [];

    if (typeof _imagePreviewInstance.obj.volume === 'string' && _imagePreviewInstance.obj.volume.match(/^\d+/)) {
      if (_imagePreviewInstance.obj.volume.match(/kb$/i)) {
        _imagePreviewInstance.obj.volume = (_imagePreviewInstance.obj.volume.match(/\d+/)[0] >> 0) * 1024;
      } else if (_imagePreviewInstance.obj.volume.match(/mb$/i)) {
        _imagePreviewInstance.obj.volume = (_imagePreviewInstance.obj.volume.match(/\d+/)[0] >> 0) * 1024 * 1024;
      } else if (_imagePreviewInstance.obj.volume.match(/gb$/i)) {
        _imagePreviewInstance.obj.volume = (_imagePreviewInstance.obj.volume.match(/\d+/)[0] >> 0) * 1024 * 1024 * 1024;
      } else {
        _imagePreviewInstance.obj.volume = (_imagePreviewInstance.obj.volume.match(/\d+/)[0] >> 0); 
      }
    } else {
      _imagePreviewInstance.obj.volume = _imagePreviewInstance.obj.volume >> 0;
    }

    if (_imagePreviewInstance.obj.ratio) {
      _imagePreviewInstance.obj.useValidate = true;
      _imagePreviewInstance.obj.validateType.push('ratio');
    } else if (_imagePreviewInstance.obj.width || _imagePreviewInstance.obj.height) {
      _imagePreviewInstance.obj.useValidate = true;
      _imagePreviewInstance.obj.validateType.push('size');
    }

    if (_imagePreviewInstance.obj.volume) {
      _imagePreviewInstance.obj.useValidate = true;
      _imagePreviewInstance.obj.validateType.push('volume');
    }

    if (_imagePreviewInstance.obj.type) {
      _imagePreviewInstance.obj.acceptType = _imagePreviewInstance.obj.type.match(/jpg|jpeg|gif|png/g);
      _imagePreviewInstance.obj.validateType.push('type');

      if (_imagePreviewInstance.obj.acceptType.includes('jpg') && !_imagePreviewInstance.obj.acceptType.includes('jpeg')) {
        _imagePreviewInstance.obj.acceptType.push('jpeg');
      }
    }

    _imagePreviewInstance.readFiles(element);
  };

  ImagePreview.prototype.addEvent = function (element, events, callback) {
    var event, eventCounter, eventLength, moderator;

    moderator = function (event) {
      var e = event || window.event;

      if (!e.target) {
        e.target = e.srcElement;
      }

      if (!e.preventDefault) {
        e.preventDefault = function () {
          e.returnValue = false;
          e.defaultPrevented = true;
        };
      }

      return callback.call(this, e);
    };

    events = events.split(' ');
    eventCounter = 0;
    eventLength = events.length;

    for (; eventCounter < eventLength; eventCounter++) {
      event = events[eventCounter];

      if (element.addEventListener) {
        element.addEventListener(event, callback, false);
      } else {
        element.attachEvent('on' + event, moderator);
      }
    }
  };

  ImagePreview.prototype.readFiles = function (element) {
    var reader = new FileReader();

    if (reader) {
      var files, readFile;

      files = element.files;
      readFile = function (index) {
        var file, fileVolume, imageType, fileInfo;

        if (index >= files.length) return;

        file = files[index];
        imageType = /^image.*$/;

        fileInfo = {};

        fileInfo.fileName = file.name;
        fileInfo.fileType = file.type;
        fileInfo.fileVolume = file.size;
        fileInfo.errorType = null;
        fileInfo.width = 0;
        fileInfo.height = 0;
        fileInfo.ratio = 0;
        fileInfo.image = null;

        if (!imageType.test(file.type)) {
          _imagePreviewInstance.obj.wrongFiles.push(fileInfo);
          _imagePreviewInstance.obj.notFittable = true;
          fileInfo.errorType = 'type';
          if (index === files.length - 1) {
            element.value = null;
            if (typeof _imagePreviewInstance.obj.failedFunc === 'function') _imagePreviewInstance.obj.failedFunc(_imagePreviewInstance.obj.rightFiles, _imagePreviewInstance.obj.wrongFiles);
          }
        }

        reader.onload = function (e) {
          var div, image;

          div = document.createElement('div');
          image = document.createElement('img');

          image.src = e.target.result;
          image.onload = function () {
            var w, h, ratio, type;

            w = this.width;
            h = this.height;
            ratio = Number((h / w).toFixed(2));
            fileExtension = fileInfo.fileType.replace(/^image\//, '');

            fileInfo.width = w;
            fileInfo.height = h;
            fileInfo.ratio = ratio;
            fileInfo.image = image;

            if (
                   (_imagePreviewInstance.obj.validateType.includes('volume') && (_imagePreviewInstance.obj.volume && fileInfo.fileVolume > _imagePreviewInstance.obj.volume) && (fileInfo.errorType = 'volume')) ||
                   (_imagePreviewInstance.obj.validateType.includes('ratio') && (_imagePreviewInstance.obj.ratio && ratio !== _imagePreviewInstance.obj.ratio) && (fileInfo.errorType = 'ratio')) ||
                   (_imagePreviewInstance.obj.validateType.includes('size') && (_imagePreviewInstance.obj.width && _imagePreviewInstance.obj.height && (w !== _imagePreviewInstance.obj.width || h !== _imagePreviewInstance.obj.height)) && (fileInfo.errorType = 'size')) ||
                   (_imagePreviewInstance.obj.validateType.includes('type') && (_imagePreviewInstance.obj.type && !_imagePreviewInstance.obj.acceptType.includes(fileExtension)) && (fileInfo.errorType = 'type'))
            ) {
              _imagePreviewInstance.obj.wrongFiles.push(fileInfo);
              _imagePreviewInstance.obj.notFittable = true;
            } else {
              _imagePreviewInstance.obj.rightFiles.push(fileInfo);
              if (_imagePreviewInstance.obj.useBins) _imagePreviewInstance.appendFile(element, index, false);
            }

            if (typeof _imagePreviewInstance.obj.renderFunc === 'function') {
              _imagePreviewInstance.obj.renderFunc(image);
            } else {
              element.insertAdjacentElement('afterend', image);
            }

            if (index === files.length - 1) {
              if (_imagePreviewInstance.obj.notFittable) {
                element.value = null;
                if (typeof _imagePreviewInstance.obj.failedFunc === 'function') _imagePreviewInstance.obj.failedFunc(_imagePreviewInstance.obj.rightFiles, _imagePreviewInstance.obj.wrongFiles);
              } else {
                if (typeof _imagePreviewInstance.obj.successFunc === 'function') {
                  if (_imagePreviewInstance.obj.useBins) {
                    _imagePreviewInstance.appendFile(element, index, true);
                  } else {
                    _imagePreviewInstance.obj.successFunc(_imagePreviewInstance.obj.rightFiles, _imagePreviewInstance.obj.wrongFiles);
                  }
                }
              }
            }

            return;
          };

          readFile(index + 1);
        };
        reader.readAsDataURL(file);
      };
      readFile(0);
    }
  };

  ImagePreview.prototype.appendFile = function (element, index, isLast) {
    var reader, files, readFile;

    reader = new FileReader();
    files = element.files;

    if (isLast) {
      if (typeof _imagePreviewInstance.obj.successFunc === 'function') {
        _imagePreviewInstance.obj.successFunc(_imagePreviewInstance.obj.rightFiles, _imagePreviewInstance.obj.wrongFiles, _imagePreviewInstance.obj.bins);
      }
    } else {
      readFile = function (index) {
        var file = files[index];

        reader.onload = function (e) {
          var bin = e.target.result;

          _imagePreviewInstance.obj.bins.push(bin);
        };

        reader.readAsBinaryString(file);
      };

      readFile(index);
    }
  };

  window.imagePreview = imagePreview;
})();

