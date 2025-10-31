# gradle
Gradle 逐渐成为新项目的首选，特别是在 Android 和大型项目中，Groovy/Kotlin DSL，灵活强大，性能好.继承 Maven 的仓库生态

## 安装
* 检测是否安装？
  ```bash
    # 检测 Gradle 是否安装
    gradle -v
  ```
* 几种安装方式
 - 方式一：下载 ide 会自带
 - 方式二：手动安装
   ```bash
    # macOS 使用 Homebrew
    brew install gradle

    # 或者使用 SDKMAN
    sdk install gradle

    # linux
    # Ubuntu/Debian
    sudo apt update
    sudo apt install gradle

    # CentOS/RHEL
    sudo yum install gradle

   ```

## 依赖配置文件
  - 基于 Groovy 或 Kotlin DSL的 build.gradle 或 build.gradle.kts 文件
  ```xml
   // Gradle - build.gradle 示例
    plugins {
        id 'java'
    }

    group = 'com.example'
    version = '1.0.0'
  ```
  
## 配置仓库国内加速
  - 修改项目 build.gradle
  ```gradle
        repositories {
            maven { 
                url 'https://maven.aliyun.com/repository/public/' 
            }
            maven {
                url 'https://maven.aliyun.com/repository/spring/'
            }
            mavenLocal()
            mavenCentral()
        }
        // 对于 buildscript 依赖（如插件）
        buildscript {
            repositories {
                maven { 
                    url 'https://maven.aliyun.com/repository/public/' 
                }
                maven { 
                    url 'https://maven.aliyun.com/repository/gradle-plugin/' 
                }
            }
        }
  ```