# java-web 

## Java SE
这是Java的标准版，是所有Java应用的基础

## 主流 web 框架
* Spring Boot
  - 不是新的框架，而是Spring的“脚手架”。它解决了Spring项目配置繁琐、部署复杂的问题
  - 企业级应用首选，微服务，REST API
* Spring MVC
  - 经典的MVC框架，灵活可控
  - 传统Web应用，需要精细控制的项目
* Jakarta EE (原Java EE)
  - 官方标准，容器管理
  - 传统企业应用，遵循标准规范的项目
* Micronaut
  - 编译时依赖注入，启动快，内存小
  - 云原生，函数计算，Serverless
* Quarkus
  - 面向GraalVM，超快启动	
  - Kubernetes原生，容器化部署

## 数据持久层
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
  
## 技术栈组合
* 基础Web开发栈
  - Spring Boot + Spring MVC + Thymeleaf + Spring Data JPA + MySQL + Spring Security
* 前后端分离栈
  - Spring Boot + Spring Web + MyBatis/Plus + MySQL + Redis + Spring Security + JWT
* 微服务栈
  - Spring Boot + Spring Cloud + Spring Cloud Gateway + Nacos + Sentinel + OpenFeign