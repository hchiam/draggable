# Make anything draggable. And editable. ![version](https://img.shields.io/github/release/hchiam/draggable?style=flat-square)

[Live demo](https://codepen.io/hchiam/pen/pobxgBo)

```js
https://cdn.jsdelivr.net/gh/hchiam/draggable@main/makeElementDraggable.js
https://cdn.jsdelivr.net/gh/hchiam/draggable@main/makeElementDraggableAndEditable.js
```

```js
https://cdn.jsdelivr.net/gh/hchiam/draggable@3.3.3/makeElementDraggable.js
https://cdn.jsdelivr.net/gh/hchiam/draggable@3.3.3/makeElementDraggableAndEditable.js
```

Example usage:

```js
var element = document.getElementById("#some-selector");
var settings = {
  // NOTE: settings are all optional:
  disableStyleReset: false, // false by default
  disableEditing: false, // false by default
  mouseDownCallback: function () {}, // optional
  touchStartCallback: function () {}, // optional
  mouseMoveCallback: function () {}, // optional
  touchMoveCallback: function () {}, // optional
  mouseUpCallback: function () {
    // optional
    alert("mouseup");
  },
  touchEndCallback: function () {}, // optional
  blurCallback: function () {}, // optional
  snapCallback: function () {}, // optional
};
// now to actually use it:
makeElementDraggableAndEditable(element, settings);
// or: makeElementDraggable(element, settings);
```

CDN usage:

```html
<script
  src="https://cdn.jsdelivr.net/gh/hchiam/draggable@3.3.3/makeElementDraggable.js"
  integrity="sha384-uGbhuYQsHp74L7FODkOG2tqGr18fDmRb8v5W4gCZ8WWua/4vADwlFidjMMpOFymO"
  crossorigin="anonymous"
></script>
```

Or:

```html
<script
  src="https://cdn.jsdelivr.net/gh/hchiam/draggable@3.3.3/makeElementDraggableAndEditable.js"
  integrity="sha384-CfSB3xtH/f0+wA4modBYpZ2NAp/qNS0ZbQoc4tXCgdqP9/0X4oS6NqarAjs+CXVN"
  crossorigin="anonymous"
></script>
```

```bash
# get the things to put into integrity="...":
bash get-integrity.sh;
```
