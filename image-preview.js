/**
 *
 * title   : Image Preview JS
 *
 * version : 0.1.0 (Beta)
 *
 * author  : Jaewon
 *
 * license : MIT
 *
 * github  : https://www.github.com/wonism
 *
 * blog : http://jaewonism.cf
 *
 */

// Query Selector Polyfill
if (!document.querySelectorAll) {
  document.querySelectorAll = function (selectors) {
    var style, elements, element;

    style = document.createElement('style'), elements = [];
    elements = [];
    element = undefined;

    document.documentElement.firstChild.appendChild(style);
    document._qsa = [];

    style.styleSheet.cssText = selectors + '{ x-qsa: expression(document._qsa && document._qsa.push(this)) }';
    window.scrollBy(0, 0);
    style.parentNode.removeChild(style);

    while (document._qsa.length) {
      element = document._qsa.shift();
      element.style.removeAttribute('x-qsa');
      elements.push(element);
    }

    document._qsa = null;
    return elements;
  };
}

var getPreview = function (element, sfn, fFn) {
  var image, width, height, reader;

  width = element.getAttribute('data-width') >> 0;
  height = element.getAttribute('data-height') >> 0;

  reader = new FileReader();

  if (reader && element.files[0] && element.files[0].type.match(/image/)) {
    var name, type, allowTypeArr, isCorrectType;

    name = element.files[0].name;
    type = element.files[0].type.replace(/image\//, '');
    allowTypeArr = null;
    isCorrectType = true;

    if (element.getAttribute('data-allow-type')) {
      allowTypeArr = element.getAttribute('data-allow-type').replace(/^\[|\]$/g, '').split(',').map(function (str) { return str.trim(); });
      if (type.match(/jpeg/)) {
        if (allowTypeArr.indexOf(type) === -1 && allowTypeArr.indexOf('jpg') === -1) {
          isCorrectType = false;
        }
      } else {
        if (allowTypeArr.indexOf(type) === -1) {
          isCorrectType = false;
        }
      }
    }

    reader.onload = function(e) {
      image = document.createElement('img');
      image.src = e.target.result;
      image.onload = function() {
        var w, h, obj;
        w = this.width;
        h = this.height;
        obj = {};

        if (!isCorrectType) {
          element.value = '';

          if (typeof fFn !== 'undefined') {
            obj.origin = {};
            obj.uploaded = {};
            obj.uploaded.file = element.files[0];
            obj.origin.allowType = allowTypeArr;
            obj.uploaded.allowType = type;

            fFn(obj);
          }

          return false;
        } else if ((width && width != w) || (height && height != h)) {
          element.value = '';

          if (typeof fFn !== 'undefined') {
            obj.origin = {};
            obj.uploaded = {};
            obj.uploaded.file = element.files[0];
            obj.origin.width = width;
            obj.uploaded.width = w;
            obj.origin.width = height;
            obj.uploaded.width = h;

            fFn(obj);
          }

          return false;
        } else {
          if (typeof sFn !== 'undefined') {
            obj.uploaded = {};
            obj.uploaded.file = element.files[0];
            sFn(obj);
          }

          element.parentNode.querySelectorAll('img[data-get-preview]')[0].src = e.target.result;
        }
        console.log('Uploaded image\'s name is ' + name);
      }
    };
    reader.readAsDataURL(element.files[0]);
  }
};
