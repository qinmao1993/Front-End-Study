# CICD

## 基本概念
* CI（持续集成，Continuous Integration）
  - 开发人员频繁将代码变更合并到主分支（如每天多次），每次提交后自动触发构建和测试流程，确保代码质量并快速发现集成错误。
* CD（持续交付/持续部署，Continuous Delivery/Deployment）
  - 持续交付：通过自动化流程将代码变更交付到预发布或生产环境，需手动批准才能部署。
  - 持续部署：在持续交付的基础上，自动部署到生产环境，无需人工干预。

## CI/CD 流程
1. 代码提交：开发人员推送代码到版本控制系统（如Git）。
2. 自动化构建：触发CI工具（如Jenkins）编译代码、打包应用。
3. 自动化测试：运行单元测试、集成测试、代码质量扫描等。
4. 环境部署：将构建产物部署到测试/预发布环境进行验收。
5. 交付/部署：
  - 持续交付：手动确认后发布到生产环境。
  - 持续部署：自动发布到生产环境。
6. 监控与反馈：通过日志和监控工具（如Prometheus）追踪应用状态，发现问题后反馈至开发团队。

## 核心工具
* CI工具：Jenkins、GitLab CI、CircleCI、Travis CI、GitHub Actions
* 构建工具：Maven（Java）、Gradle、npm（JavaScript）
* 测试工具：JUnit（单元测试）、Selenium（UI测试）、SonarQube（代码质量）
* 部署工具：Ansible、Terraform、Kubernetes（容器编排）、Docker（容器化）
* 监控工具：Prometheus、Grafana、ELK Stack（日志分析）

## gitlab上的CI/CD实践
* Pipeline(流水线):
  - 定义：一次完整的 CI/CD 执行过程，包含多个阶段（Stages）和任务（Jobs）
  - 触发方式：代码推送、API 调用、定时任务等
  - 状态：成功（passed）、失败（failed）、阻塞（blocked）。
* 流水线配置的关键字
  + stages(阶段):
    - 定义：流水线中的逻辑分组（如构建、测试、发布）
    - 特点
      1. 同一阶段的任务并行执行
      2. 前一阶段全部成功后，才会进入下一阶段
  + Job（任务）
    - 定义：阶段中的具体操作单元（如运行测试、编译代码）
    + 配置项
      - script 执行的 Shell 命令
      - artifacts：保存构建产物（如 dist/ 目录）
      - rules：控制任务触发条件（如仅打 Tag 时运行）。
  + variables（变量）
    - 定义：用于传递环境参数（如令牌、API 地址）。
    - 类型：
      1. 预定义变量：如 CI_PROJECT_ID（项目ID）、CI_JOB_TOKEN（临时令牌）。
      2. 自定义变量：在项目设置 → CI/CD → Variables 中手动添加（如 NPM_TOKEN）。
  + cache
    - 作用：加速重复任务（如缓存 node_modules 避免重复安装）
  + artifacts（产物）
    - 作用：将任务生成的文件传递给后续阶段（如构建后的 dist/ 目录）。
  + rules（规则）
    - 作用：精细控制任务触发条件。
    ```yaml
        rules:
            - if: $CI_COMMIT_TAG             # 打 Tag 时触发
            - if: $CI_COMMIT_BRANCH == "dev" # dev 分支触发
            - when: manual                   # 手动触发
    ```
  + retry
    - job 重试次数，默认为0，最大重试次数为2,其中 when 可设置在特定失败原因的情况下执行
  + only & except
    - 流水线任务执行时机,only 来定义 job 何时运行，使用 except 定义 job 不运行的时间

### GitLab Runner 
* 是什么
  - 用于在指定环境中 执行 CI/CD 流水线中定义的任务（Jobs）
  - GitLab 本身不内置 GitLab Runner，需要用户自行安装和配置
* 安装运行自建 runner
   - 已集成到[docker-compose](../docker-compose.yml)  
  ```bash
    # 查看 GitLab Runner 服务状态
    # 默认未注册会显示： gitlab-runner: exit status 1
    docker compose exec gitlab-runner gitlab-runner status

    # 服务未启动，启动所有服务
    docker-compose up -d

    # 有网环境预加载镜像
    docker pull gitlab/gitlab-runner:v17.11.1
    docker pull node:22.15.0-slim

    # 导出镜像文件
    docker save -o gitlab-runner.tar gitlab/gitlab-runner:v17.11.0 
    docker save -o node.tar node:22.15.0-slim

    # 内网加载
    docker load -i gitlab-runner.tar
    docker load -i node.tar
  ```
* runner 工作流程
  1. runner必须首先在 GitLab 中注册， 它在 runner 和 GitLab 之间建立持久连接
  2. 当触发流水线时 GitLab 将 job 被放置在队列中,等待匹配 runner
  3. 检查可用的 runner 通过标签匹配 job，每个 runner 一个作业，然后执行它们
  4. 结果实时报告回 GitLab
* 新建实例runner
  + 实例runner类型： 项目（Project）、群组（Group）、全局（以全局为例）
  - 注意：在 16.0+，要注册 runner，使用 runner 身份验证令牌, Runner 注册令牌已弃用。
  - 访问 gitlab 实例的url 地址
    - 获取全局 runner 身份令牌： 用管理员账号登录 → 进入 “设置 → CI/CD → Runner” → 点击 “新建 Runner” → 复制 “身份验证令牌”
    - 获取项目级 runner 身份令牌：项目→ 进入 “设置 → CI/CD → Runner” → 点击 “新建 Runner” → 复制 “身份验证令牌”
  ```bash
    # 注册运行程序后，配置将保存到 .config.toml
    # RUNNER_TOKEN 就是上面获取到的 “身份验证令牌”
    export RUNNER_TOKEN=glrt-dDoxCnU6MXFLHwnGJ_T-9kXi8ImP30oQ.0w0pzm0qy

    # 注册方式一：以交互的形式执行注册
    docker compose exec gitlab-runner gitlab-runner register

    # 注册方式二：以非交互的形式执行注册 --non-interactive
    docker compose exec gitlab-runner gitlab-runner register \
    --non-interactive \
    --url "http://172.20.10.2:8090" \
    --name "fe-deploy" \
    --token $RUNNER_TOKEN \
    --executor "docker" \
    --docker-image node:22.15.0-slim

    docker compose exec gitlab-runner gitlab-runner status # 查看服务状态

    # 手动验证 runner 是否可以选中作业，执行后可以看到能接收到 job,和执行结果
    docker compose exec gitlab-runner gitlab-runner run

    # 进入 gitlab 的容器中
    docker  exec  -it gitlab-runner /bin/bash

    # gitlab-runnenr 常用命令
    gitlab-runner unregister --all-runners
    gitlab-runner restart
    gitlab-runner --version
    gitlab-runner status
    gitlab-runner verify      # 正常：输出 Verifying runner... is valid。

    # 测试网络连通性，确保 Runner 可以访问 GitLab 的 API 端点：
    # 正常响应：返回 200 OK 或 401 Unauthorized（无需登录，只要网络可达）。
    curl -I http://gitlab:8090/api/v4/version  

  ```
  - 验证 Runner 状态:回到 GitLab 界面 → Settings → CI/CD → Runners，确认 Runner 显示为 Online

### cicd 自动发布 npm 包
> 通过 GitLab Package Registry 可以将 GitLab 作为私有 npm 仓库
* 以实现一个 npm 包自动发布为例
  - gitlab 会检测项目根目录里的 .github-ci.yml文件，根据该文件流水线自动构建
  - 见配置文件[gitlabCI](./npm/.gitlab-ci.yml)，main 分支推送代码就会触发流水线，runner 开始执行流水线中的 job

### cicd 自动部署前端项目
TODO

### cicd 自动部署后端项目
TODO

## GitHub 上的 CI/CD 实践
  - TODO
* 如何为 GitHub 上托管的开源项目用 Travis CI 进行持续集成?
    1. Travis CI是什么东东？
    Travis CI是在线托管的CI服务，用Travis来进行持续集成，不需要自己搭服务器，在网页上点几下就好，用起来更方便。最重要的是，它对开源项目是免费的。

    首先，直接用你的GitHub账号登录 Travis CI 的网站：https://travis-ci.org/
    第一次登录时，授权给Travis访问你的GitHub代码库，然后，把需要CI的代码库选上：

    参考:https://www.liaoxuefeng.com/article/0014631488240837e3633d3d180476cb684ba7c10fda6f6000

    ```js
    // 1. 最简单的例子是让travis在node.js的0.6.x，0.6.1，0.5.11三个版本下对项目进行测试
    language: node_js
    node_js:
    - "6"
    - "6.1"
    - "5.11"
    // 2. Travis 构建过程主要分为两步：
    // install：安装依赖，在 node 环境下，默认运行 npm install
    // stript：运行构建命令，在 node 环境下，默认运行 npm test
        language: node_js
        node_js:
        - "6"
        install: npm install
        script: npm test
       成功之后会在Travis官网上出现build 成功失败的图标，可以把copy在readme.md 文件中
    ```