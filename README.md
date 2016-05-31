# image-preview.js
This is a open source project to get image preview when user upload image file.

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
- If you want to use in IE version,
  use polyfill for &lsquo;fileReader API&rsquo;.

## How to use
```html
<!-- your-html-file.html -->
<!-- add image-preview.js in head -->
<script type="text/javascript" src="path/to/image-preview.min.js"></script>
```

```js
/***** your-js-file.js *****/
imagePreview.init(ELEMENT, WIDTH, HEIGHT, RATIO, FILE_TYPE, FILE_SIZE,
    CHOOSE_USING_BINARY_FILES, FUNCTION_THAT_EXECUTE_AFTER_SUCCESS,
    FUNCTION_THAT_EXECUTE_AFTER_FAILED, FUNCTION_THAT_EXECUTE_AFTER_LOADED_IMAGES);
```

## Parameters
- ELEMENT : Element **(REQUIRED !!)**
  - Input elemenent
- WIDTH : Number
  - Width restriction (unit : px)
- HEIGHT : Number
  - Height restriction (unit : px)
- RATIO : Number
  - Constrain proportions
- FILE_TYPE : String
  - File type restriction
- FILE_SIZE : Number or String with unit
  - Maximum file size
  - If use Number, unit is `bits`
  - If use String, You can set unit like this... `50mb`, `20KB` (it ignores case)
- CHOOSE_USING_BINARY_FILES : Boolean
  - If you want to get binary files, You have to use TRUE.
  - You can use binary files through 3rd parameter in
    FUNCTION_THAT_EXECUTE_AFTER_SUCCESS
- FUNCTION_THAT_EXECUTE_AFTER_SUCCESS : Function
  - You can use 3 parameters
    - 1. Right Files&rsquo; informations
    - 2. Wrong Files&rsquo; informations
    - 3. Binary Files that were from &gt;input&lt;
- FUNCTION_THAT_EXECUTE_AFTER_FAILED : Function
  - You can use 2 parameters
    - 1. Right Files&rsquo; informations
    - 2. Wrong Files&rsquo; informations
- FUNCTION_THAT_EXECUTE_AFTER_FAILED : Function
  - You can use a parameter
    - A image (&#61; parameter) that was from input.
    - It can be rendered by this function If you want.

## Example
```js
var afterSuccess = function (obj, image, bins) {
  console.log(obj, image, bins);
};

var afterFailed = function (obj, image) {
  console.log(obj, image);
};

var renderFunc = function (image) {
  console.log(image);
  // Handle images...
};

/***** You shoud bind the function to element. *****/
// Native Java Script
document.getElementById('file').onchange = function () {
  // imagePreview.init(this, 0, 0, 0, 'png jpg', '10mb', true, afterSuccess, afterFailed, renderFunc);
  imagePreview.init(this, 0, 0, 0, 'png jpg', '10mb', true, afterSuccess, afterFailed);
};

// jQuery
$('body').on('change', '#file', function () {
  imagePreview.init(this, 0, 0, 0, 'png jpg', '10mb', true, afterSuccess, afterFailed);
});
```

## If you find **typo** or **incorrect expression** **Send a PULL REQUEST**

##Licence
MIT

