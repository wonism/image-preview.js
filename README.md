# image-preview.js
This is a open source project to get image preview when user upload image file.

## How to use
```html
<!-- add easy-map.js in head -->
<script type="text/javascript" src="path/to/image-preview.min.js"></script>
```

## Browser Support
- PC
  - Firefox(Gecko) : 3.6 (1.9.2)
  - Chrome : 7
  - Internet Explorer : 10
  - Opera : 12.02
  - Safari : 6.0.2
- Mobile
  - Firefox Mobile (Gecko) : 32
  - Android : 3
  - IE Mobile : 10
  - Opera Mobile : 11.5
  - Safari Mobile : 6.1
- If you want to use in IE version, use polyfill for &lsquo;fileReader API&rsquo;.

## Options
__HTML (data-attributes)__
- `data-get-preview` - If you want to use this function, use this data-attribute in &lt;img&gt;, &lt;input&gt;.
- `data-width` - Purpose for limit image size (width).
- `data-height` - Purpose for limit image size (height).
- `data-allow-type` - Purpose for limit image type. example) [type1, type2, type3]

__Java Script__
- first parameter : this (YOU MUST PASS **THIS** **HERE** !!!)
- second parameter : function that launch after upload image successfully. It can get a object about uploaded file.
- third parameter : function that launch after failed to upload image. It can get a object about uploaded file and &lsquo;what is wrong&rsquo;.

## Example
```html
<!-- Add <img>, <input> with 'data-get-preview' -->
<div>
  <input type="file" data-get-preview />
  <img src="" alt="" data-get-preview' data-width="300" data-height="300" data-allow-type="[png, jpg, gif]" />
</div>
```

```js
// You shoud bind the function to element.

// Native Java Script
var afterSuccess = function () {
  console.log('Image is uploaded!');
};

var afterFailed = function (obj) {
  console.log(obj, 'Failed!');
};

var fileReaders = document.querySelectorAll('input[type="file"][data-get-preview]');

for (var i = 0; i < fileReaders.length; i++) {
  if (fileReaders[i].addEventListener) {
    fileReaders[i].addEventListener('change', function() {
      getPreview(this, afterSuccess, afterFailed);
    });
  } else if (fileReaders[i].attachEvent) {
    fileReaders[i].attachEvent('onchange', function() {
      getPreview(this, afterSuccess, afterFailed);
    });
  }
}

// jQuery
$('body').on('change', 'input[type="file"][data-get-preview]', function () {
  getPreview(this, afterSuccess, afterFailed);
});
```

##Licence
MIT

