<template>
  <div>
    <div></div>
  </div>
</template>

<script>
import "../../../three.js-r57/build/three";
var scene = new THREE.Scene();
var geometry = new THREE.SphereGeometry(10, 20, 32);
var material = new THREE.MeshLambertMaterial({
  color: 0x00ff00,
});
var mesh = new THREE.Mesh(geometry, material);

var point = new THREE.PointLight(0xfffccc);
point.position.set(400, 200, 300);

var width = window.innerWidth;
var height = window.innerHeight;
var k = width / height;
var s = 100;
var camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000);
camera.position.set(100, 200, 300);
camera.lookAt(scene.position);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
renderer.setClearColor(0xb9d3ff, 0);
document.body.appendChild(renderer.domElement);

// 辅助坐标系
var axisHelper = new THREE.AxisHelper(250);
scene.add(mesh, point, axisHelper);
var controls = new THREE.OrbitControls(camera, renderer.domElement); //创建控件对象（鼠标控制）
let T0 = new Date(); //上次时间
export default {
  data() {
    return {
     secne:null,
     geometry:null,
     material:null,
     mesh:null,
     point:null,
     
    };
  },

  created() {
    this.aa();
    this.randomizeMatrix();
    this.re();
  },
  methods: {
 
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
      renderer.render(scene, camera); //执行渲染操作
      mesh.rotateY(0.001 * t); //旋转角速度0.001弧度每毫秒
      requestAnimationFrame(this.re);
    },
  },

  watch: {},
};
</script>

<style lang="scss" scoped>
div {
  color: violet;
}
</style>