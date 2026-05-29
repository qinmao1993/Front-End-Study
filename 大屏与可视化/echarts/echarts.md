# ECharts v5+
## 基础概念
* 实例 instance
   ```js
    const instance = echarts.init(el)
   ```
   + 实例的常用方法和属性
      - setOption() 设置图表实例的配置项以及数据,ECharts 会合并新的参数和数据，然后刷新图表
      - getWidth()/getHeight() 获取宽高
      - resize() 改变图表尺寸，在容器大小发生改变时需要手动调用。
      - dispose() 销毁实例释放资源，避免内存泄漏。
* 系列 series
  - 一组数值以及他们映射成的图，可以理解为是专门绘制“图”的组件
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
   // 用 option 描述 `数据`、`数据如何映射成图形`、`交互行为` 等
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

## 事件
> 在 ECharts 中事件分为两种类型
* 用户鼠标操作点击，或者 hover 图表的图形时触发的事件
  - 支持常规的鼠标事件类型，包括 'click'、 'dblclick'、 'mousedown'、 'mousemove'、 'mouseup'、 'mouseover'、 'mouseout'、 'globalout'、 'contextmenu' 事件
  - chart.on(eventName, query, handler) 使用 query 只对指定的组件的图形元素的触发回调：
  ```js
    chart.on('click', 'series', function() {});
    chart.on('click', 'series.line', function() {});
    chart.on('click', 'dataZoom', function() {});
    chart.on('click', 'xAxis.category', function() {});
  ```
* 使用可以交互的组件后触发的行为事件，如在切换图例开关时触发的 'legendselectchanged' 事件
* 代码触发 ECharts 中组件的行为
  - 通过调用 myChart.dispatchAction({ type: '' }) 触发图表行为，统一管理了所有动作，也可以方便地根据需要去记录用户的行为路径。
* 监听“空白处”的事件
  + zrender 事件和 echarts 事件区别？
    > echarts 事件是在 zrender 事件的基础上实现的
    - zrender事件 当鼠标在任何地方都会被触发
    - 当鼠标在图形元素上时才能被触发
  ```js
    myChart.getZr().on('click', function(event) {
        // 该监听器正在监听一个`zrender 事件`。
        // 没有 target 意味着鼠标/指针不在任何一个图形元素上，它是从“空白处”触发的。
        if (!event.target) {
            // 点击在了空白处，做些什么。
        }

        // 解决 myChart事件触发式图形元素上过小不好选中的问题
        const chartInstence = chart1Instance.value.getEchartInstance()
        const pointInPixel = [event.offsetX, event.offsetY]
        const pointInGrid = chartInstence.convertFromPixel({ xAxisIndex: 0, yAxisIndex: 0 }, pointInPixel)
        let yValueIndex = pointInGrid[1]
        // 计算点击的具体元素的索引
        const maxYIndex = 3
        const minYIndex = 0
        if (yValueIndex <= minYIndex) yValueIndex = minYIndex
        if (yValueIndex > maxYIndex) yValueIndex = maxYIndex
        // 关联业务数据
        const yValueName = citys[yValueIndex]
    });

    myChart.on('click', function(event) {
        // 该监听器正在监听一个`echarts 事件`。
    });
  ```