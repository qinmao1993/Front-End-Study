# 搭建npm私有仓库
离线环境下安装发布包的方案

## 应用场景
* 发布私有包，不被团队外部的人使用
* 通过 proxy 下载私有仓库没有的包
* 缓存私有仓库没有的包，方便下次安装更快

## npm私服仓库解决方案
* Verdaccio（https://verdaccio.org）
  - 简介：轻量级、开源的 npm 私有仓库工具，基于 Node.js 开发，支持插件扩展。
  + 特点：
    - 零配置快速启动，适合小型团队或个人使用。
    - 支持代理公共 npm 仓库（缓存公共包）。
    - 支持用户权限管理（基于 htpasswd 或插件扩展）。
    - 支持 Docker 部署。

* Nexus Repository OSS/Pro（https://www.sonatype.com/products/nexus-repository）
  - 简介：Sonatype 公司推出的仓库管理工具（Nexus Repository Manager），支持多种包格式（npm、Maven、Docker 等）。
  + 特点：
    - 支持 npm 私有仓库、代理仓库和分组仓库（Group Repository）。
    - 提供企业级权限管理、审计、高可用性支持。
  - 适用场景：中大型企业、需要统一管理多语言依赖的场景。

* JFrog Artifactory（https://jfrog.com/artifactory/）
  - 简介：功能强大的通用仓库管理工具，支持 npm、Docker、Python 等 25+ 包格式。
  + 特点：
    - 提供企业级安全控制（RBAC、漏洞扫描）。
    - 支持高可用部署、异地复制、CI/CD 集成。
    - 提供 SaaS 版本（Artifactory Cloud）和本地部署。
    - 商业付费工具，功能全面。
  - 适用场景：大型企业、需要多语言依赖管理和 DevOps 集成。
  
* 云原生的方案
  - GitHub Packages
  - GitLab Package Registry
  - AWS CodeArtifact
  - Azure Artifacts

## GitLab Package Registry
### 环境准备
* 私有内网环境：确保 GitLab 实例版本为 11.8 或更高，自带包管理
* 确保已安装 Node.js（自带 npm）
### GitLab 包管理机制
* GitLab 的 NPM Registry 默认以项目为中心，所有包必须归属于某个具体项目。
* 发布到全局 Registry（仅限GitLab企业版）
* 如果必须实现类似 "全局包" 的效果，可通过以下方式模拟
  - 创建一个专门用于存放公共包的 GitLab 项目（如 shared-packages）。所有团队通过此项目的 Registry 发布/安装共享包：
    ```ini
        # .npmrc
        @shared:registry=http://gitlab.example.com/api/v4/projects/789/packages/npm/
    ```

## 包发布前身份验证
 > 不管发布包到什么包环境，都要身份访问令牌来验证身份
* 公有环境（npm官方仓库）：
   - 注册 npm 账号并登录，自动生成令牌
    ```bash
      # 第一次发布包
      npm adduser  # 按提示输入用户名、密码、邮箱,成功的时候默认你已经登陆了

      # 非第一次发布包，然后输入你创建的账号和密码和邮箱
      npm login
      npm token list  # 查看令牌
    ```
* 私有环境（GitLab Package Registry）
  > 注意：如果是内部项目，您必须是 GitLab 实例的注册用户。 匿名用户无法从内部项目中提取包
  + 个人访问令牌
    - 用于个人账号的认证，允许访问 GitLab API 或私有仓库（如 NPM Registry）
    - 生成步骤：
      1. 点击头像，选择 “Settings”, 选择 Access Tokens，创建新令牌并保存：如 GITLAB_NPM_TOKEN
      2. 权限：最少勾选 api 和read_registry、write_registry， 过期时间：按需设置（建议长期项目选择无过期）
    - 适用场景：本地开发环境手动发布包，需要跨项目访问时的个人授权
  + 项目部署令牌
    - 允许访问项目中的所有包。适用于向多个项目授予和撤销访问权限 用户
    - 生成步骤：
      1. 进入项目 → Settings → Repository → Deply tokens。创建新令牌并保存：如 GITLAB_NPM_TOKEN
      2. 权限：勾选 read_package_registry/write_package_registry的选项
  + 群组部署令牌
    - 允许访问组及其子组中的所有包
  + CI 作业令牌
    - GitLab CI/CD 作业运行时自动生成的临时令牌，用于访问当前项目资源。
    - 生成方式：无需手动创建，在 CI/CD 作业中通过 CI_JOB_TOKEN 环境变量自动注入。
    - 仅限当前项目和作业关联的权限（通常为 read_package 和 write_package）。
    - 适用场景：在 .gitlab-ci.yml 中自动发布包：
      ```yaml
        script:
            - echo "//gitlab.com/api/v4/projects/${CI_PROJECT_ID}/packages/npm/:_authToken=${CI_JOB_TOKEN}" > .npmrc
            - npm publish
      ```
* 私有环境（Verdaccio）

## 包项目创建与发布
* 创建项目并初始化
  ```bash
    mkdir my-package && cd my-package
    npm init  # 按提示填写字段（name, version, description, entry point 等）生成 package.json 文件
    # 注意：私密的内容不想发布到 npm 上？将它写入.gitignore 或.npmignore中，上传就会被忽略
  ```
  ```json
    {
        "name": "@<GROUP_OR_USERNAME>/<PACKAGE_NAME>", 
        "version": "1.0.0",
        "description": "My private npm package",
        "main": "index.js"
    }
  ```
  + 关键字段：
    - name: 包名（全平台唯一，若被占用需改名）
    - version: 遵循语义化版本规则（SemVer，如 1.0.0）
    - main: 包的入口文件（如 index.js）
  + 创建一个 index.js 文件，项目安装时导出模块供使用。
    ```js
      // 示例： index.js
      exports.printMsg = function() {
        console.log("This is a message from the demo package");
      }
    ```
* 发布包配置
  - 推荐在.npmrc 配置文件中设置
  ```ini
    # .npmrc
    # npm 仓库配置：下载、发布用

    # 官方 npm 仓库：发布到 npm 仓库要修改成 npm 官方的地址
    registry=https://registry.npmmirror.com

    # GitLab npm 仓库:
    # 格式：
    # @your-scope 包的作用域：可以是用户名、群组、项目名等，表示以 @your-scope 开头的包，下载发布时使用其指定的url
    # <GITLAB_DOMAIN>：你的 GitLab 域名（如 gitlab.com 或私有部署地址）
    # projectId 在 GitLab上的具体的项目中获取到
    # <GITLAB_NPM_TOKEN>：上文身份验证保存的令牌
    # 如果使用私有证书，添加 strict-ssl=false

    #  @your-scope:registry=http://<GITLAB_DOMAIN>/api/v4/projects/<projectId>/packages/npm/
    # //<GITLAB_DOMAIN/api/v4/projects/<project-id>/packages/npm/:_authToken=${GITLAB_NPM_TOKEN}
    # 示例
    @dlxx:registry=http://localhost:8090/api/v4/projects/1/packages/npm/
    # 发布到 gitLab 包仓库认证用： NPM_TOKEN 就是
    //localhost:8090/api/v4/projects/1/packages/npm/:_authToken=${NPM_TOKEN}

    # TODO  Verdaccio

  ```
* 手动发布和更新
  ```bash
    npm publish  # 发布包
    # 如果未在.env中配置环境变量，可直接在命令行注入
    # git bash
    NPM_TOKEN=git-xxx npm publish
    # powershell
    $env:NPM_TOKEN=your_token npm publish
    
    npm view packageName  # 查看是否发布成功
    # 若包名为作用域包（如 @username/package-name），需添加 --access public
    npm publish   --access public

    # 更新包
    # 手动修改 package.json 中的 version

    # 撤销发布的包
    npm  unpublish 你的包名  # 72 小时内可撤销（慎用）
    # npm unpublish 的推荐替代命令 并不会在社区里撤销你已有的包，但会在任何人尝试安装这个包的时候得到警告
    npm deprecate <pkg>[@<version>] <message> 
    npm deprecate penghuwanapp '这个包我已经不再维护了哟～'
  ```
* CI/CD 自动发布
  - 参见[CICD](/解决方案/gitlab工具链/CICD.md)

## 安装私有包
* 公有包：直接安装：npm install 包名
* 私有包: npm install @your-scope/your-package
  ```ini
    # 项目中 .npmrc 配置
    @your-scope:registry=https://<GITLAB_DOMAIN>/api/v4/packages/npm/
    # 若 设置允许下载包，就不用这个
    //gitlab.com/api/v4/packages/npm/:_authToken=${GITLAB_NPM_TOKEN}
   
  ```

## 遇到的问题
* npm ERR! you do not have permission to publish "your module name". Are you logged in as the correct user?
  - 提示没有权限，其实就是你的 module 名在 npm 上已经被占用啦，
  - 去 npm 搜索你的模块名称，搜不到，就能用，并且把 package.json 里的 name 修改过来，重新发布