# 地图GIS
前端开发大屏地图必备知识点

## 投影方式和坐标系
  > 当我们试图在页面上加载地图时，我们通常不是从 0 开始的，而是会选择一款地图引擎。它们在展示地图时，有两个核心概念，分别是投影方式和坐标系
* 地图引擎
  - 百度、高德、谷歌 等
  - leaflet、OpenLayers 等
  - mapbox、cesium 等

* 投影方式
  - 目前 web Gis 最常用的 投影方式 是 墨卡托投影，常规的地图厂商和地图引擎，都默认使用的这类投影方式。
  - 墨卡托投影的核心思路是，先把球形地图展开成柱状图，然后平铺成平面。

* 主流的坐标系分为
  - WGS84: 国际标准（gps）
  - GCJ-02: 国测局标注（国标）戏称为火星坐标系
  - BD-09: 百度地图（在 GCJ-02 基础上再⼀次加密的 BD-09 坐标系）
  - 坐标系转换社区中较认可的的[coordtransform](https://github.com/wandergis/coordtransform) 

## 地图瓦片
* 什么叫地图瓦片
  - 地图上要展现出丰富的信息，显示街道、显示桥梁、显示房屋、显示湖泊……要支持缩小、支持放大，就必须有一个信息载体
* 地图瓦片分类
  - 矢量瓦片 （Vector Tile）体积更小、定制化能力更强，是目前主流地图厂商使用的瓦片提供方式
  - 栅格瓦片 （Raster Tile）
* 离线瓦片图资源
  - [百度](http://www.wmksj.com/map.html) 
* 在线瓦片服务
  - 通过 "天地图" 获取在线瓦片服务,"天地图" 是由 "国家基础地理信息中心" 提供的一个地理信息服务平台。
  - [天地图](www.tianditu.gov.cn)  注册后，访问控制台(console.tianditu.gov.cn/api/key)，申请 称为个人开发者，然后注册一个应用,获取秘钥，这个秘钥是获取瓦片的凭证

## GeoJSON
* 什么是 GeoJSON 
  - GeoJSON 是一种数据格式。它被用来描述地理数据。
* GeoJSON 格式:目前最新版支持以下类别的地理信息（Feature）描述
    - 点: Point、点组（多个点 MultiPoint）
    - 线: LineString、线组（多条线 MultiLineString）
    - 多边形: Polygon、多边形组（多个多边形 MultiPolygon）
    - 包含一组上述Feature的集合：FeatureCollection
    ```json
        {
            "type": "Feature", // 类别，支持的值只有： Feature 和 FeatureCollection
            "geometry": {      // 几何信息。用来表示图形信息，是点还是线还是多边形，它们的经纬度是多少
                "type": "Point",
                "coordinates": [125.6, 10.1]
            },
            "properties": {
                "name": "Dinagat Islands" // 属性，用来记录业务属性，如 id，name 等。
            }
        }
    ```
* 地理形状的GeoJSON数据
  + 获取方式一：
    - 访问此链接：https://geo.datav.aliyun.com/areas_v3/bound/100000.json 你能看到由 aliyun dataV 团队提供的 中国地理边界 GeoJSON 静态数据(商用数据)。
    - 如：100000 是中国的行政区编码，420000 表示湖北省
    - [行政区编码](https://github.com/modood/Administrative-divisions-of-China)

  + 获取方式二：
    - [echarts-maps](https://github.com/echarts-maps)

## turf.js
> 是一个用于地理空间分析强大 JavaScript 库，专为处理 GeoJSON 数据设计。它提供超过 200 种模块化函数，适用于浏览器和 Node.js 环境，以下是常用的方法
* 测量
  - 距离计算：turf.distance()：计算两点间大圆距离（考虑地球曲率），支持公里/英里等单位
  - 面积计算：turf.area()：精确计算多边形/多面区域面积（平方米/平方英尺等）
  - 长度计算：turf.length()：测量线状要素（LineString）的路径长度
  - 中点/中心点：turf.midpoint()（两点中点）、turf.centerOfMass()（质心）、turf.centroid()（几何中心）
* 空间关系
  - 点与多边形关系：turf.booleanPointInPolygon()：判断点是否在多边形内（支持复杂边界）
  - 几何体相交检测：turf.intersect()（求交集）、turf.booleanOverlap()（检查重叠）
  - 邻近分析：turf.nearestPoint()：在点集中查找距离目标点最近的点
  - 包含关系：turf.booleanContains()：检查几何体A是否完全包含B。
* 几何变换
  - 缓冲区生成 turf.buffer()：为点/线/面生成指定距离的缓冲区
  - 凸包计算 turf.convexHull()：生成点集的最小凸多边形
  - 融合/拆分 turf.dissolve()（按属性融合多边形）、turf.explode()（拆分Multi几何体为单个要素）
  - 简化与平滑 turf.simplify()（减少节点）、turf.bezierSpline()（生成平滑曲线）
  - 几何中心的示例
    ```js
        const polygon = {
            "type": "Feature",
            "properties": {},
            "geometry": {
                "coordinates": [
                [
                    [-81, 41],
                    [-88, 36],
                    [-84, 31],
                    [-80, 33],
                    [-77, 39],
                    [-81, 41]
                ]
                ],
                "type": "Polygon"
            }
        }
        // 计算
        const centroid = turf.centroid(polygon);
    ```
  - 更多场景: 两点之间的直线距离...
* [官网]（turfjs.org）

## 地图引擎
* 加载瓦片风格地图的案例
  - 安装 npm i maplibre-gl
  ```vue
    <template>
        <div ref="mapEl" class="map"></div>
    </template>
    <script setup>
    import mapboxgl from 'maplibre-gl';
    import 'maplibre-gl/dist/maplibre-gl.css';
    import { onMounted, ref } from 'vue'
    const mapEl = ref(null)
    const initOption = {
        style: {
            "version": 8,
            "id": "43f36e14-e3f5-43c1-84c0-50a9c80dc5c7",
            "sources": {
            "tdt-vec": {
                "type": "raster",
                "tiles": [`https://t0.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=${MY_KEY}`],
                "tileSize": 256
            }
            },
            "layers": [{
                "id": "tdt-tiles-layer",
                "type": "raster",
                "source": "tdt-vec",
            }]
        },
        }

      onMounted(() => {
        const map = new mapboxgl.Map({
            container: mapEl.value,
            ...initOption,
        });
      })
    </script>
    <style lang="scss" scoped>
      .map {
        width: 600px;
        height: 300px;
       }
    </style>

  ```

* 加载线框风格的地图的案例
  ```vue
    <template>
    <div ref="mapEl" class="map"></div>
    </template>
    <script setup>
    import { onMounted, ref } from 'vue'
    import maplibregl from 'maplibre-gl'
    import * as turf from '@turf/turf'
    const mapEl = ref(null)
    const initOption = {
    zoom: 5,
    center: [
        113.07569050750635,
        30.841719769976834
    ],
    style: {
        "version": 8,
        "id": "43f36e14-e3f5-43c1-84c0-50a9c80dc5c7",
        "sources": {},
        "light": {
        "anchor": "map",
        "color": "red",
        "intensity": 1
        },
        "layers": [
        ],
        "glyphs": "/fonts/mapbox/{fontstack}/{range}.pbf" // 这行没有啥用，是为了hack字体无法显示的bug
    },
    }

    const fetchGeoJSON = async (areaCode) => {
    const response = await fetch(`https://pic.zhangshichun.top/geojson/merged/${areaCode}.json`, {
        headers: {
        'Content-Type': 'application/json'
        }
    })
    return response.json()
    }
    let map;
    const emptyGeoJSON = { "type": "FeatureCollection", "features": [] }

    const fitBounds = (feature, options = {}) => {
    const bboxResult = turf.bbox(feature);
    const [a, b, c, d] = bboxResult;
    map?.fitBounds(
        [
        [a, b],
        [c, d],
        ],
        options,
    );
    }

    const loadArea = async (code) => {
    const geoJSON = await fetchGeoJSON(code)
    map?.getSource('bound-source').setData(geoJSON)
    fitBounds(geoJSON)
    map?.setFilter('areas-name', ['==', 'parentCode', Number(code)]);
    }

    onMounted(async () => {
    map = new maplibregl.Map({
        container: mapEl.value,
        ...initOption,
    });
    map.on('style.load', async () => {
        map.addSource('bound-source', {
        type: 'geojson',
        data: emptyGeoJSON
        })
        map.addLayer({
        id: 'areas-surface',
        type: 'fill',
        source: 'bound-source',
        layout: {},
        paint: {
            'fill-color': '#0357aa',
            'fill-opacity': 1,
        },
        })
        map.addLayer({
        id: 'areas-surface-hight',
        type: 'fill',
        source: 'bound-source',
        layout: {},
        paint: {
            'fill-color': 'orange',
            'fill-opacity': 1,
        },
        filter: ['==', 'adcode', '']
        })
        map.addLayer({
        id: 'areas-line',
        type: 'line',
        source: 'bound-source',
        paint: {
            'line-color': 'red',
            'line-width': 2
        }
        })
        map.on('click', 'areas-surface', (e) => {
        const feature = e.features?.[0];
        const code = feature?.properties?.adcode;
        loadArea(code)
        })
        map.on('mousemove', 'areas-surface', (e) => {
        const feature = e.features?.[0];
        const code = feature?.properties?.adcode;
        map?.setFilter('areas-surface-hight', ['==', 'adcode', Number(code)]);
        })
        loadArea(420000)
        const areaNames = await fetchGeoJSON('420000-area-names')
        map.addSource('names-source', {
        type: 'geojson',
        data: areaNames
        })
        map.addLayer({
        id: 'areas-name',
        source: 'names-source',
        "type": "symbol",
        "layout": {
            "text-field": '{name}',
            "text-size": 8,
        },
        "paint": {
            "text-color": "black",
            "text-halo-color": "rgba(0, 0, 0, 0)"
        },
        filter: ['==', 'parentCode', 420000]
        })
    })

    })
    </script>
    <style lang="scss" scoped>
    .map {
    width: 600px;
    height: 300px;
    background-color: #fff;
    }
    </style>
  ```