<template>
  <div>
    <div id="container"></div>
  </div>
</template>
 
<script>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Stats from "three/examples/jsm/libs/stats.module";

export default {
  data() {
    return {
      camera: null,
      scene: null,
      renderer: null,
      mesh: null,
      controls: null,
      stats: null,
      mouseX: 0,
      mouseY: 0,
      windowHalfX: window.innerWidth / 2,
      windowHalfY: window.innerHeight / 2,
    };
  },
  methods: {
    init: function () {
      let container = document.getElementById("container");

      this.camera = new THREE.PerspectiveCamera(
        20,
        window.innerWidth / window.innerHeight,
        1,
        10000
      );
      this.camera.position.z = 2700;

      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0xffffff);

      const light = new THREE.DirectionalLight(0xffccff);
      light.position.set(0, 0, 1);
      this.scene.add(light);

      const canvas = document.createElement("canvas");
      canvas.width = 120;
      canvas.height = 120;
      const context = canvas.getContext("2d");
      const gradient = context.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 2
      );
      gradient.addColorStop(0.1, "rgba(105,210,210,1)");
      gradient.addColorStop(1, "rgba(255,20,20,1)");
      const shadowTexture = new THREE.CanvasTexture(canvas);

      const shadowMaterial = new THREE.MeshBasicMaterial({
        map: shadowTexture,
      });
      const shadowGeo = new THREE.PlaneGeometry(300, 300, 1,1);

      let shadowMesh;
      shadowMesh = new THREE.Mesh(shadowGeo, shadowMaterial);
      shadowMesh.position.y = -250;
      shadowMesh.rotation.x = -Math.PI / 2;
      this.scene.add(shadowMesh);

      shadowMesh = new THREE.Mesh(shadowGeo, shadowMaterial);
      shadowMesh.position.y = -250;
      shadowMesh.position.x = -400;
      shadowMesh.rotation.x = -Math.PI / 2;
      this.scene.add(shadowMesh);

      shadowMesh = new THREE.Mesh(shadowGeo, shadowMaterial);
      shadowMesh.position.y = -250;
      shadowMesh.position.x = 400;
      shadowMesh.rotation.x = -Math.PI / 2;
      this.scene.add(shadowMesh);
      const radius = 200;

      const geometry1 = new THREE.IcosahedronGeometry(radius, 1);

      const count = geometry1.attributes.position.count;
      geometry1.setAttribute(
        "color",
        new THREE.BufferAttribute(new Float32Array(count * 3), 3)
      );

      const geometry2 = geometry1.clone();
      const geometry3 = geometry1.clone();

      const color = new THREE.Color();
      const positions1 = geometry1.attributes.position;
      const positions2 = geometry2.attributes.position;
      const positions3 = geometry3.attributes.position;
      const colors1 = geometry1.attributes.color;
      const colors2 = geometry2.attributes.color;
      const colors3 = geometry3.attributes.color;

      for (let i = 0; i < count; i++) {
        color.setHSL((positions1.getY(i) / radius + 1) / 2, 1.0, 0.5);
        colors1.setXYZ(i, color.r, color.g, color.b);

        color.setHSL(0, (positions2.getY(i) / radius + 1) / 2, 0.5);
        colors2.setXYZ(i, color.r, color.g, color.b);

        color.setRGB(1, 0.8 - (positions3.getY(i) / radius + 1) / 2, 0);
        colors3.setXYZ(i, color.r, color.g, color.b);
      }

      const material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        flatShading: true,
        vertexColors: true,
        shininess: 0,
      });
      const wireframeMaterial = new THREE.MeshBasicMaterial({
        color: 0x000000,
        wireframe: true,
        transparent: true,
      });

      this.mesh = new THREE.Mesh(geometry1, material);
      let wireframe = new THREE.Mesh(geometry1, wireframeMaterial);
      this.mesh.add(wireframe);
      this.mesh.position.x = -400;
      this.mesh.rotation.x = -1.87;
      this.scene.add(this.mesh);

      this.mesh = new THREE.Mesh(geometry2, material);
      wireframe = new THREE.Mesh(geometry2, wireframeMaterial);
      this.mesh.add(wireframe);
      this.mesh.position.x = 400;
      this.scene.add(this.mesh);

      this.mesh = new THREE.Mesh(geometry3, material);
      wireframe = new THREE.Mesh(geometry3, wireframeMaterial);
      this.mesh.add(wireframe);
      this.scene.add(this.mesh);

      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      container.appendChild(this.renderer.domElement);

      this.stats = new Stats();
      container.appendChild(this.stats.dom);

      document.addEventListener("mousemove", this.onDocumentMouseMove);

      window.addEventListener("resize", this.onWindowResize);
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    },
    onWindowResize: function () {
      this.windowHalfX = window.innerWidth / 2;
      this.windowHalfY = window.innerHeight / 2;
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    },
    onDocumentMouseMove: function (event) {
      this.mouseX = event.clientX - this.windowHalfX;
      this.mouseY = event.clientY - this.windowHalfY;
    },
    animate: function () {
      requestAnimationFrame(this.animate);
      this.renderer.render(this.scene, this.camera);
      this.stats.update();
    },
    render: function () {
      this.camera.position.x += (this.mouseX - this.camera.position.x) * 0.05;
      this.camera.position.y += (-this.mouseY - this.camera.position.y) * 0.05;

      this.camera.lookAt(this.scene.position);

      this.renderer.render(this.scene, this.camera);
    },
  },
  mounted() {
    this.init();
    this.animate();
    this.render();
  },
};
</script>
<style scoped>
#container {
  height: 100vh;
}
</style>
