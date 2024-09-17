export class SnapPoint {
  x: number;
  y: number;
}

export class DraggableElementOrEvent extends HTMLElement {
  mouseX?: number;
  mouseY?: number;
  disableStyleReset?: boolean;
  snapPoints?: SnapPoint[];
  disableEditing?: boolean;
  detectAsClickToEdit?: boolean;
  startedTyping?: boolean;
}

export class DraggableSettings {
  enableKeyboardMovement?: boolean; // true;
  disableStyleReset?: boolean; // false;
  disableEditing?: boolean; // false;
  snapPoints?: SnapPoint[];
  snapGridSize?: number;
  snapThreshold?: number;
  mouseDownCallback?: (element: DraggableElementOrEvent) => void;
  touchStartCallback?: (element: DraggableElementOrEvent) => void;
  mouseMoveCallback?: (element: DraggableElementOrEvent) => void;
  touchMoveCallback?: (element: DraggableElementOrEvent) => void;
  mouseUpCallback?: (element: DraggableElementOrEvent) => void;
  touchEndCallback?: (element: DraggableElementOrEvent) => void;
  snapCallback?: (left: number, top: number) => void;
  keyboardMoveCallback?: (element: DraggableElementOrEvent) => void;
  blurCallback?: (element: DraggableElementOrEvent) => void;
}
