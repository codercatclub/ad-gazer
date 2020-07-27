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
      // window.localStorage.clear();
    }


    //get setup for tracking
    let calibButtons = document.querySelectorAll("input.Calibration");
    this.calibResp = {}
    calibButtons.forEach((b) => {
      this.calibResp[b.id] = 0;
      b.onclick = () => {
        if(window.eyeData != null)
        {
          this.calibResp[b.id] ++;
          if(this.calibResp[b.id] > 5)
          {
            b.style.backgroundColor = "pink"
          }
        }
      }
    });
  },

  collisionEyeListener: function (data) {
    window.eyeData = data;
  },

  tick: function (time, timeDelta) {
    if(this.doneCalibrating) return;
    // Do something on every scene tick or frame.
    let doneCalibrating = true;
    Object.keys(this.calibResp).forEach((key) => {
      if(this.calibResp[key] <= 5)
      {
        doneCalibrating = false;
      }
    })
    if(doneCalibrating)
    {
      this.doneCalibrating = true;
      document.querySelector("div.ui").style.visibility = "visible";
      document.querySelector("div.calibrationDiv").style.visibility = "hidden";
      this.el.sceneEl.setAttribute("visible", "true");
      window.scrollTo(0, 0);
      webgazer.params.showFaceOverlay = false;
      webgazer.params.showFaceFeedbackBox = false;
      document.getElementById("webgazerFaceOverlay").style.display = 'none';
      document.getElementById("webgazerFaceFeedbackBox").style.display = 'none';
    }
  },
}
