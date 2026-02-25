# mac 系统
## 快捷键
* 打开finder:command+space
* 打开截屏:command+shift+4
* 录屏：command+shift+5
* 4指上划打开多屏幕
* 开启分屏：将当前应用最大化，4指上划，拖入另一个程序进入当前应用的缩略图

## 终端设置
  - vim ~/.vimrc  输入下列参数，保存即可，默认C语言代码可以按control+p补全关键字
  - syntax on	" 自动语法高亮
  - set number " 显示行号
  - set cindent
  - set smartindent " 开启新行时使用智能自动缩进
  - set showmatch " 插入括号时，短暂地跳转到匹配的对应括号
  - set ruler " 打开状态栏标尺
  - :set mouse=a "在vim所有模式下开鼠标，复制文档就可以不包含行号了
  
## 优化电脑cpu
* 关闭文件索引
 ```bash
    # 关闭
    sudo mdutil -a -i off 
    # 打开
    sudo mdutil -a -i on
  ```
