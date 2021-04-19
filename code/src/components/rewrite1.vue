<template>
  <div>
    <div id="cont" ref="container"></div>
  </div>
</template>

<script>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";


export default {
  data() {
    return {
      camera: null,
      scene: null,
      material: null,
      mesh: null,
      renderer: null,
      geometry: null,
      vertices: null,
      attribue: null,
      colors: null,
      points: null,
      line: null,
      point: null,
      point2: null,
      ambient: null,
      width: null,
      height: null,
      axisHelper: null,
      controls: null,
    };
  },
  methods: {
    init: function () {
      //获取元素节点
      let cont= document.getElementById("cont");
      //设置场景
      this.scene = new THREE.Scene();
      //建模
      this.geometry = new THREE.BufferGeometry();
      //类型数组创建顶点数据
      this.vertices = new Float32Array([
        0,0,0, //顶点1坐标
        50,0,0, //顶点2坐标
        0,100,0, //顶点3坐标
        0,0,10, //顶点4坐标
        0,0,100, //顶点5坐标
        50,0,10, //顶点6坐标
      ]);
      //类型数组创建顶点颜色color数据
      this.colors = new Float32Array([
        1,0,0, //顶点1颜色
        0,1,0, //顶点2颜色
        0,0,1, //顶点3颜色
        1,1,0, //顶点4颜色
        0,1,1, //顶点5颜色
        1,0,1, //顶点6颜色
      ]);
      // 设置几何体attributes属性的颜色color属性
      this.geometry.attributes.color = new THREE.BufferAttribute(this.colors,3); //3个为一组,表示一个顶点的颜色数据RGB
      // 线条渲染模式
      this.material = new THREE.LineBasicMaterial({ color: 0xff0000 }); // /线条颜色/材质对象
      this.line = new THREE.Line(this.geometry, this.material); //线条模型对象
      //材质对象
      this.material = new THREE.MeshBasicMaterial({
        // 以顶点颜色为准
        vertexColors: THREE.VertexColors,
        // 两面可见
        side: THREE.DoubleSide,
      });
      //创建网格模型
      this.mesh = new THREE.Mesh(this.geometry, this.material);
      //点光源
      this.point = new THREE.PointLight(0xfffccc);
      this.point.position.set(400, 200, 300); //点光源位置
      // 点光源2  位置和point关于原点对称
      this.point2 = new THREE.PointLight(0xffffff);
      this.point2.position.set(-400, -200, -300); //点光源位置
      //环境光
      this.ambient = new THREE.AmbientLight(0x444444);
      //将模型、线条、灯光添加至场景
      this.scene.add(
        this.mesh,
        this.line,
        this.point,
        this.point2,
        this.ambient
      );
      // 创建属性缓冲区对象
      this.attribue = new THREE.BufferAttribute(this.vertices, 3); //3个为一组，表示一个顶点的xyz坐标
      // 设置几何体attributes属性的位置属性
      this.geometry.attributes.position = this.attribue;
      // 相机设置
      this.width = window.innerWidth; //窗口宽度
      this.height = window.innerHeight; //窗口高度
      var k = this.width / this.height; //窗口宽高比
      var s = 100; //三维场景显示范围控制系数，系数越大，显示的范围越大
      //创建相机对象
      this.camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000);
      this.camera.position.set(100, 200, 300); //设置相机位置
      this.camera.lookAt(this.scene.position); //设置相机方向(指向的场景对象)
      // 辅助坐标系  参数250表示坐标系大小，可以根据场景大小去设置
      this.axisHelper = new THREE.AxisHelper(250);
     this.scene.add(this.axisHelper);
      // 创建渲染器对象
      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setSize(this.width, this.height); //设置渲染区域尺寸
      this.renderer.setClearColor(0xb9d3ff, 0); //设置背景颜色
      this.$refs.container.appendChild(this.renderer.domElement); //container元素中插入canvas对象
    },
    render() {
      requestAnimationFrame(this.render);
      this.renderer.render(this.scene, this.camera); //执行渲染操作
       this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    },
  },
  mounted() {
    this.init();
    this.render();
  },
};
</script>

<style>
</style>