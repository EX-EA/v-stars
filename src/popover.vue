<template>
  <div class="popover" ref="popover">
    <div
      ref="contentWrapper"
      class="content-wrapper"
      v-show="visible"
      :class="{ [`position-${position}`]: true }"
    >
      <slot name="content"></slot>
    </div>
    <span ref="triggerWrapper" style="display: inline-block">
      <slot></slot>
    </span>
  </div>
</template>

<script>
export default {
  name: 'StarsPopover',
  data() {
    return { visible: false, timer: null };
  },
  props: {
    trigger: {
      type: String,
      default: 'click',
      validator(val) {
        return ['click', 'hover'].indexOf(val) > -1;
      },
    },
    position: {
      type: String,
      default: 'top',
      validator(value) {
        return ['top', 'bottom', 'left', 'right'].indexOf(value) > -1;
      },
    },
  },
  computed: {
    openEvent() {
      if (this.trigger === 'click') {
        return 'click';
      } else {
        return 'mouseenter';
      }
    },
    closeEvent() {
      if (this.trigger === 'click') {
        return 'click';
      } else {
        return 'mouseleave';
      }
    },
  },
  methods: {
    toggleVisible() {
      this.visible = !this.visible;
    },
    close() {
      this.visible = false;
      document.removeEventListener('click', this.onClickDocument);
      this.timer = 0;
      clearTimeout(this.timer);
    },
    open() {
      this.visible = true;
      this.$nextTick(this.positionPopper);
      this.timer = setTimeout(() => {
        document.addEventListener('click', this.onClickDocument);
      });
    },
    onClick(ev) {
      if (this.$refs.triggerWrapper.contains(ev.target)) {
        if (this.visible) {
          this.close();
        } else {
          this.open();
        }
      }
    },
    // 定位 popper
    positionPopper() {
      let { contentWrapper, triggerWrapper } = this.$refs;
      document.body.appendChild(contentWrapper);
      const position = this.position;
      let { height: heightPopover } = contentWrapper.getBoundingClientRect();
      let { width, height, top, left } = triggerWrapper.getBoundingClientRect();

      const options = {
        top: {
          left: left + window.scrollX,
          top: top + window.scrollY,
        },
        bottom: {
          left: left + window.scrollX,
          top: height + top + window.scrollY,
        },
        left: {
          left: left + window.scrollX,
          top: top + window.scrollY + (height - heightPopover) / 2,
        },
        right: {
          left: left + width + window.scrollX,
          top: top + window.scrollY + (height - heightPopover) / 2,
        },
      };

      contentWrapper.style.left = options[position].left + 'px';
      contentWrapper.style.top = options[position].top + 'px';
    },
    onClickDocument(e) {
      // 点击区域在 popper 中时，不关闭 popper
      let flag =
        this.$refs.popover &&
        (this.$refs.contentWrapper.contains(e.target) ||
          this.$refs.contentWrapper === e.target);

      if (flag) return;
      this.close();
    },
  },
  mounted() {
    const { popover } = this.$refs;
    if (this.trigger === 'click') {
      popover.addEventListener('click', this.onClick);
    } else {
      popover.addEventListener(this.openEvent, this.open);
      popover.addEventListener(this.closeEvent, this.close);
    }
  },
  beforeDestroy() {
    const { popover } = this.$refs;
    if (this.trigger === 'click') {
      popover.removeEventListener('click', this.onClick);
    } else {
      popover.removeEventListener(this.openEvent, this.open);
      popover.removeEventListener(this.closeEvent, this.close);
    }
  },
};
</script>

<style scoped lang="scss">
$border-color: #333;
$border-radius: 4px;
.popover {
  display: inline-block;
  vertical-align: top;
  position: relative;
}
.content-wrapper {
  position: absolute;
  border: 1px solid $border-color;
  border-radius: $border-radius;
  background: white;
  filter: drop-shadow(0 0 3px rgba(0, 0, 0, 0.5));
  padding: 0.5em 1em;
  max-width: 20em;
  word-wrap: break-word;
  ::before,
  ::after {
    content: '';
    display: block;
    border: 8px solid transparent;
    position: absolute;
  }
  &.position-top {
    transform: translateY(-100%);
    margin-top: -10px;
    ::before,
    ::after {
      left: 10px;
    }
    ::before {
      top: 100%;
      border-top-color: black;
    }
    ::after {
      border-top-color: white;
      top: calc(100% - 1px);
    }
  }
  &.position-bottom {
    margin-top: 10px;
    ::before,
    ::after {
      left: 10px;
    }
    ::before {
      border-bottom-color: black;
      bottom: 100%;
    }
    ::after {
      border-bottom-color: white;
      bottom: calc(100% - 1px);
    }
  }
  &.position-left {
    transform: translateX(-100%);
    margin-left: -10px;
    ::before,
    ::after {
      transform: translateY(-50%);
      top: 50%;
    }
    ::before {
      border-left-color: black;
      left: 100%;
    }
    ::after {
      border-left-color: white;
      left: calc(100% - 1px);
    }
  }
  &.position-right {
    margin-left: 10px;
    ::before,
    ::after {
      transform: translateY(-50%);
      top: 50%;
    }
    ::before {
      border-right-color: black;
      right: 100%;
    }
    ::after {
      border-right-color: white;
      right: calc(100% - 1px);
    }
  }
}
</style>
