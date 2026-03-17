// 圆
map.addLayer({
    id: "demo",
    type: "circle",
    source: {
        type: "geojson",
        data: {
            type: "FeatureCollection",
            features: [
                {
                    type: "Feature",
                    geometry: {
                        type: "Point",
                        coordinates: [115, 34],
                    },
                    properties: {
                        name: "测试点",
                    },
                },
            ],
        },
    },
    paint: {
        // 圆半径
        "circle-radius": 8,
        // 圆颜色
        "circle-color": "#fff",
        // 圆环颜色
        "circle-stroke-color": "#4aabf7",
        // 圆环宽度
        "circle-stroke-width": 3,
    },
});

// 自定义标记
// 画图片点，需要先加载图片 图片路径在页面部署在服务上时可以用相对路径
map.loadImage("图片地址", function (error, image) {
    // 添加图片到map，第一个参数为图片设置id
    map.addImage("poi", image);
    map.addLayer({
        id: "choicePoi",
        type: "symbol",
        source: {
            type: "geojson",
            data: {
                type: "FeatureCollection",
                features: [],
            },
        },
        layout: {
            // 为图层设置引用的图片ID
            "icon-image": "poi",
            "icon-size": 1,
            "icon-ignore-placement": true,
            "text-ignore-placement": false,
            // 自定义图标下显示的文字
            "text-field": "{name}",
            "text-size": 12,
            "text-anchor": "top",
            "text-allow-overlap": false,
            "icon-anchor": "bottom",
            "text-offset": [0, 0],
            "text-max-width": 8,
            "text-font": ["Microsoft YaHei Regular"],
        },
        paint: {
            "text-color": "#555252",
            "text-halo-color": "#FFFFFF",
            "text-halo-width": 1.33333,
        },
    });
    map.getSource("choicePoi").setData({
        type: "FeatureCollection",
        features: [
            {
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: [117, 39],
                },
                properties: {
                    // 对应上面设置的{name}
                    name: "测试点",
                },
            },
        ],
    });
});

// 移动图层到不同的显示层级
map.move(layerId)


// 将图层从地图移除，如果这个图层不存在，会派发一个错误事件
map.removeLayer(layerId)

map.getLayer(layerId)

map.setFilter('my-layer', ['==', 'name', 'USA']);


// 添加数据源
map.addSource(sourceId,{})