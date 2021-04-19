<template>
  <div>
    <div id="container"></div>
  </div>
</template>
<script>
import * as THREE from "three/build/three.module";
import Stats from "three/examples/jsm/libs/stats.module";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";
import { BufferGeometryUtils } from "three/examples/jsm/utils/BufferGeometryUtils";
export default {
  data() {
    return {
      camera: null,
      controls: null,
      scene: null,
      renderer: null,
      pickingTexture: null,
      pickingScene: null,
      highlightBox: null,
      pickingData: [],
      pickingMaterial: null,
      defaultMaterial: null,
      geometriesDrawn: [],
      geometriesPicking: [],
      matrix: null,
      quaternion: null,
      pointer: null,
      offset: null,
    };
  },
  methods: {
    init: function () {
      let container = document.getElementById("container");

      this.camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        1,
        10000
      );
      this.camera.position.z = 1000;

      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0xffffff);

      this.pickingScene = new THREE.Scene();
      this.pickingTexture = new THREE.WebGLRenderTarget(1, 1);
      this.scene.add(new THREE.AmbientLight(0x555555));

      const light = new THREE.SpotLight(0xffffff, 1.5);
      light.position.set(0, 500, 2000);
      this.scene.add(light);

      this.pickingMaterial = new THREE.MeshBasicMaterial({
        vertexColors: true,
      });
      this.defaultMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        flatShading: true,
        vertexColors: true,
        shininess: 0,
      });
      function applyVertexColors(geometry, color) {
        const position = geometry.attributes.position;
        const colors = [];

        for (let i = 0; i < position.count; i++) {
          colors.push(color.r, color.g, color.b);
        }

        geometry.setAttribute(
          "color",
          new THREE.Float32BufferAttribute(colors, 3)
        );
      }
      this.matrix = new THREE.Matrix4();
      this.quaternion = new THREE.Quaternion();
      var color = new THREE.Color();
      for (let i = 0; i < 5000; i++) {
        let geometry = new THREE.BoxGeometry();

        const position = new THREE.Vector3();
        position.x = Math.random() * 10000 - 5000;
        position.y = Math.random() * 6000 - 3000;
        position.z = Math.random() * 8000 - 4000;

        const rotation = new THREE.Euler();
        rotation.x = Math.random() * 2 * Math.PI;
        rotation.y = Math.random() * 2 * Math.PI;
        rotation.z = Math.random() * 2 * Math.PI;

        const scale = new THREE.Vector3();
        scale.x = Math.random() * 200 + 100;
        scale.y = Math.random() * 200 + 100;
        scale.z = Math.random() * 200 + 100;

        this.quaternion.setFromEuler(rotation);
        this.matrix.compose(position, this.quaternion, scale);

        geometry.applyMatrix4(this.matrix);

        applyVertexColors(geometry, color.setHex(Math.random() * 0xffffff));

        this.geometriesDrawn.push(geometry);

        geometry = geometry.clone();

        applyVertexColors(geometry, color.setHex(i));

        this.geometriesPicking.push(geometry);

        this.pickingData[i] = {
          position: position,
          rotation: rotation,
          scale: scale,
        };
      }
      const objects = new THREE.Mesh(
        BufferGeometryUtils.mergeBufferGeometries(this.geometriesDrawn),
        this.defaultMaterial
      );
      this.scene.add(objects);

      this.pickingScene.add(
        new THREE.Mesh(
          BufferGeometryUtils.mergeBufferGeometries(this.geometriesPicking),
          this.pickingMaterial
        )
      );

      this.highlightBox = new THREE.Mesh(
        new THREE.BoxGeometry(),
        new THREE.MeshLambertMaterial({ color: 0xffff00 })
      );
      this.scene.add(this.highlightBox);
      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      container.appendChild(this.renderer.domElement);
      this.controls = new TrackballControls(
        this.camera,
        this.renderer.domElement
      );
      this.controls.rotateSpeed = 1.0;
      this.controls.zoomSpeed = 1.2;
      this.controls.panSpeed = 0.8;
      this.controls.noZoom = false;
      this.controls.noPan = false;
      this.controls.staticMoving = true;
      this.controls.dynamicDampingFactor = 0.3;

      this.stats = new Stats();
      container.appendChild(this.stats.dom);
      this.pointer = new THREE.Vector2();
      this.offset = new THREE.Vector3(10, 10, 10);
      this.renderer.domElement.addEventListener(
        "pointermove",
        this.onPointerMove
      );
    },
    onPointerMove(e) {
      this.pointer.x = e.clientX;
      this.pointer.y = e.clientY;
    },
    animate() {
      requestAnimationFrame(this.animate);

      this.render();
      this.stats.update();
    },
    pick() {
      this.camera.setViewOffset(
        this.renderer.domElement.width,
        this.renderer.domElement.height,
        (this.pointer.x * window.devicePixelRatio) | 0,
        (this.pointer.y * window.devicePixelRatio) | 0,
        1,
        1
      );

      this.renderer.setRenderTarget(this.pickingTexture);
      this.renderer.render(this.pickingScene, this.camera);

      this.camera.clearViewOffset();

      const pixelBuffer = new Uint8Array(4);

      this.renderer.readRenderTargetPixels(
        this.pickingTexture,
        0,
        0,
        1,
        1,
        pixelBuffer
      );

      const id =
        (pixelBuffer[0] << 16) | (pixelBuffer[1] << 8) | pixelBuffer[2];
      const data = this.pickingData[id];

      if (data) {
        if (data.position && data.rotation && data.scale) {
          this.highlightBox.position.copy(data.position);
          this.highlightBox.rotation.copy(data.rotation);
          this.highlightBox.scale.copy(data.scale).add(offset);
          this.highlightBox.visible = true;
        }
      } else {
        this.highlightBox.visible = false;
      }
    },
    render() {
      this.controls.update();

      this.pick();

      this.renderer.setRenderTarget(null);
      this.renderer.render(scene, camera);
    },
  },
  mounted() {
    this.init();
  },
};
</script>
<style scoped>
#container {
  height: 100vh;
}
</style>
