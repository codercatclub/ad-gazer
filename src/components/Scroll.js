import AFRAME from 'aframe';
const THREE = AFRAME.THREE;

export default {
  schema: {
  },

  init: function () {
    document.addEventListener('scroll', (event) => {
      this.el.object3D.position.y = -0.001*window.scrollY;
    });
  },

  tick: function (time, timeDelta) {
    // Do something on every scene tick or frame.
  },
}
