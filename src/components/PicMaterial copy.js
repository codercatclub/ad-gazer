import AFRAME from 'aframe';
const THREE = AFRAME.THREE;

import PicVert from '../shaders/PicVert.glsl';
import PicFrag from '../shaders/PicFrag.glsl';
const doRoutine = function (coroutine) {
  let r = coroutine.next();
  return r.done;
}
export default {
  schema: {
    map: { default: new THREE.Texture() },
  },

  init: function () {
    let img = document.querySelector(this.data.map);
    let tex = new THREE.Texture(img);
    tex.needsUpdate = true;
    this.picMaterial = new THREE.ShaderMaterial({
      vertexShader: PicVert,
      fragmentShader: PicFrag,
      uniforms: {
        timeMsec: {value: 0},
        force: {value: 0},
        pos: {value: 0},
        noiseMag: {value: 0},
        map: {value: tex}
      }
    });

      this.mesh = this.el.object3D.getObjectByProperty('type', 'Mesh');
      this.mesh.material = this.picMaterial;

      this.wPos = new THREE.Vector3();
      this.el.object3D.getWorldPosition(this.wPos);
      this.side = -this.wPos.x;
      this.picMaterial.uniforms.pos.value = 3.0*this.side;



      this.popInRoutine = function* () {
        let t = 0.001;
        this.picMaterial.uniforms.noiseMag.value = 1

        while (t <= 1) {
          this.picMaterial.uniforms.force.value = this.side * t*t;
          this.picMaterial.uniforms.pos.value = 3.0*this.side * (1.0 - t*t);
          t += 0.001 * this.timeDelta;
          yield;
        }
        while (t >= 0) {
          this.picMaterial.uniforms.force.value = this.side * t*t;
          t -= 0.0005 * this.timeDelta;
          this.picMaterial.uniforms.noiseMag.value = t
          yield;
        }
      }
    },

  tick: function (time, timeDelta) {
    this.timeDelta = timeDelta;
    if(this.mpopInRoutine) {
      if(doRoutine(this.mpopInRoutine)){
        this.mpopInRoutine = null;
      }
    }
    this.picMaterial.uniforms.timeMsec.value = time;

    let camY = -0.001*window.scrollY;
    if(Math.abs(camY - this.wPos.y) < 0.1 && this.mpopInRoutine == null)
    {
      this.mpopInRoutine = this.popInRoutine();
    }
  },
}
