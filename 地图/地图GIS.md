# 地图GIS
>当我们试图在页面上加载地图时，我们通常不是从 0 开始的，而是会选择一款地图引擎。它们在展示地图时，有两个核心概念，分别是投影方式和坐标系
## 投影方式
  - 目前 web Gis 最常用的投影方式是墨卡托投影，常规的地图厂商和地图引擎，都默认使用的这类投影方式。
  - 墨卡托投影的核心思路是，先把球形地图展开成柱状图，然后平铺成平面。

## 地图引擎
[地图引擎](./地图引擎.md)

## 坐标系
* WGS84
  - 国际标准（gps）有多个版本，如 WGS 84 (G1154)，精度在不断提高
* CGCS2000
  - 2000国家大地坐标系,中国法定的国家大地坐标系,于2008年7月1日起正式在全国使用
  - 取代了之前的参心坐标系（北京54、西安80）。
  - 特点：与WGS84非常接近，在厘米级精度内可以认为是一致的。
* GCJ-02
  - 它是一个基于WGS84/CGCS2000的加密偏移结果。国测局标注（国标）戏称为火星坐标系
* BD-09: 百度地图（在 GCJ-02 基础上再⼀次加密的 BD-09 坐标系）
* 坐标系转换
  - 社区中较认可的的
  - [coordtransform](https://github.com/wandergis/coordtransform) 

## 数据源
> 地图上要展现出丰富的信息，显示街道、显示桥梁、显示房屋、显示湖泊……要支持缩小、支持放大，就必须有一个信息载体，数据源有哪些？
* 矢量瓦片数据源（Vector Tile）
  - 描述：用点、线、面（多边形）等几何图形来表示地理要素，并包含属性信息（如名称、类型、高度等）。数据量小，适合进行空间分析。
  - 常见格式：Shapefile (.shp)、GeoJSON (.geojson)、KML/KMZ (.kml/.kmz)、File Geodatabase (.gdb)、PostGIS（数据库格式）。
  - 所有引用矢量数据源的图层必须指定 source-layer 属性
  + 典型图层：
    - 点图层： 兴趣点（POI）、车站、学校
    - 线图层： 道路、河流、行政边界、管线
    - 面图层： 行政区划、湖泊、建筑物轮廓、土地利用类型

* 栅格瓦片数据源（Raster Tile）
  - 描述：由像素（像元）矩阵构成，每个像素代表一个区域并有一个值。数据量大，能表现连续变化的现象
  - 常见格式： GeoTIFF (.tiff)、JPEG2000 (.jp2)、IMG (.img)、NetCDF（常用于科学数据）
  + 典型图层
    - 影像图层： 卫星影像（如Landsat, Sentinel-2）、航空摄影、无人机正射影像
    - 专题栅格： 数字高程模型（DEM）、坡度坡向图、温度分布图、人口密度图

* GeoJSON 数据源
  - 什么是 GeoJSON：是一种常用数据格式，它被用来描述地理数据。
  - 格式
    ```json
        {
            "type": "Feature", // 类别，支持的值只有： Feature 和 FeatureCollection
            "geometry": {      // 几何信息。用来表示图形信息，是点还是线还是多边形，它们的经纬度是多少
                "type": "Point",
                "coordinates": [125.6, 10.1]
            },
            "properties": { // 属性，用来记录业务属性，如 id，name 等。
                "name": "Dinagat Islands" 
            }
        }
    ```
  + 区域GeoJSON数据
    + 获取方式一
      - 访问此链接：https://geo.datav.aliyun.com/areas_v3/bound/100000.json 你能看到由 aliyun dataV 团队提供的 中国地理边界 GeoJSON 静态数据(商用数据)。
      - 如：100000 是中国的行政区编码，420000 表示湖北省
      - [行政区编码](https://github.com/modood/Administrative-divisions-of-China)
    + 获取方式二
      - [echarts-maps](https://github.com/echarts-maps)

## 地图瓦片
* 离线瓦片图资源
  - [百度](http://www.wmksj.com/map.html) 
* 在线瓦片服务
  - 通过 "天地图" 获取在线瓦片服务,"天地图" 是由 "国家基础地理信息中心" 提供的一个地理信息服务平台。
  - [天地图](www.tianditu.gov.cn)  注册后，访问控制台(console.tianditu.gov.cn/api/key)，申请 称为个人开发者，然后注册一个应用,获取秘钥，这个秘钥是获取瓦片的凭证
   
## 图层管理
> 在前端地图应用中，对多个地理信息图层进行组织、控制、渲染和交互的一系列技术和方法。它涉及图层的添加、删除、排序、显隐控制、样式调整、交互处理等。
* 图层的核心属性
  ```json
    {
    "layers": [
        {
            "id": "water",  // id 必选图层唯一标识
            "source": "epgis-streets", // 图层的数据源名称。除了background图层，其它图层都必须设置此属性
            "source-layer": "water", // 矢量切片数据源的图层。当数据源支持多个图层时，此属性是必需的。其它数据源（包括GeoJSON数据源）的该属性是禁用的
            "type": "fill", 
            "minzoom":10, // 图层进行解析并显示的最小缩放级别,如 zoom 小于10不显示
            "maxzoom":18, // 图层进行解析并显示的最大缩放级别,如 zoom 大于18不显示
            "layout":[],  // 图层的布局属性
            "paint": {    // 图层的默认绘制属性
                "fill-color": "#00ffff"
            },
            "filter":[] 
        }
    ]
    }
  ```
  + type
    > 必选 enum。可选的值有 fill，line，symbol，circle，heatmap，fill-extrusion，raster，hillshade，background，sky。
    - fill: 可填充的多边形，可带描边
    - line: 绘制线
    - symbol: 图标或者文本标注
    - circle: 可填充的圆
    - heatmap: 热力图
    - fill-extrusion: 凸出（3D）多边形
    - raster: 栅格地图，例如卫星影像图
    - background 地图的背景色或者填充图案
    - sky: 一个始终渲染在所有其他图层下方的球形穹顶，环绕在地图周围
  + layout/paint
    > 图层有两个子属性用来确定图层中的数据如何被渲染：layout和paint属性。
    - layout 应用于渲染过程的早期阶段，定义了图层的数据如何传输到 GPU。其他图层可通过 'ref'属性来共享此图层的 layout 属性
    - paint 应用于渲染过程的后期阶段。一个共享其他图层layout属性的图层可以设置不同的 paint 属性
  + filter
    > 指明数据源上要素的过滤条件的表达式。只有符合过滤条件的要素才被显示，常用的表达式如下
    - ["==", key, value] 等于: feature[key] = value
    - ["has", key] feature[key] 存在
    - ["in", key, v0, ..., vn] 包含feature[key] ∈ {v0, ..., vn}
* 添加、删除、数据更新
  - [layer.js](./layer.js)

## turf.js
> 是一个用于地理空间分析强大 js 库，专为处理 GeoJSON 数据设计。它提供超过 200 种模块化函数，适用于浏览器和 Node.js 环境，以下是常用的方法
[turf.js](./turfjs.md)
