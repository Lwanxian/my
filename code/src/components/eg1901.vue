<template>
  <div>
    <div></div>
  </div>
</template>

<script>
import "../../../three.js-r57/build/three";
import * as THREE from "three/build/three.module";


export default {
  data() {
    return {
      secne: null,
      geometry: null,
      material: null,
      camera: null,
      mesh: null,
      point: null,
      width: null,
      height: null,
      renderer: null,
      axisHelper: null,
      controls: null,
    };
  },
  methods: {
    init: function () {
      this.scene = new THREE.Scene();
      this.geometry = new THREE.SphereGeometry(10, 20, 32);
      this.material = new THREE.MeshLambertMaterial({
        color: 0x00ff00,
      });
      this.mesh = new THREE.Mesh(this.geometry, this.material);

      this.point = new THREE.PointLight(0xfffccc);
      this.point.position.set(400, 200, 300);

      this.width = window.innerWidth;
      this.height = window.innerHeight;
      var k = this.width / this.height;
      var s = 100;
      this.camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000);
      this.camera.position.set(100, 200, 300);
      this.camera.lookAt(scene.position);

      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setSize(this.width, this.height);
      this.renderer.setClearColor(0xb9d3ff, 0);
      document.body.appendChild(this.renderer.domElement);

      // 辅助坐标系
      this.axisHelper = new THREE.AxisHelper(250);
      this.scene.add(this.mesh, this.point, this.axisHelper);
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement); //创建控件对象（鼠标控制）
    },
    randomizeMatrix(matrix, randomSize, distance) {
      let position = new THREE.Vector3();
      let rotation = new THREE.Euler();
      let quaternion = new THREE.Quaternion();
      let scale = new THREE.Vector3();
      position.x =
        Math.floor(Math.random() * randomSize - randomSize / 2) * distance;
      position.y =
        Math.floor(Math.random() * randomSize - randomSize / 2) * distance;
      position.z =
        Math.floor(Math.random() * randomSize - randomSize / 2) * distance;

      rotation.x = 0;
      rotation.y = 0;
      rotation.z = 0;
      quaternion.setFromEuler(rotation);
      scale.x = scale.y = scale.z = 1;
      // matrix.compose(position, quaternion, scale);
    },
    aa() {
      console.log(THREE.Scene);
    },
    re() {
      let T0 = new Date(); //上次时间
      let T1 = new Date(); //本次时间
      let t = T1 - T0; //时间差
      T0 = T1; //把本次时间赋值给上次时间
      this.renderer.render(this.scene, this.camera); //执行渲染操作
      requestAnimationFrame(this.re);
    },
  },
  mounted() {
    this.aa();
    this.randomizeMatrix();
    this.re();
  },
};
</script>

<style lang="scss" scoped>
div {
  color: violet;
}
</style>