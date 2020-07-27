import AFRAME from 'aframe';
require('aframe-gltf-part-component');
require('aframe-extras');
import Foo from './components/Foo';
import CameraAnimation from './components/CameraAnimation';
import Scroll from './components/Scroll';
import Gazer from './components/Gazer';
import PicMaterial from './components/PicMaterial';
const THREE = AFRAME.THREE;

// Register all shaders
// Register all systems
// AFRAME.registerSystem('dynamic-components', DynamicComponents);

// Register all components
AFRAME.registerComponent('foo', Foo);
AFRAME.registerComponent('camera-animation', CameraAnimation);
AFRAME.registerComponent('scroll', Scroll);
AFRAME.registerComponent('gazer', Gazer);
AFRAME.registerComponent('pic-material', PicMaterial);
