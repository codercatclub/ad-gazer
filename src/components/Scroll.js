import AFRAME from 'aframe';
const THREE = AFRAME.THREE;

export default {
  schema: {
  },

  init: function () {
    console.log(document.querySelector('.sections'));
    document.querySelector('.sections').addEventListener('scroll', (event) => {
      console.log('scroll');
    });
  },

  tick: function (time, timeDelta) {
    // Do something on every scene tick or frame.
  },
}
