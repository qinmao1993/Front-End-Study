# ECharts 实践
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
   // 常见的组件
   // 用 option 描述 `数据`、`数据如何映射成图形`、`交互行为` 等。
   const option = {
      // option 每个属性是一类组件。
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
* 响应容器大小的变化:通过监听页面的 resize 事件 改变图表的大小
  ```js
   // 注意节流的处理
   var myChart = echarts.init(document.getElementById('main'));
   window.addEventListener('resize', function() {
      myChart.resize();
   });
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
* 高亮的样式：emphasis

## 数据集
* 数据设置在 数据集（dataset） 中，会有这些好处：
  - 能够贴近数据可视化常见思维方式：（I）提供数据，（II）指定数据到视觉的映射，从而形成图表。
  - 数据和其他配置可以被分离开来。数据常变，其他配置常不变。分开易于分别管理。
  - 数据可以被多个系列或者组件复用，对于大数据量的场景，不必为每个系列创建一份数据。
  - 支持更多的数据的常用格式，例如二维数组、对象数组等，一定程度上避免使用者为了数据格式而进行转换。
