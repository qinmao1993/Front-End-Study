# java 基础

## 基础概念
* JVM（Java虚拟机）
  - javac 编译器将 Java 源代码编译成 .class 字节码文件，然后 JVM 来执行它,内比 js 运行在 v8 上
* 包管理(类似npm)
  - [Maven](./maven.md)
  - [Gradle](./gradle.md)
* 编译构建工具
  > 不同于npm 安装构建是独立的功能,java 的依赖安装和编译构建是一体的
  - [Maven](./maven.md)
  - [Gradle](./gradle.md)

## java 编译构建
* 基础编译流程如下
  ```text
    .java 源文件 → javac 编译 → .class 字节码 → JVM 执行
  ```
  ```java
    // 1. 编写源代码 (HelloWorld.java)
    public class HelloWorld {
        public static void main(String[] args) {
            System.out.println("Hello, World!");
        }
    }
  ```
  ```bash
    # 手动编译
    # 2. 使用 javac 编译, 生成 HelloWorld.class (字节码文件)
    javac HelloWorld.java
   
    # 3. 使用 java 命令执行,输出: Hello, World!
    java HelloWorld
  ```
* 构建工具编译
  > 手动编译对于小项目可行，但真实项目需要构建工具来处理
  + 构建工具
    - 依赖管理：自动下载和管理第三方库
    - 多模块构建：处理模块间的依赖关系
    - 资源处理：复制配置文件、静态资源等
    - 测试集成：自动运行单元测试
    - 打包部署：生成可发布的包格式
  + Maven 是如何编译java代码的？
    - 通过 maven-compiler-plugin 来调用 Java 编译器javac

## 开发环境搭建
[开发环境搭建](./开发环境.md)

## 基础语法与数据类型
* 基本数据类型
  ```java
    // 8种基本数据类型
    byte age = 25;           // 8位，-128~127
    short year = 2024;       // 16位
    int score = 95;          // 32位，最常用
    long bigNumber = 1000000000L; // 64位，注意加L

    float price = 19.99f;    // 32位浮点，注意加f
    double salary = 15000.50; // 64位浮点，默认

    char grade = 'A';        // 16位Unicode字符
    boolean isPassed = true; // true或false

    // 实战：类型转换
    int intValue = 100;
    double doubleValue = intValue;        // 自动转换（隐式）
    int backToInt = (int) doubleValue;    // 强制转换（显式）
  ```

* 引用数据类型
  ```java
    // 字符串 - 最常用的引用类型
    String name = "张三";
    String message = "Hello, " + name + "!";
    int length = name.length();

    // 数组
    int[] scores = {85, 92, 78, 96};
    String[] names = new String[5]; // 创建长度为5的数组
  ```

## 流程控制
* 条件语句
  ```java
    // if-else 实战
    public String getGradeLevel(int score) {
        if (score >= 90) {
            return "优秀";
        } else if (score >= 80) {
            return "良好";
        } else if (score >= 60) {
            return "及格";
        } else {
            return "不及格";
        }
    }

    // switch 实战
    public String getWeekDay(int day) {
        return switch (day) {
            case 1 -> "星期一";
            case 2 -> "星期二";
            case 3 -> "星期三";
            case 4 -> "星期四";
            case 5 -> "星期五";
            case 6 -> "星期六";
            case 7 -> "星期日";
            default -> "无效输入";
        };
    }
  ```
* 循环语句
  ```java
    // for循环实战 - 计算阶乘
    public int factorial(int n) {
        int result = 1;
        for (int i = 1; i <= n; i++) {
            result *= i;
        }
        return result;
    }

    // while循环实战 - 猜数字游戏
    public void guessNumber(int target) {
        Scanner scanner = new Scanner(System.in);
        int guess;
        
        do {
            System.out.print("请输入猜测的数字: ");
            guess = scanner.nextInt();
            
            if (guess > target) {
                System.out.println("太大了！");
            } else if (guess < target) {
                System.out.println("太小了！");
            }
        } while (guess != target);
        
        System.out.println("恭喜，猜对了！");
    }

    // 增强for循环 - 遍历集合
    public void printArray(int[] arr) {
        for (int num : arr) {
            System.out.print(num + " ");
        }
        System.out.println();
    }
  ```

## 面向对象
* 类与对象
  ```java
    // 学生类定义
    public class Student {
        // 字段（属性）
        private String name;
        private int age;
        private double score;
        
        // 构造方法
        public Student(String name, int age) {
            this.name = name;
            this.age = age;
            this.score = 0.0;
        }
        
        // 重载构造方法
        public Student(String name, int age, double score) {
            this.name = name;
            this.age = age;
            this.score = score;
        }
        
        // 方法
        public void study(String course) {
            System.out.println(name + "正在学习" + course);
            this.score += 0.5; // 学习增加分数
        }
        
        public boolean isExcellent() {
            return score >= 90;
        }
        
        // Getter和Setter
        public int getAge() { return age; }
        public void setAge(int age) { 
            if (age > 0 && age < 150) {
                this.age = age; 
            }
        }
        
        @Override
        public String toString() {
            return String.format("学生[姓名=%s, 年龄=%d, 分数=%.1f]", name, age, score);
        }
    }

    // 使用示例
    public class SchoolManagement {
        public static void main(String[] args) {
            Student student1 = new Student("李四", 18);
            Student student2 = new Student("王五", 19, 88.5);
            
            student1.study("Java编程");
            student2.study("数据库");
            
            System.out.println(student1);
            System.out.println(student2);
            System.out.println("是否优秀: " + student2.isExcellent());
        }
    }
  ```

## 继承与多态
  ```java
    // 父类 - 人员类
    class Person {
        protected String name;
        protected int age;
        
        public Person(String name, int age) {
            this.name = name;
            this.age = age;
        }
        
        public void introduce() {
            System.out.println("我是" + name + "，今年" + age + "岁");
        }
    }

    // 子类 - 教师类
    class Teacher extends Person {
        private String subject;
        
        public Teacher(String name, int age, String subject) {
            super(name, age); // 调用父类构造方法
            this.subject = subject;
        }
        
        @Override
        public void introduce() {
            System.out.println("我是" + name + "老师，教授" + subject + "课程");
        }
        
        public void teach() {
            System.out.println(name + "老师正在讲授" + subject);
        }
    }

    // 子类 - 学生类
    class CollegeStudent extends Person {
        private String major;
        
        public CollegeStudent(String name, int age, String major) {
            super(name, age);
            this.major = major;
        }
        
        @Override
        public void introduce() {
            System.out.println("我是" + name + "，" + major + "专业的学生");
        }
        
        public void study() {
            System.out.println(name + "正在学习" + major + "专业知识");
        }
    }

    // 多态实战
    public class PolymorphismDemo {
        public static void main(String[] args) {
            // 多态：父类引用指向子类对象
            Person[] people = new Person[3];
            people[0] = new Person("普通人", 30);
            people[1] = new Teacher("张老师", 35, "数学");
            people[2] = new CollegeStudent("学生李", 20, "计算机科学");
            
            // 运行时多态：根据实际对象类型调用相应方法
            for (Person person : people) {
                person.introduce(); // 每个对象调用自己的introduce方法
                
                // 类型检查和转换
                if (person instanceof Teacher) {
                    ((Teacher) person).teach();
                } else if (person instanceof CollegeStudent) {
                    ((CollegeStudent) person).study();
                }
                System.out.println("---");
            }
        }
    }
  ```

## 接口与抽象类
  ```java
    // 接口定义
    interface Payment {
        void pay(double amount);
        boolean refund(String orderId);
        
        // Java 8+ 默认方法
        default void printReceipt() {
            System.out.println("打印收据...");
        }
        
        // 静态方法
        static String getPaymentType() {
            return "电子支付";
        }
    }

    // 抽象类
    abstract class Animal {
        protected String name;
        
        public Animal(String name) {
            this.name = name;
        }
        
        // 抽象方法 - 子类必须实现
        public abstract void makeSound();
        
        // 具体方法
        public void sleep() {
            System.out.println(name + "正在睡觉");
        }
    }

    // 接口实现
    class CreditCardPayment implements Payment {
        @Override
        public void pay(double amount) {
            System.out.println("信用卡支付: ¥" + amount);
        }
        
        @Override
        public boolean refund(String orderId) {
            System.out.println("信用卡退款，订单号: " + orderId);
            return true;
        }
    }

    class AlipayPayment implements Payment {
        @Override
        public void pay(double amount) {
            System.out.println("支付宝支付: ¥" + amount);
        }
        
        @Override
        public boolean refund(String orderId) {
            System.out.println("支付宝退款，订单号: " + orderId);
            return true;
        }
    }

    // 抽象类继承
    class Dog extends Animal {
        public Dog(String name) {
            super(name);
        }
        
        @Override
        public void makeSound() {
            System.out.println(name + "汪汪叫");
        }
    }

    class Cat extends Animal {
        public Cat(String name) {
            super(name);
        }
        
        @Override
        public void makeSound() {
            System.out.println(name + "喵喵叫");
        }
    }

    // 实战使用
    public class InterfaceAbstractDemo {
        public static void main(String[] args) {
            // 接口使用
            Payment payment = new AlipayPayment();
            payment.pay(199.99);
            payment.refund("ORDER123");
            payment.printReceipt();
            
            // 抽象类使用
            Animal dog = new Dog("旺财");
            Animal cat = new Cat("咪咪");
            
            dog.makeSound();
            dog.sleep();
            cat.makeSound();
            cat.sleep();
        }
    }
  ```

## 异常处理
  ```java
    public class ExceptionHandlingDemo {
        
        // 检查性异常 - 必须处理
        public void readFile(String filename) {
            try (BufferedReader reader = new BufferedReader(new FileReader(filename))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    System.out.println(line);
                }
            } catch (FileNotFoundException e) {
                System.err.println("文件未找到: " + e.getMessage());
            } catch (IOException e) {
                System.err.println("读取文件时出错: " + e.getMessage());
            }
        }
        
        // 运行时异常
        public int divide(int a, int b) {
            if (b == 0) {
                throw new IllegalArgumentException("除数不能为零");
            }
            return a / b;
        }
        
        // 自定义异常
        static class InsufficientBalanceException extends Exception {
            public InsufficientBalanceException(String message) {
                super(message);
            }
        }
        
        public void withdraw(double amount) throws InsufficientBalanceException {
            double balance = 1000.0; // 模拟余额
            if (amount > balance) {
                throw new InsufficientBalanceException(
                    "余额不足！当前余额: " + balance + "，提现金额: " + amount);
            }
            System.out.println("成功提现: " + amount);
        }
        
        // 异常处理实战
        public void processTransaction() {
            try {
                withdraw(1500.0);
            } catch (InsufficientBalanceException e) {
                System.err.println("交易失败: " + e.getMessage());
                // 记录日志、发送通知等
            } finally {
                System.out.println("交易处理完成");
            }
        }
        
        public static void main(String[] args) {
            ExceptionHandlingDemo demo = new ExceptionHandlingDemo();
            
            // 处理除零异常
            try {
                int result = demo.divide(10, 0);
                System.out.println("结果: " + result);
            } catch (IllegalArgumentException e) {
                System.err.println("计算错误: " + e.getMessage());
            }
            
            // 处理自定义异常
            demo.processTransaction();
        }
    }
  ```

## 集合框架
  ```java
    public class CollectionFrameworkDemo {
        
        // List使用 - 有序，可重复
        public void listDemo() {
            List<String> list = new ArrayList<>();
            list.add("苹果");
            list.add("香蕉");
            list.add("橙子");
            list.add("苹果"); // 允许重复
            
            System.out.println("List大小: " + list.size());
            System.out.println("第二个元素: " + list.get(1));
            
            // 遍历
            for (String fruit : list) {
                System.out.println(fruit);
            }
            
            // 使用迭代器
            Iterator<String> iterator = list.iterator();
            while (iterator.hasNext()) {
                String fruit = iterator.next();
                if ("香蕉".equals(fruit)) {
                    iterator.remove(); // 安全删除
                }
            }
        }
        
        // Set使用 - 无序，不重复
        public void setDemo() {
            Set<Integer> numberSet = new HashSet<>();
            numberSet.add(1);
            numberSet.add(2);
            numberSet.add(3);
            numberSet.add(1); // 重复元素不会被添加
            
            System.out.println("Set大小: " + numberSet.size());
            System.out.println("是否包含2: " + numberSet.contains(2));
            
            // 遍历Set
            for (Integer num : numberSet) {
                System.out.println(num);
            }
        }
        
        // Map使用 - 键值对
        public void mapDemo() {
            Map<String, Integer> studentScores = new HashMap<>();
            studentScores.put("张三", 85);
            studentScores.put("李四", 92);
            studentScores.put("王五", 78);
            
            // 获取值
            System.out.println("李四的分数: " + studentScores.get("李四"));
            
            // 遍历Map
            for (Map.Entry<String, Integer> entry : studentScores.entrySet()) {
                System.out.println(entry.getKey() + ": " + entry.getValue());
            }
            
            // Java 8+ 的forEach
            studentScores.forEach((name, score) -> 
                System.out.println(name + "的分数是: " + score));
        }
        
        // 集合排序
        public void sortDemo() {
            List<Student> students = new ArrayList<>();
            students.add(new Student("张三", 20, 88.5));
            students.add(new Student("李四", 19, 92.0));
            students.add(new Student("王五", 21, 78.5));
            
            // 按分数降序排序
            students.sort((s1, s2) -> Double.compare(s2.getScore(), s1.getScore()));
            
            // 使用Stream API
            students.stream()
                .filter(s -> s.getScore() >= 80)
                .forEach(System.out::println);
        }
    }
  ```

## 常用工具类
* String 操作
  ```java
    public class StringOperations {
        public static void main(String[] args) {
            String text = " Hello, Java World! ";
            
            // 常用字符串操作
            System.out.println("原始: '" + text + "'");
            System.out.println("去空格: '" + text.trim() + "'");
            System.out.println("转大写: " + text.toUpperCase());
            System.out.println("长度: " + text.length());
            System.out.println("是否包含Java: " + text.contains("Java"));
            System.out.println("替换: " + text.replace("Java", "Python"));
            
            // 字符串分割
            String csv = "苹果,香蕉,橙子,葡萄";
            String[] fruits = csv.split(",");
            System.out.println("分割结果: " + Arrays.toString(fruits));
            
            // StringBuilder - 可变字符串，性能更好
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < 5; i++) {
                sb.append("数字").append(i).append(" ");
            }
            System.out.println("StringBuilder结果: " + sb.toString());
        }
    }
  ```
* 日期时间处理
  ```java
    public class DateTimeDemo {
        public static void main(String[] args) {
            // Java 8+ 日期时间API
            LocalDate today = LocalDate.now();
            LocalTime currentTime = LocalTime.now();
            LocalDateTime currentDateTime = LocalDateTime.now();
            
            System.out.println("今天: " + today);
            System.out.println("当前时间: " + currentTime);
            System.out.println("当前日期时间: " + currentDateTime);
            
            // 日期操作
            LocalDate nextWeek = today.plusWeeks(1);
            LocalDate lastMonth = today.minusMonths(1);
            
            System.out.println("下周: " + nextWeek);
            System.out.println("上个月: " + lastMonth);
            
            // 日期格式化
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            String formatted = currentDateTime.format(formatter);
            System.out.println("格式化后: " + formatted);
            
            // 计算两个日期之间的天数
            LocalDate startDate = LocalDate.of(2024, 1, 1);
            long daysBetween = ChronoUnit.DAYS.between(startDate, today);
            System.out.println("从年初到现在天数: " + daysBetween);
        }
    }
  ```

## 模块的使用


## 实战小项目：简单的银行账户管理系统
  ```java
    import java.util.*;

    // 银行账户类
    class BankAccount {
        private String accountNumber;
        private String accountHolder;
        private double balance;
        private List<String> transactionHistory;
        
        public BankAccount(String accountNumber, String accountHolder, double initialBalance) {
            this.accountNumber = accountNumber;
            this.accountHolder = accountHolder;
            this.balance = initialBalance;
            this.transactionHistory = new ArrayList<>();
            addTransaction("账户开户，初始余额: " + initialBalance);
        }
        
        // 存款
        public void deposit(double amount) {
            if (amount <= 0) {
                throw new IllegalArgumentException("存款金额必须大于0");
            }
            balance += amount;
            addTransaction("存款: +" + amount);
            System.out.println("存款成功，当前余额: " + balance);
        }
        
        // 取款
        public void withdraw(double amount) {
            if (amount <= 0) {
                throw new IllegalArgumentException("取款金额必须大于0");
            }
            if (amount > balance) {
                throw new IllegalArgumentException("余额不足");
            }
            balance -= amount;
            addTransaction("取款: -" + amount);
            System.out.println("取款成功，当前余额: " + balance);
        }
        
        // 转账
        public void transfer(BankAccount targetAccount, double amount) {
            if (amount <= 0) {
                throw new IllegalArgumentException("转账金额必须大于0");
            }
            if (amount > balance) {
                throw new IllegalArgumentException("余额不足");
            }
            
            this.withdraw(amount);
            targetAccount.deposit(amount);
            addTransaction("转账给 " + targetAccount.accountNumber + ": -" + amount);
            targetAccount.addTransaction("收到来自 " + this.accountNumber + "的转账: +" + amount);
            
            System.out.println("转账成功！");
        }
        
        private void addTransaction(String transaction) {
            String timestamp = LocalDateTime.now().format(
                DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
            transactionHistory.add(timestamp + " - " + transaction);
        }
        
        public void printStatement() {
            System.out.println("\n=== 账户对账单 ===");
            System.out.println("账户号: " + accountNumber);
            System.out.println("户主: " + accountHolder);
            System.out.println("当前余额: " + balance);
            System.out.println("\n交易记录:");
            transactionHistory.forEach(System.out::println);
        }
        
        // Getter方法
        public String getAccountNumber() { return accountNumber; }
        public String getAccountHolder() { return accountHolder; }
        public double getBalance() { return balance; }
    }

    // 银行管理系统
    public class BankManagementSystem {
        private Map<String, BankAccount> accounts;
        
        public BankManagementSystem() {
            accounts = new HashMap<>();
        }
        
        public void createAccount(String accountNumber, String accountHolder, double initialBalance) {
            if (accounts.containsKey(accountNumber)) {
                System.out.println("账户号已存在！");
                return;
            }
            BankAccount account = new BankAccount(accountNumber, accountHolder, initialBalance);
            accounts.put(accountNumber, account);
            System.out.println("账户创建成功！");
        }
        
        public BankAccount getAccount(String accountNumber) {
            BankAccount account = accounts.get(accountNumber);
            if (account == null) {
                throw new IllegalArgumentException("账户不存在！");
            }
            return account;
        }
        
        public static void main(String[] args) {
            BankManagementSystem bank = new BankManagementSystem();
            Scanner scanner = new Scanner(System.in);
            
            // 创建测试账户
            bank.createAccount("1001", "张三", 1000);
            bank.createAccount("1002", "李四", 500);
            
            try {
                // 模拟银行业务
                BankAccount account1 = bank.getAccount("1001");
                BankAccount account2 = bank.getAccount("1002");
                
                account1.deposit(500);
                account1.withdraw(200);
                account1.transfer(account2, 300);
                
                // 打印对账单
                account1.printStatement();
                account2.printStatement();
                
            } catch (Exception e) {
                System.err.println("操作失败: " + e.getMessage());
            }
        }
    }
  ```