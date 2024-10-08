"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeElementDraggable = void 0;
function makeElementDraggable(element, settings) {
  element.mouseX = 0;
  element.mouseY = 0;
  element.disableStyleReset = (settings && settings.disableStyleReset) || false;
  element.snapPoints = (settings && settings.snapPoints) || []; // [ {x,y}, ... ]
  var handle =
    settings && settings.handleSelector
      ? element.querySelector(settings.handleSelector)
      : element;
  handle.addEventListener("mousedown", setupOnMouseDown, false);
  handle.addEventListener("touchstart", setupOnTouchStart, { passive: false });
  setupAriaLabel(element);
  if (!settings || !settings.disableKeyboardMovement) {
    setupKeyboardEvents(element);
  }
  function setupAriaLabel(element) {
    var ariaLabel = "";
    if (settings && settings.customAriaLabel) {
      ariaLabel = settings.customAriaLabel(element, settings);
    } else {
      if (settings && !settings.disableKeyboardMovement) {
        ariaLabel += "Draggable. ";
        if (!usingTouchScreen()) {
          ariaLabel += "To enter move mode, hit escape then the arrow keys. ";
        }
      }
      ariaLabel += "Text: " + element.innerText;
    }
    element.setAttribute("aria-label", ariaLabel);
  }
  function setupOnMouseDown(event) {
    var e = event || window.event;
    e.preventDefault();
    element.mouseX =
      e.clientX || (e.touches && e.touches.length && e.touches[0].pageX);
    element.mouseY =
      e.clientY || (e.touches && e.touches.length && e.touches[0].pageY);
    document.addEventListener("mouseup", stopDraggingOnMouseUp, false);
    document.addEventListener("mousemove", dragOnMouseMove, { passive: false });
    if (settings && settings.mouseDownCallback) {
      settings.mouseDownCallback(element);
    }
  }
  function setupOnTouchStart(event) {
    var e = event || window.event;
    e.preventDefault();
    element.mouseX =
      e.clientX || (e.touches && e.touches.length && e.touches[0].pageX);
    element.mouseY =
      e.clientY || (e.touches && e.touches.length && e.touches[0].pageY);
    document.addEventListener("touchend", stopDraggingOnTouchEnd, false);
    document.addEventListener("touchmove", dragOnTouchMove, { passive: false });
    if (settings && settings.touchStartCallback) {
      settings.touchStartCallback(element);
    }
  }
  function dragOnMouseMove(event) {
    drag(event);
    if (settings && settings.mouseMoveCallback) {
      settings.mouseMoveCallback(element);
    }
  }
  function dragOnTouchMove(event) {
    drag(event);
    if (settings && settings.touchMoveCallback) {
      settings.touchMoveCallback(element);
    }
  }
  var firstTimeDragging = true;
  function drag(event) {
    element.focus();
    var e = event || window.event;
    e.preventDefault();
    if (firstTimeDragging) {
      firstTimeDragging = false;
      var xChange =
        e.clientX - element.getBoundingClientRect().left ||
        (e.touches &&
          e.touches.length &&
          e.touches[0].pageX - element.getBoundingClientRect().left);
      var yChange =
        e.clientY - element.getBoundingClientRect().top ||
        (e.touches &&
          e.touches.length &&
          e.touches[0].pageY - element.getBoundingClientRect().top);
      element.mouseX =
        e.clientX || (e.touches && e.touches.length && e.touches[0].pageX);
      element.mouseY =
        e.clientY || (e.touches && e.touches.length && e.touches[0].pageY);
      element.style.left = element.mouseX - xChange + "px";
      element.style.top = element.mouseY - yChange + "px";
      makePositionDraggable(element);
    } else {
      var xChange =
        e.clientX - element.mouseX ||
        (e.touches && e.touches.length && e.touches[0].pageX - element.mouseX);
      var yChange =
        e.clientY - element.mouseY ||
        (e.touches && e.touches.length && e.touches[0].pageY - element.mouseY);
      element.mouseX =
        e.clientX || (e.touches && e.touches.length && e.touches[0].pageX);
      element.mouseY =
        e.clientY || (e.touches && e.touches.length && e.touches[0].pageY);
      element.style.left =
        Number(element.style.left.replace("px", "")) + xChange + "px";
      element.style.top =
        Number(element.style.top.replace("px", "")) + yChange + "px";
    }
  }
  var alreadyMadePositionDraggable = false;
  function makePositionDraggable(element) {
    if (alreadyMadePositionDraggable) return;
    alreadyMadePositionDraggable = true;
    if (
      !element.disableStyleReset ||
      typeof element.disableStyleReset !== "boolean"
    ) {
      element.style.setProperty(
        "width",
        element.getBoundingClientRect().width + "px",
        "important"
      );
      element.style.setProperty(
        "height",
        element.getBoundingClientRect().height + "px",
        "important"
      );
      element.style.marginBlockStart = "initial";
      element.style.minWidth = "1ch";
      element.style.minHeight = "1em";
      element.style.position = "fixed";
    }
  }
  function stopDraggingOnMouseUp() {
    document.removeEventListener("mouseup", stopDraggingOnMouseUp);
    document.removeEventListener("mousemove", dragOnMouseMove);
    snap(element);
    if (settings && settings.mouseUpCallback) {
      settings.mouseUpCallback(element);
    }
  }
  function stopDraggingOnTouchEnd() {
    document.removeEventListener("touchend", stopDraggingOnTouchEnd);
    document.removeEventListener("touchmove", dragOnTouchMove);
    snap(element);
    if (settings && settings.touchEndCallback) {
      settings.touchEndCallback(element);
    }
  }
  var snapTimer;
  function snap(element) {
    var _a;
    var elementRect = element.getBoundingClientRect();
    var left = elementRect.left;
    var top = elementRect.top;
    var width = elementRect.width;
    var height = elementRect.height;
    var middleLeft = left + width / 2;
    var middleTop = top + height / 2;
    var shouldRunSnapCallback = false;
    var snapWithinContainer = undefined;
    if (settings && settings.snapWithinElements) {
      settings.snapWithinElements.some(function (container) {
        // @ts-ignore TS2339
        if (container.checkVisibility()) {
          var containerRect = container.getBoundingClientRect();
          var containerStyles = getComputedStyle(container);
          var isCenterWithinContainer =
            middleLeft >= containerRect.left &&
            middleLeft <= containerRect.left + containerRect.width &&
            middleTop >= containerRect.top &&
            middleTop <= containerRect.top + containerRect.height;
          if (isCenterWithinContainer) {
            var newLeft =
              containerRect.left + containerRect.width / 2 - width / 2;
            var newTop =
              containerRect.top + containerRect.height / 2 - height / 2;
            element.style.left = newLeft + "px";
            element.style.top = newTop + "px";
            snapWithinContainer = container;
            shouldRunSnapCallback = true;
            snapTimer = setTimeout(function () {
              return true; // exit Array.some()
            }, 100);
          }
        }
      });
    }
    if (settings && settings.snapGridSize) {
      var threshold = settings.snapGridSize;
      var newLeft = snapToGrid(middleLeft, threshold) - width / 2;
      var newTop = snapToGrid(middleTop, threshold) - height / 2;
      element.style.left = newLeft + "px";
      element.style.top = newTop + "px";
      shouldRunSnapCallback = true;
    }
    if (element.snapPoints && element.snapPoints.length) {
      var threshold =
        (_a = settings && settings.snapThreshold) !== null && _a !== void 0
          ? _a
          : 50;
      clearTimeout(snapTimer);
      element.snapPoints.some(function (snapPoint) {
        if (isSnapPointInRange(snapPoint, middleLeft, middleTop, threshold)) {
          var newLeft = snapPoint.x - width / 2;
          var newTop = snapPoint.y - height / 2;
          element.style.left = newLeft + "px";
          element.style.top = newTop + "px";
          shouldRunSnapCallback = true;
          snapTimer = setTimeout(function () {
            return true; // exit Array.some()
          }, 100);
        }
      });
    }
    if (shouldRunSnapCallback && settings && settings.snapCallback) {
      settings.snapCallback(
        Number(element.style.left.replace("px", "")),
        Number(element.style.top.replace("px", "")),
        snapWithinContainer
      );
    }
  }
  function snapToGrid(value, gridSize) {
    gridSize = gridSize || 25;
    var newValue = gridSize * Math.floor(value / gridSize);
    return newValue;
  }
  function isSnapPointInRange(snapPoint, left, top, threshold) {
    threshold = threshold || 50;
    var a = snapPoint.x - left;
    var b = snapPoint.y - top;
    var c = Math.sqrt(a * a + b * b);
    return c <= threshold;
  }
  function setupKeyboardEvents(element) {
    handle.addEventListener(
      "keydown",
      function (event) {
        event.preventDefault();
        var arrowKey = getArrowKey(event);
        moveWithArrowKeys(element, arrowKey);
      },
      false
    );
  }
  function moveWithArrowKeys(element, arrowKey) {
    var offsetLeft = element.offsetLeft;
    var offsetTop = element.offsetTop;
    var scrollDelta = 10;
    switch (arrowKey) {
      case "ArrowLeft":
        offsetLeft -= scrollDelta;
        break;
      case "ArrowUp":
        offsetTop -= scrollDelta;
        break;
      case "ArrowRight":
        offsetLeft += scrollDelta;
        break;
      case "ArrowDown":
        offsetTop += scrollDelta;
        break;
      default:
        break;
    }
    element.style.left = offsetLeft + "px";
    element.style.top = offsetTop + "px";
    makePositionDraggable(element);
    if (settings && settings.keyboardMoveCallback) {
      settings.keyboardMoveCallback(element);
    }
  }
  function getArrowKey(event) {
    var e = event || window.event;
    var key = e.key || e.code || e.keyCode || e.which;
    switch (key) {
      case "ArrowLeft":
      case "Left":
      case 37:
        return "ArrowLeft";
      case "ArrowUp":
      case "Up":
      case 38:
        return "ArrowUp";
      case "ArrowRight":
      case "Right":
      case 39:
        return "ArrowRight";
      case "ArrowDown":
      case "Down":
      case 40:
        return "ArrowDown";
      default:
        return "";
    }
  }
  function usingTouchScreen() {
    var _a, _b;
    return (_b =
      (_a = window.matchMedia) === null || _a === void 0
        ? void 0
        : _a.call(window, "(hover: none) and (pointer: coarse)")) === null ||
      _b === void 0
      ? void 0
      : _b.matches;
  }
}
exports.makeElementDraggable = makeElementDraggable;
