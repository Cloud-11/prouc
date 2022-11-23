# PROUC
一个可视化拖拽搭建项目，使用 Vue3 typescript vite构建
使用编辑器搭建页面和逻辑，保存为json数据。运行时直接引入即可。
项目为简单好懂的代码，主要为初步接触的程序好理解整个框架。
主要为学习使用。
## 项目介绍
目前是整体流程通过，默认组件库未完善(可以自己配置)，事件未完善

prouc 编辑页面
@prouc/core  核心，编辑器和runtime都依赖
@prouc/editor 编辑器
@prouc/runtime 组件运行时
@prouc/ui 默认组件 elementplus组件(未完成)
## 项目上手 | Quick Start

  ```bash
# 克隆项目
# 进入packages/editor目录
cd packages/prouc

# 安装依赖
pnpm install

# 启动 
pnpm run dev

#进入编辑器页面

  ```
# 运行时案例
packages/prouc目录下example/runtime 是实际执行的案例
src下data.json 就是保存编辑器生成的json