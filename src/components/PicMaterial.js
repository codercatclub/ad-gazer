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
        offset: {value: 30 * Math.random()},
        pos: {value: 0},
        noiseMag: {value: 0},
        colorMag: {value: 0},
        map: {value: tex}
      }
    });

      this.mesh = this.el.object3D.getObjectByProperty('type', 'Mesh');
      this.mesh.material = this.picMaterial;

      this.wPos = new THREE.Vector3();
      this.el.object3D.getWorldPosition(this.wPos);
      this.side = -this.wPos.x;
      this.picMaterial.uniforms.pos.value = 3.0*this.side;
      this.colorMag = 0;
    },

  tick: function (time, timeDelta) {
    this.timeDelta = timeDelta;
    this.picMaterial.uniforms.timeMsec.value = time;

    let camY = -0.001*window.scrollY;
    let t = 2.0 * (this.wPos.y - (camY-0.5));

    // if(Math.abs(t) > 3) {
    //   return;
    // };
    //check if collision
    if(window.eyeQuadrant != null)
    {
      // check if eye is in 1st or 3st section
     let v = window.eyeQuadrant;
      if((v > 2 && this.side < 0) || (v < 1 && this.side > 0))
      {
        this.colorMag = Math.min(this.colorMag + 0.0001 * timeDelta, 1);
      } else {
        this.colorMag = Math.max(this.colorMag - 0.001 * timeDelta, 0);
      }
    } else {
      this.colorMag = Math.max(this.colorMag - 0.001 * timeDelta, 0);
    }
    this.picMaterial.uniforms.colorMag.value = this.colorMag;

    let clampT = Math.min(Math.max(t,-1),1);
    if(clampT < 0)
    {
      let m = clampT + 1;
      this.picMaterial.uniforms.force.value = this.side * m*m;
      this.picMaterial.uniforms.pos.value = 2.0*this.side * (1.25 - m*m);
    } else {
      let m = 1 - clampT;
      this.picMaterial.uniforms.pos.value = 2.0*this.side * (1.1 - 1);
      this.picMaterial.uniforms.force.value = this.side * m*m;
      this.picMaterial.uniforms.noiseMag.value = m;
    }
  },
}
