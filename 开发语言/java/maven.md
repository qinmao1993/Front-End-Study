# maven
java 包管理工具，又是编译构建工具

## 特性
* 中心化,约定优于配置,所有项目共享
* 依赖配置文件：pom.xml 类似 package.json
* 依赖存储位置：通常是 ~/.m2/repository
* 依赖格式:.jar 文件 (编译后的字节码)

## 安装
* 检测是否安装？
  ```bash
    # 检测 Maven 是否安装
    mvn -v
  ```
* 几种安装方式
 - 方式一：下载 ide 会自带
 - 方式二：手动安装
   ```bash
    # macOS 使用 Homebrew
    brew install maven

    # 或者使用 SDKMAN（推荐）
    sdk install maven

    # linux
    # Ubuntu/Debian
    sudo apt update
    sudo apt install maven

    # CentOS/RHEL
    sudo yum install maven

   ```

## pom.xml 文件
* 见[pom.xml](./pom.xml)

## 配置仓库国内加速
* 全局和项目级配置，推荐项目级配置
* 配置项目级仓库镜像加速(pom.xml)
  ```xml
        <project>
            <repositories>
                <repository>
                    <id>aliyun</id>
                    <name>Aliyun Maven Repository</name>
                    <url>https://maven.aliyun.com/repository/public</url>
                    <releases>
                        <enabled>true</enabled>
                    </releases>
                    <snapshots>
                        <enabled>false</enabled>
                    </snapshots>
                </repository>
            </repositories>
            
            <pluginRepositories>
                <pluginRepository>
                    <id>aliyun</id>
                    <name>Aliyun Plugin Repository</name>
                    <url>https://maven.aliyun.com/repository/public</url>
                    <releases>
                        <enabled>true</enabled>
                    </releases>
                    <snapshots>
                        <enabled>false</enabled>
                    </snapshots>
                </pluginRepository>
            </pluginRepositories>
        </project>
  ```
* 验证配置是否生效
  ```bash
    # 查看有效配置
    mvn help:effective-settings

    # 下载依赖时显示详细信息
    mvn -X dependency:resolve
  ```
* 清理和重建缓存
  ```bash
    # 删除整个本地仓库（彻底）
    rm -rf ~/.m2/repository

    # 或者只删除有问题的依赖
    rm -rf ~/.m2/repository/groupId/artifactId
  ```

## 仓库
> 类似npm 也分为中央仓库和私有仓库
* 远程仓库
  - 中央仓库： Maven 社区提供的默认公共仓库，包含了绝大多数流行的开源库。无需特殊配置即可使用。
  - 私服： 架设在局域网内的私有仓库服务器（如 Nexus, Artifactory）。它作为中央仓库的代理和缓存，同时用于部署公司内部的私有构件。
* 本地仓库： 
  - 在你个人电脑上的一个目录（默认是 用户主目录/.m2/repository）。一旦从远程仓库下载过某个依赖，它就会被缓存到本地仓库，后续构建无需再次下载。

## 依赖声明与作用域（<scope>）
* compile：默认。对编译、测试、运行都有效。
* provided：表示JDK或容器在运行时已提供（如Servlet API）。
* runtime：仅在运行时需要，编译时不需要（如JDBC驱动）。
* test：仅用于测试编译和运行阶段（如JUnit）。
* system：与 provided 类似，但需要显式指定本地系统路径。

## 依赖管理
* 步骤 1：解析依赖
  - 读取 POM： Maven 首先读取项目的 pom.xml 文件，识别所有在 <dependencies> 中声明的直接依赖。
  - 处理传递性依赖： 假设你的项目依赖了 A库，而 A库 本身又依赖了 B库 和 C库。Maven 会自动将 B库 和 C库 也引入到你的项目中，它们被称为传递性依赖。
  - 构建依赖树： Maven 会递归地解析所有直接依赖和传递性依赖，最终构建出一棵完整的项目依赖树。
* 步骤 2：处理依赖冲突（依赖调解）
  + 由于传递性依赖，同一个依赖的不同版本可能会被引入（例如，A → B → D@1.0 和 C → D@2.0）。Maven 通过以下规则来解决冲突：
    - 最近定义优先： 在依赖树中，路径最近的版本获胜。在上面的例子中，D@2.0 的路径深度为 2（项目 → C → D@2.0），而 D@1.0 的路径深度为 3（项目 → A → B → D@1.0），所以 D@2.0 会被采用。
    - 第一声明优先：如果两个相同依赖的版本在依赖树中的深度相同，那么在 pom.xml 中先被声明的那个依赖，其传递路径上的版本会被优先选择。
  + 排除特定的传递性依赖
    - 当某个传递性依赖版本不对、有冲突或者不需要时，如 排除 spring-core 传递来的 commons-logging
    ```xml
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-core</artifactId>
            <version>5.3.0</version>
            <exclusions>
                <exclusion>
                    <groupId>commons-logging</groupId>
                    <artifactId>commons-logging</artifactId>
                </exclusion>
            </exclusions>
        </dependency>
    ```
* 步骤 3：下载依赖
  - 本地查找：Maven 会优先在本地仓库中查找依赖。它会根据坐标（groupId/artifactId/version）生成对应的本地路径去寻找文件。
  - 远程下载：如果在本地仓库找不到，Maven 会按照配置的顺序（通常是先私服，后中央仓库）去远程仓库查找并下载。下载的构件（如 JAR 文件）和对应的 POM 文件（用于解析传递性依赖）都会被存储到本地仓库中
* 步骤 4：将依赖纳入类路径
  - 根据在 <dependency> 中声明的 <scope>（作用域），Maven 会在不同的构建阶段将依赖加入到 classpath 中。
* 常用命令
  ```bash
    # 1. 编辑 pom.xml 依赖

    # 2. 依赖安装
    mvn compile      # 编译时自动下载缺失依赖
    mvn test         # 测试时自动下载缺失依赖  
    mvn install      # 安装时自动下载缺失依赖
    mvn dependency:resolve  # 显式解析依赖（较少使用）

    # 3. 查看依赖树
    mvn dependency:tree
  ```

## 编译构建
* 构建生命周期
  ```bash
    # 清理阶段
    mvn clean                  # 删除 target 目录

    # 默认生命周期（主要阶段)
    mvn validate               # 验证项目正确性
    mvn compile                # 编译主代码
    mvn test-compile           # 编译测试代码
    mvn test                   # 运行单元测试
    mvn package                # 打包 (JAR/WAR)
    mvn verify                 # 集成测试验证
    mvn install                # 安装到本地仓库
    mvn deploy                 # 部署到远程仓库

    # 站点生命周期
    mvn site                   # 生成项目文档站点
  ```
* 构建产物类型
  ```java
    // JAR 文件 - 普通 Java 库或应用
    // 包含: 编译后的类文件 + 资源文件

    // WAR 文件 - Web 应用
    // 包含: JAR 内容 + WEB-INF/web.xml + JSP/HTML 等

    // EAR 文件 - 企业级应用
    // 包含: 多个 WAR/EJB JAR + 应用配置

    // Spring Boot Fat JAR
    // 包含: 应用代码 + 所有依赖 + 内嵌 Web 服务器
  ```

## java 包的开发
TODO
