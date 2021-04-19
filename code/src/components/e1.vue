<template>
  <div>
    <div id="container"></div>
  </div>
</template>
 
<script>
import * as THREE from "three";
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';

export default {
  data() {
    return {
      camera: null,
      scene: null,
      renderer: null,
      mesh: null,
      controls:null
    };
  },
  methods: {
    init: function () {
      let container = document.getElementById("container");

      this.camera = new THREE.PerspectiveCamera(
        70,
        container.clientWidth / container.clientHeight,
        0.01,
        10
      );
      this.camera.position.z = 1;

      this.scene = new THREE.Scene();

      let geometry = new THREE.BoxGeometry(0.1, 0.3, 0.2);
      let material = new THREE.MeshNormalMaterial();
      let axisHelper = new THREE.AxisHelper(500);

      this.mesh = new THREE.Mesh(geometry, material);
      this.scene.add(this.mesh, axisHelper);
      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(this.renderer.domElement);
       //创建控件对象
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    },
    animate: function () {
      requestAnimationFrame(this.animate);
      this.mesh.rotation.x += 0.01;
      this.mesh.rotation.y += 0.01;
      this.renderer.render(this.scene, this.camera);
    },
  },
  mounted() {
    this.init();
    this.animate();
  },
};
</script>
<style scoped>
#container {
  height: 400px;
}
</style>
