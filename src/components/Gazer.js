import AFRAME from 'aframe';
const THREE = AFRAME.THREE;

export default {
  schema: {
  },

  init: function () {
    var localstorageLabel = 'webgazerGlobalData';
    window.localStorage.setItem(localstorageLabel, null);
    webgazer.setRegression('ridge')
      .setTracker('clmtrackr')
      .begin()
      .showPredictionPoints(true);

    webgazer.params.showVideo = false;
    window.applyKalmanFilter = true;
    webgazer.setGazeListener(this.collisionEyeListener);
    window.onbeforeunload = function () {
      webgazer.end();
      window.localStorage.clear();
    }

    window.msInAds = 0;
    this.isLoser = false;
    //get setup for tracking
    let calibButtons = document.querySelectorAll("input.Calibration");
    this.calibResp = {}
    calibButtons.forEach((b) => {
      this.calibResp[b.id] = 0;
      b.onclick = () => {
        if (window.eyeData != null) {
          this.calibResp[b.id]++;
          if (this.calibResp[b.id] > 5) {
            b.style.backgroundColor = "rgb(131, 218, 255)"
          }
        }
      }
    });
    
    this.tanFOV = Math.tan( ( ( Math.PI / 180 ) * 75 / 2 ) );
    this.windowHeight = 800; 
    
    window.addEventListener( 'resize', () => {
      this.onWindowResize();
    }, false );
    this.mainCamera = document.querySelector('#camera');
    this.mainCamera.addEventListener('object3dset', (evt) => {
      this.camera = evt.target.object3D.children[0]
      this.onWindowResize();
    });
  },

  onWindowResize: function(data) {
    if(this.camera)
    {
      this.camera.fov = ( 360 / Math.PI ) * Math.atan( this.tanFOV * ( window.innerHeight / this.windowHeight ) );
      this.camera.updateProjectionMatrix();
    }
  },

  collisionEyeListener: function (data) {
    window.eyeData = data;
    if (data == null) return;
    let eyeQuadrant = Math.floor(window.eyeData.x / (window.innerWidth / 4));
    window.eyeQuadrant = eyeQuadrant;

    if (window.doneCalibrating && (eyeQuadrant < 1 || eyeQuadrant > 2)) {
      window.msInAds += window.timeDelta;
    }
  },

  tick: function (time, timeDelta) {
    window.timeDelta = timeDelta;
    if (window.doneCalibrating) {
      if (window.msInAds > 5000 && !this.isLoser) {
        this.isLoser = true;
        // show lose screen
        this.el.sceneEl.setAttribute("visible", "false");
        document.querySelector("div.loseScreen").style.visibility = "visible";
        document.querySelector("p.loseText").innerText = Math.round(window.msInAds / 1000) + " seconds of your time was spent feuling ads :("
        document.querySelector("div.ui").style.visibility = "hidden";
        window.scrollTo(0, 0);
      }
      return;
    };
    // Do something on every scene tick or frame.
    let doneCalibrating = true;
    Object.keys(this.calibResp).forEach((key) => {
      if (this.calibResp[key] <= 5) {
        doneCalibrating = false;
      }
    })
    if (doneCalibrating) {
      window.doneCalibrating = true;
      document.querySelector("div.ui").style.visibility = "visible";
      document.querySelector("div.calibrationDiv").style.visibility = "hidden";
      this.el.sceneEl.setAttribute("visible", "true");
      window.scrollTo(0, 0);
      webgazer.params.showFaceOverlay = false;
      webgazer.params.showFaceFeedbackBox = false;
      webgazer.params.showGazeDot = false;
      document.getElementById("webgazerFaceOverlay").style.display = 'none';
      document.getElementById("webgazerFaceFeedbackBox").style.display = 'none';
      document.getElementById("webgazerGazeDot").style.display = 'none';
      this.onWindowResize();
    }
  },
}
