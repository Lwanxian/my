<template>
  <div>
    <div ref="container"></div>
  </div>
</template>
<script>
import * as THREE from "three/build/three.module";
import Stats from "three/examples/jsm/libs/stats.module";
// 电影摄像机
import { CinematicCamera } from "three/examples/jsm/cameras/CinematicCamera";
import { GUI } from "three/examples/jsm/libs/dat.gui.module";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default {
  data() {
    return {
      camera: null,
      scene: null,
      light: null,
      geometry: null,
      material: null,
      renderer: null,
      raycaster: null,
      mouse: null,
      stats: null,
      effectController: null,
      gui: null,
      INTERSECTED: null,
      theta: 0,
      radius: 100,
      controls: null,
    };
  },
  methods: {
    init: function () {
      // 相机
      this.camera = new CinematicCamera(
        60,
        window.innerWidth / window.innerHeight,
        1,
        10000
      );
      this.camera.setLens(5);
      this.camera.position.set(2, 1, 500);
      // 场景
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0xf0f0f0);
      // 环境光
      this.scene.add(new THREE.AmbientLight(0xffffff, 0.3));
      // 光源
      this.light = new THREE.DirectionalLight(0xffccff, 0.35);
      this.light.position.set(1, 1, 1).normalize();
      this.scene.add(this.light);
      // 几何体创建
      this.geometry = new THREE.BoxGeometry(20, 20, 20);
      // 材质对象
      this.material = new THREE.MeshLambertMaterial({
        color: Math.random() * 0xffffff,
      });
      // 循环渲染多个随机颜色几何体
      for (let i = 0; i < 1500; i++) {
        const object = new THREE.Mesh(this.geometry, this.material);
        object.position.x = Math.random() * 800 - 400;
        object.position.y = Math.random() * 800 - 400;
        object.position.z = Math.random() * 800 - 400;
        this.scene.add(object);
      }
      this.raycaster = new THREE.Raycaster();
      this.mouse = new THREE.Vector2();

      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.$refs.container.appendChild(this.renderer.domElement);
      this.stats = new Stats();
      this.$refs.container.appendChild(this.stats.dom);
      // 设置鼠标事件监听
      document.addEventListener("mousemove", this.onDocumentMouseMove);

      window.addEventListener("resize", this.onWindowResize);
      this.effectController = {
        focalLength: 15,
        fstop: 2.8,
        showFocus: false,
        focalDepth: 3,
      };
      this.gui = new GUI();
      this.gui
        .add(this.effectController, "focalLength", 1, 135, 0.01)
        .onChange(this.matChanger);
      this.gui
        .add(this.effectController, "fstop", 1.8, 22, 0.01)
        .onChange(this.matChanger);
      this.gui
        .add(this.effectController, "focalDepth", 0.1, 100, 0.001)
        .onChange(this.matChanger);
      this.gui
        .add(this.effectController, "showFocus", true)
        .onChange(this.matChanger);
    },
    matChanger: function () {
      for (const e in this.effectController) {
        if (e in this.camera.postprocessing.bokeh_uniforms) {
          this.camera.postprocessing.bokeh_uniforms[
            e
          ].value = this.effectController[e];
        }
      }

      this.camera.postprocessing.bokeh_uniforms[
        "znear"
      ].value = this.camera.near;
      this.camera.postprocessing.bokeh_uniforms["zfar"].value = this.camera.far;
      this.camera.setLens(
        this.effectController.focalLength,
        this.camera.frameHeight,
        this.effectController.fstop,
        this.camera.coc
      );
      this.effectController[
        "focalDepth"
      ] = this.camera.postprocessing.bokeh_uniforms["focalDepth"].value;
    },
    onWindowResize: function () {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(window.innerWidth, window.innerHeight);
    },
    onDocumentMouseMove: function (event) {
      event.preventDefault();
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    },
    animate() {
      requestAnimationFrame(this.animate, this.renderer.domElement);

      this.render();
      this.stats.update();
    },
    render() {
      this.theta += 0.1;

      this.camera.position.x =
        this.radius * Math.sin(THREE.MathUtils.degToRad(this.theta));
      this.camera.position.y =
        this.radius * Math.sin(THREE.MathUtils.degToRad(this.theta));
      this.camera.position.z =
        this.radius * Math.cos(THREE.MathUtils.degToRad(this.theta));
      this.camera.lookAt(this.scene.position);
      // 更新矩阵
      this.camera.updateMatrixWorld();

      this.raycaster.setFromCamera(this.mouse, this.camera);

      const intersects = this.raycaster.intersectObjects(this.scene.children);

      if (intersects.length > 0) {
        const targetDistance = intersects[0].distance;

        this.camera.focusAt(targetDistance);

        if (this.INTERSECTED != intersects[0].object) {
          if (this.INTERSECTED)
            this.INTERSECTED.material.emissive.setHex(
              this.INTERSECTED.currentHex
            );

          this.INTERSECTED = intersects[0].object;
          this.INTERSECTED.currentHex = this.INTERSECTED.material.emissive.getHex();
          this.INTERSECTED.material.emissive.setHex(0xff0000);
        }
      } else {
        if (this.INTERSECTED)
          this.INTERSECTED.material.emissive.setHex(
            this.INTERSECTED.currentHex
          );

        this.INTERSECTED = null;
      }
      if (this.camera.postprocessing.enabled) {
        this.camera.renderCinematic(this.scene, this.renderer);
      } else {
        this.scene.overrideMaterial = null;

        this.renderer.clear();
        this.renderer.render(this.scene, this.camera);
      }
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    },
  },
  mounted() {
    this.init();
    this.matChanger();
    this.render();
  },
};
</script>
<style scoped>
#cont {
  height: 100vh;
}
</style>
