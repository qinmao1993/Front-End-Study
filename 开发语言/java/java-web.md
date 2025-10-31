# java-web 

## 主流 web 框架
* Spring MVC
  - 经典的MVC框架，灵活可控，类似于 nodejs 中的 Express.js / Koa
  - 核心是处理 HTTP 请求（路由、中间件、控制器）、数据绑定和视图渲染。它很强大，但需要手动配置很多组件。
* Jakarta EE (原Java EE)
  - 官方标准，容器管理
  - 传统企业应用，遵循标准规范的项目
* Micronaut
  - 编译时依赖注入，启动快，内存小
  - 云原生，函数计算，Serverless
* Quarkus
  - 面向GraalVM，超快启动	
  - Kubernetes原生，容器化部署

## Spring Boot
* 是什么？
  - 类似于 nestjs-cli、create-react-app 等脚手架工具
  - 基于 Spring MVC框架，内嵌服务器（Tomcat）、依赖管理、自动配置和默认设置，可开箱即用
  - 传统方式需要将应用打包成 WAR 文件，然后部署到外部的 Tomcat 服务器上。
* Spring Boot 版本如何选？
  + 选取意见
    1. java 版本：Spring Boot 3.x 必须 JDK 17+，Spring Boot 2.x 支持 JDK 8/11/17
    2. 长期支持版本：Spring Boot 3.x (当前主要 LTS)
    3. 新项目：无脑选择 Spring Boot 3.x 的最新小版本（如 3.2.x）。
  + 版本差异
    - 3.5.x: Java 17+、Spring Framework 6.x+
    - 4.0.x: Java 17+、推荐Java21 Spring Framework 7.x+
* 项目结构
  ```text
    project/
    ├── src/
    │   └── main/
    │       ├── java/
    │       │   └── com/example/
    │       │       ├── Application.java
    │       │       ├── controller/
    │       │       ├── service/
    │       │       └── repository/
    │       └── resources/
    │           ├── application.properties
    │           └── static/
    ├── pom.xml
    └── .vscode/
  ```

## 常用依赖
* ORM框架
  - Spring Data JPA	基于JPA标准，Repository模式，开发效率极高
  - MyBatis SQL与代码分离，灵活控制SQL
  - MyBatis-Plus MyBatis增强，提供通用Mapper
  - Hibernate 全功能ORM，JPA最流行实现
* 数据库连接与连接池
  ```xml
    <!-- 数据库驱动 -->
    <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
    </dependency>

    <!-- HikariCP连接池 (Spring Boot默认) -->
    <dependency>
        <groupId>com.zaxxer</groupId>
        <artifactId>HikariCP</artifactId>
    </dependency>

    <!-- 数据库迁移工具 -->
    <dependency>
        <groupId>org.flywaydb</groupId>
        <artifactId>flyway-core</artifactId>
    </dependency>
  ```
* 认证与授权
  ```xml
    <!-- Spring Security - 功能全面 -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>

    <!-- Apache Shiro - 轻量简单 -->
    <dependency>
        <groupId>org.apache.shiro</groupId>
        <artifactId>shiro-spring</artifactId>
        <version>1.10.0</version>
    </dependency>

    <!-- JWT令牌 -->
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt</artifactId>
        <version>0.9.1</version>
    </dependency>
  ```
* 通用工具包
  ```xml
    <!-- Apache Commons工具包 -->
    <dependency>
        <groupId>org.apache.commons</groupId>
        <artifactId>commons-lang3</artifactId>
    </dependency>

    <!-- Google Guava工具包 -->
    <dependency>
        <groupId>com.google.guava</groupId>
        <artifactId>guava</artifactId>
        <version>31.1-jre</version>
    </dependency>

    <!-- Hutool - 国产全能工具包 -->
    <dependency>
        <groupId>cn.hutool</groupId>
        <artifactId>hutool-all</artifactId>
        <version>5.8.11</version>
    </dependency>
  ```
* 数据处理
  ```xml
    <!-- JSON处理 -->
    <dependency>
        <groupId>com.fasterxml.jackson.core</groupId>
        <artifactId>jackson-databind</artifactId>
    </dependency>

    <!-- Excel处理 -->
    <dependency>
        <groupId>org.apache.poi</groupId>
        <artifactId>poi</artifactId>
        <version>5.2.3</version>
    </dependency>

    <!-- 文件上传 -->
    <dependency>
        <groupId>commons-fileupload</groupId>
        <artifactId>commons-fileupload</artifactId>
        <version>1.4</version>
    </dependency>
  ```
* 缓存框架
  ```xml
    <!-- Redis客户端 -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-redis</artifactId>
    </dependency>

    <!-- 本地缓存Caffeine -->
    <dependency>
        <groupId>com.github.ben-manes.caffeine</groupId>
        <artifactId>caffeine</artifactId>
    </dependency>

    <!-- Spring缓存抽象 -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-cache</artifactId>
    </dependency>
  ```
* 消息中间件
  ```xml
    <!-- RabbitMQ -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-amqp</artifactId>
    </dependency>

    <!-- Apache Kafka -->
    <dependency>
        <groupId>org.springframework.kafka</groupId>
        <artifactId>spring-kafka</artifactId>
    </dependency>

    <!-- RocketMQ -->
    <dependency>
        <groupId>org.apache.rocketmq</groupId>
        <artifactId>rocketmq-spring-boot-starter</artifactId>
        <version>2.2.3</version>
    </dependency>
  ```
* 测试工具栈
  ```xml
    <!-- 单元测试 -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>

    <!-- 集成测试 -->
    <dependency>
        <groupId>io.rest-assured</groupId>
        <artifactId>rest-assured</artifactId>
        <scope>test</scope>
    </dependency>

    <!-- 模拟数据 -->
    <dependency>
        <groupId>com.github.javafaker</groupId>
        <artifactId>javafaker</artifactId>
        <version>1.0.2</version>
        <scope>test</scope>
    </dependency>
  ```
* 应用监控
  ```xml
    <!-- Spring Boot Actuator -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-actuator</artifactId>
    </dependency>

    <!-- 监控指标 -->
    <dependency>
        <groupId>io.micrometer</groupId>
        <artifactId>micrometer-registry-prometheus</artifactId>
    </dependency>

    <!-- 链路追踪 -->
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-sleuth</artifactId>
    </dependency>
  ```
* Spring Cloud 套件
  ```xml
    <!-- 服务注册发现 -->
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
    </dependency>

    <!-- 配置中心 -->
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-config</artifactId>
    </dependency>

    <!-- 网关 -->
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-gateway</artifactId>
    </dependency>

    <!-- 服务调用 -->
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-openfeign</artifactId>
    </dependency>
  ```
* 基础Web开发栈
  - Spring Boot + Spring MVC + Thymeleaf + Spring Data JPA + MySQL + Spring Security
* 前后端分离栈
  - Spring Boot + Spring Web + MyBatis/Plus + MySQL + Redis + Spring Security + JWT
* 微服务栈
  - Spring Boot + Spring Cloud + Spring Cloud Gateway + Nacos + Sentinel + OpenFeign

## 服务部署（Spring Boot 项目）
* 优势
  - 内嵌 Tomcat，无需额外安装 Web 服务器
  - 单个文件部署，简单方便
  - 支持各种环境
* 部署前准备
  - 配置打包插件（通常Spring Boot默认已经配置）
  ```xml
    <!-- pom.xml 配置 -->
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
  ```
  ```bash
    # 打包命令
    mvn clean package -DskipTests

    # 打包结果
    # target/your-app-1.0.0.jar (可执行 JAR)
  ```
* 部署
  ```bash
    # 1. 上传文件到服务器
    scp target/myapp.jar user@server:/opt/app/

    # 2. 创建服务文件
    sudo vim /etc/systemd/system/myapp.service
  ```
  ```ini
    # /etc/systemd/system/myapp.service
    [Unit]
    Description=My Java Application
    After=syslog.target network.target

    [Service]
    Type=simple
    User=appuser
    WorkingDirectory=/opt/app
    ExecStart=/usr/bin/java -jar myapp.jar
    ExecStop=/bin/kill -15 $MAINPID
    Restart=on-failure
    RestartSec=10

    [Install]
    WantedBy=multi-user.target
  ```
  ```bash
    # 3. 启动服务
    sudo systemctl daemon-reload
    sudo systemctl enable myapp
    sudo systemctl start myapp
    sudo systemctl status myapp
  ```