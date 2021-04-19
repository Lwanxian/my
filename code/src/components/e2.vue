<template>
  <div>
    <div id="container"></div>
  </div>
</template>
 
<script>
import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module";
import { GUI } from "three/examples/jsm/libs/dat.gui.module";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
export default {
  data() {
    return {
      camera: null,
      scene: null,
      renderer: null,
      mesh: null,
      controls: null,
      params: { enableWind: true, showBall: false, togglePins: togglePins },
      DAMPING: 0.03,
      DRAG: 1 - DAMPING,
      MASS: 0.1,
      restDistance: 25,
      xSegs: 10,
      ySegs: 10,
      clothFunction: null,
      cloth: null,
      GRAVITY: 981 * 1.4,
      gravity: null,
      TIMESTEP: 18 / 1000,
      TIMESTEP_SQ: null,
      pins: [],
      windForce: null,
      ballPosition: null,
      ballSize: 60,
      tmpForce: null,
    };
  },
  methods: {
    init: function () {
      let container = document.getElementById("container");
      this.camera = new THREE.PerspectiveCamera();
      this.clothFunction = plane(
        restDistance * this.xSegs,
        restDistance * this.ySegs
      );
      this.cloth = new Cloth(this.xSegs, this.ySegs);
      this.gravity = new THREE.Vector3(0, -this.GRAVITY, 0).multiplyScalar(
        this.MASS
      );
      this.TIMESTEP_SQ = this.TIMESTEP * this.TIMESTEP;
      this.windForce = new THREE.Vector3(0, 0, 0);
      this.ballPosition = new THREE.Vector3(0, -45, 0);
      this.tmpForce = new THREE.Vector3();
    },
    plane: function (width, height) {
      return function (u, v, target) {
        const x = (u - 0.5) * width;
        const y = (v + 0.5) * height;
        const z = 0;

        target.set(x, y, z);
      };
    },
    Particle: function (x, y, z, mass) {
      this.position = new THREE.Vector3();
      this.previous = new THREE.Vector3();
      this.original = new THREE.Vector3();
      this.a = new THREE.Vector3(0, 0, 0); // acceleration
      this.mass = mass;
      this.invMass = 1 / mass;
      this.tmp = new THREE.Vector3();
      this.tmp2 = new THREE.Vector3();
      clothFunction(x, y, this.position); // position
      clothFunction(x, y, this.previous); // previous
      clothFunction(x, y, this.original);
    },

    animate: function () {},
  },
  created() {
    this.Particle.prototype.addForce = function (force) {
      this.a.add(this.tmp2.copy(force).multiplyScalar(this.invMass));
    };
    this.Particle.prototype.integrate = function (timesq) {
      const newPos = this.tmp.subVectors(this.position, this.previous);
      newPos.multiplyScalar(DRAG).add(this.position);
      newPos.add(this.a.multiplyScalar(timesq));
      this.tmp = this.previous;
      this.previous = this.position;
      this.position = newPos;

      this.a.set(0, 0, 0);
    };
  },
  mounted() {
    this.init();
    this.animate();
    this.plane();
    this.Particle();
  },
};
</script>
<style scoped>
</style>
