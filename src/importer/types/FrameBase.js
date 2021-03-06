import Color from "../formats/Color";
import Vector2D from "../formats/Vector2D";
import Rect from "../formats/Rect";
import Global from "./Global";
import SuperMath from "../utils/SuperMath";
import Effect from "../formats/Effect";

export default class FrameBase extends Global {
  constructor(opts) {
    super(opts.id, opts.name, opts.type, opts.visible, opts.relativeTransform);
    this.children = [];

    if (opts.backgroundColor) {
      this.backgroundColor = new Color(opts.backgroundColor);
    }
    this.opacity = opts.opacity || 1;
    this.size = new Vector2D(opts.size);
    this.absoluteBoundingBox = new Rect(opts.absoluteBoundingBox);
    this.isMask = opts.isMask || false;
    this.effects = [];

    for (let effect of opts.effects || []) {
      this.effects.push(new Effect(effect));
    }
  }

  draw(refs) {
    let el = document.createElement("div");
    el.style.width = `${this.absoluteBoundingBox.width}px`;
    el.style.height = `${this.absoluteBoundingBox.height}px`;
    if (this.backgroundColor) {
      el.style.backgroundColor = this.backgroundColor.format();
    }
    el.style.position = "absolute";
    el.style.top = `${this.absoluteBoundingBox.y -
      (this.parentNode.absoluteBoundingBox.y || 0)}px`;
    el.style.left = `${this.absoluteBoundingBox.x -
      (this.parentNode.absoluteBoundingBox.x || 0)}px`;
    el.style.opacity = this.opacity;

    el.setAttribute("type", this.type);

    for (let child of this.children) {
      el.appendChild(child.draw(refs));
    }

    if (this.name.includes("#")) {
      refs[this.name.replace("#", "")] = el;
    }

    return el;
  }

  getSVGBounds() {
    return {
      x: this.absoluteBoundingBox.x,
      y: this.absoluteBoundingBox.y,
      width: this.absoluteBoundingBox.width,
      height: this.absoluteBoundingBox.height
    };
  }

  getRelativeTransform() {
    if (this.parentNode && this.parentNode.relativeTransform) {
      const isRootFrame =
        this.relativeTransform[0][2] === this.absoluteBoundingBox.x &&
        this.relativeTransform[1][2] === this.absoluteBoundingBox.y;

      return !isRootFrame
        ? SuperMath.multiplyMatrix(
            this.parentNode.getRelativeTransform(),
            this.relativeTransform
          )
        : SuperMath.identity();
    }

    return this.relativeTransform;
  }
}
