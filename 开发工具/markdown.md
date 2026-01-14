# Markdown用法

## 标题
```markdown
# 一级标题
## 二级标题
### 三级标题
#### 四级标题
##### 五级标题
###### 六级标题
```

## 文字样式
```markdown
粗体：**粗体** 或 __粗体__

斜体：*斜体* 或 _斜体_

粗斜体：***粗斜体***

~~删除线~~：~~删除线~~

高亮：==高亮==（部分编辑器支持）
```

## 列表
```markdown
无序列表
- 项目一
- 项目二
  - 子项目（缩进2空格）

有序列表
1. 第一项
2. 第二项
   1. 子项（缩进3空格）
```

## 链接与图片
```markdown
  链接：[显示文本](链接地址 "可选标题")
  [百度](https://www.baidu.com "搜索工具")

  图片：![替代文本](图片链接 "可选标题")
  ![Logo](https://example.com/logo.png "网站Logo")

```

## 代码
* 用三个反引号 ``` 或缩进4空格
    ```python
    def hello():
        print("Hello World")
    ```
* diff
  ```diff
    const unique = (arr)=>{
    -  return Array.from(new Set(arr))
    +  return [...new Set(arr)]
    }
  ```
* 折叠
```md
   <details>
      <summary>展开查看规范</summary>
      这是展开后的内容
   </details>
```

## 任务列表
```markdown
- [ ] 未完成任务
- [x] 已完成任务
```
