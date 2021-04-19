<template>
  <div>
    <div id="container"></div>
  </div>
</template>
<script>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GUI } from "three/examples/jsm/libs/dat.gui.module";
export default {
  data() {
    return {
      camera: null,
      scene: null,
      renderer: null,
      mesh: null,
      controls: null,
      geometry: null,
      material: null,
      total: 10000,
    };
  },
  methods: {
    init: function () {
      let container = document.getElementById("container");
      // 场景
      this.scene = new THREE.Scene();
      // 球体
      this.geometry = new THREE.SphereGeometry(30, 30, 30);
      // 一种非光泽表面的材质，没有镜面高光
      this.material = new THREE.MeshLambertMaterial({
        color: 0xffffff,
      });
      // 实例化网格，渲染大量具有相同几何体与材质、但具有不同世界变换的物体
      this.mesh = new THREE.InstancedMesh(
        this.geometry,
        this.material,
        this.total
      );
      // 修改位置
      let transform = new THREE.Object3D();
      for (let index = 0; index < this.total; index++) {
        // 随机位置
        transform.position.set(
          Math.random() * 2000,
          Math.random() * 2000,
          Math.random() * 2000
        );
        // 随机大小
        transform.scale.set(   
          Math.random() * 50 + 50,
          Math.random() * 50 + 50,
          Math.random() * 50 + 50
        );
        transform.updateMatrix();

        //修改实例化几何体中的单个实例的矩阵以改变大小、方向、位置等
        this.mesh.setMatrixAt(index, transform.matrix);
      }
      this.scene.add(this.mesh);
      // 透视相机（摄像机视锥体垂直视野角度，摄像机视锥体长宽比，摄像机视锥体近端面，摄像机视锥体远端面）
      this.camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        1,
        10000
      );
      // 设置相机在z轴的位置
      this.camera.position.z = 20;
      // 平行光（颜色，光照强度）
      const light = new THREE.DirectionalLight(0xffccff, 1);
      // 设置灯光照射位置
      light.position.set(0, 1, 0);
      // 将灯光添加至场景
      this.scene.add(light);
      // 用webgl渲染场景  antialias是否执行抗锯齿。默认为false.
      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      // 将输出canvas的大小调整为(container.clientWidth, container.clientHeight)并考虑设备像素比，且将视口从(0,0)开始调整到适合大小
      this.renderer.setSize(container.clientWidth, container.clientHeight);
      // domElement-生成一个canvas，渲染器在其上绘制输出。渲染器的构造函数会自动创建(如果没有传入canvas参数)
      container.appendChild(this.renderer.domElement);

      // 生成辅助坐标系  参数250表示坐标系大小，可以根据场景大小去设置
      var axisHelper = new THREE.AxisHelper(250);
      this.scene.add(axisHelper);
      //创建控件对象
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    },
    // 生成一个随机均匀矩阵
    randomizeMatrix(matrix, randomSize, distance) {
      var matrix = new THREE.Matrix4();
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
      matrix.compose(position, quaternion, scale);
      console.log(matrix);
    },
  },
  mounted() {
    this.init();
    this.randomizeMatrix(this.matrix, 2, 30);
  },
};
</script>
<style scoped>
#container {
  height: 100vh;
}
</style>
