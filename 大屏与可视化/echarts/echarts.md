# ECharts v5.6
## 基础概念
* 实例 instance
   ```js
    const instance = echarts.init(el)
   ```
* 系列 series :一组数值以及他们映射成的图，可以理解为是专门绘制“图”的组件
  ```js
   series:[
      // 饼图
      {
        type: 'pie',
        radius: ['50%', '70%'],
        data: [
           { value: 335, name: '直接访问' },
           { value: 310, name: '邮件营销' },
           { value: 234, name: '联盟广告' }
        ]
      },
      // 柱状图
      {
        type: 'bar',
        data: [5, 20, 36, 10, 10],
      },
      // 折线图 
      {
        type: 'line',
        data: [120, 132, 101, 134, 90, 230, 210]
      }
   ]

  ```
* 组件 component
  ```js
   // 用 option 描述 `数据`、`数据如何映射成图形`、`交互行为` 等。
   const option = {
      legend: {...},   // 图例
      grid: {...},     // 直角坐标系底板
      tooltip: {...},  // 提示框组件
      toolbox: {...},  // 工具栏组件
      dataZoom: {...}, // 数据区缩放组件
      visualMap: {...},// 视觉映射组件
      xAxis: [{...}],  // 直角坐标系 x轴
      yAxis: [{...}],  // 直角坐标系 y轴
      series: [{...}]
   };
  ```

## 图表的容器及大小设置
* 推荐设置有宽高的父容器
* 响应容器大小的变化两种方式
  1. 通过监听页面的 resize 事件
  2. 监听父容器的尺寸变化
  ```js
    // 注意防抖的处理
    const chartEl= document.getElementById('main')
    const instance = echarts.init(chartEl);
    window.addEventListener('resize', function() {
        instance.resize();
    });

    const resizeObserver = new ResizeObserver((entries) => {
        const entry = entries[0]
        if (
          entry.contentRect.width > 0 &&
          entry.contentRect.height > 0 &&
          entry.target.isConnected
        ) {
          instance.resize();
        }
      })
      resizeObserver.observe(chartEl)
  ```
* 容器节点销毁时
  - 应调用 echartsInstance.dispose 以销毁实例释放资源，避免内存泄漏。

## 样式
* 颜色主题 Theme: echarts.init(el,'dark') 可在官网中自定义主题
* 调色盘:给定了一组颜色，图形、系列会自动从其中选择颜色
  ```js
   option = {
      // 全局调色盘。
      color: ['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae'],
      series: [{
        type: 'bar',
         // 此系列自己的调色盘。
        color: ['#dd6b66','#759aa0','#e69d87','#8dc1a9','#ea7e53'],
      }]
   }
  ```
* textStyle 全局的字体样式
* 直接的样式设置 itemStyle, lineStyle, areaStyle, label, ...
* 高亮的样式：
  ```js
    emphasis: {
      itemStyle: {
        // 高亮时点的颜色。
        color: 'blue'
      },
      label: {
        show: true,
        // 高亮时标签的文字。
        formatter: 'This is a emphasis label.'
      }
    }
  ```