<template>
  <div ref="container"></div>
</template>

<script>
import * as THREE from "three/build/three.module";
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
      mesh: null,
      axisHelper:null,
      controls:null

    };
  },
  methods: {
    init: function () {
        let container = document.getElementById("container")
      var m = new THREE.Matrix4();
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0xf0f0f0);
      // 相机
      this.camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        1,
        100
      );
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
      let count = 50;
      this.mesh = new THREE.InstancedMesh(this.geometry, this.material, count);
      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setSize(this.width, this.height);
      this.renderer.setClearColor(0xb9d3ff, 0);
     
            // 辅助坐标系
      this.axisHelper = new THREE.AxisHelper(250);
      this.scene.add(this.mesh, this.axisHelper);
      this.controls = new OrbitControls(this.camera, this.renderer.domElement); //创建控件对象（鼠标控制）

    },
    render(){
         this.renderer.render(this.scene, this.camera); //执行渲染操作
         requestAnimationFrame(this.render);
    }
    // // 产生一个分布均匀的矩阵
    // randomizeMatrix(matrix, randomSize, distance) {
    //   let position = new THREE.Vector3();
    //   let rotation = new THREE.Euler();
    //   let quaternion = new THREE.Quaternion();
    //   let scale = new THREE.Vector3();
    //   position.x =
    //     Math.floor(Math.random() * randomSize - randomSize / 2) * distance;
    //   position.y =
    //     Math.floor(Math.random() * randomSize - randomSize / 2) * distance;
    //   position.z =
    //     Math.floor(Math.random() * randomSize - randomSize / 2) * distance;

    //   rotation.x = 0;
    //   rotation.y = 0;
    //   rotation.z = 0;
    //   quaternion.setFromEuler(rotation);
    //   scale.x = scale.y = scale.z = 1;
    //   matrix.compose(position, quaternion, scale);
    // },
  },
  mounted() {
    this.init();
    this.render()
  },
};
</script>

<style>
#container {
  height: 100vh;
  background-color: rgb(27, 27, 27);
}
</style>