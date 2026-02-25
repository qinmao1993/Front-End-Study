# turf.js
是一个用于地理空间分析强大 js 库，专为处理 GeoJSON 数据设计。它提供超过 200 种模块化函数，适用于浏览器和 Node.js 环境，以下是常用的方法

## 官网
[官网](turfjs.org）

## 测量
  - 距离计算：turf.distance()：计算两点间大圆距离（考虑地球曲率），支持公里/英里等单位
  - 面积计算：turf.area()：精确计算多边形/多面区域面积（平方米/平方英尺等）
  - 长度计算：turf.length()：测量线状要素（LineString）的路径长度
  - 中点/中心点：turf.midpoint()（两点中点）、turf.centerOfMass()（质心）、turf.centroid()（几何中心）

## 空间关系
  - 点与多边形关系：turf.booleanPointInPolygon()：判断点是否在多边形内（支持复杂边界）
  - 几何体相交检测：turf.intersect()（求交集）、turf.booleanOverlap()（检查重叠）
  - 邻近分析：turf.nearestPoint()：在点集中查找距离目标点最近的点
  - 包含关系：turf.booleanContains()：检查几何体A是否完全包含B。

## 几何变换
  - 缓冲区生成 turf.buffer()：为点/线/面生成指定距离的缓冲区
  - 凸包计算 turf.convex()：生成点集的最小凸多边形
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
