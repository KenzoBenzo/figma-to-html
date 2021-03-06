<template>
    <div class="row-item">
        <slot></slot>
    </div>
</template>

<script>
import * as Draggable from "gsap/Draggable";

export default {
  props: ["index", "size", "margin"],
  watch: {
    index() {
      if (this.dragger.isDragging) return;

      this.move();
    }
  },
  methods: {
    onDragStart() {
      this.animation.play();
      this.dragger.update();
    },
    onRelease() {
      this.animation.reverse();
      this.move();
    },
    onDrag() {
      this.$parent.$parent.$emit("on-drag", {
        index: this.index,
        y: this.dragger.y,
        size: this.size
      });
    },
    move() {
      TweenLite.to(this.$el, 0.3, { y: this.index * this.size });
    }
  },
  beforeDestroy() {
    this.dragger.removeEventListener("dragstart", this.onDragStart);
    this.dragger.removeEventListener("release", this.onRelease);
    this.dragger.removeEventListener("drag", this.onDrag);
  },
  mounted() {
    TweenLite.set(this.$el, {
      height: this.size - this.margin.bottom,
      y: this.index * this.size
    });
    this.dragger = new Draggable(this.$el, {
      type: "y"
    });

    this.dragger.addEventListener("dragstart", this.onDragStart);
    this.dragger.addEventListener("release", this.onRelease);
    this.dragger.addEventListener("drag", this.onDrag);

    this.animation = TweenLite.to(this.$el, 0.3, {
      boxShadow: "rgba(0,0,0,0.2) 0px 16px 32px 0px",
      force3D: true,
      scale: 1.1,
      paused: true
    });
  }
};
</script>

<style>
.row-item {
  position: absolute;
  top: 0;
  left: 0;
}
</style>
