# mysql
## MySQL数据库设置
* 字符集
  - utf8mb4 是真正的utf8 
* 排序规则 
  - utf8mb4_general_ci
## 数据库登录与操作
* 命令行登录
  ```bash
    # 语法：mysql -h ip -P 端口 -u 用户名 -p
    mysql -h localhost -P 3306 -u root -p
    # 本地登录 ip 和端口可以省略
    mysql -u root -p
  ```
* 修改登录密码
  ```bash
    # ⽅式1 通过管理员修改密码
        SET PASSWORD FOR '⽤户名'@'主机' = PASSWORD('密码');

    # ⽅式2：
       create user ⽤户名[@主机名]	[identi>ied	by	'密码'];
       set password = password('密码');

    # ⽅式3：通过修改 mysql.user 表修改密码
       use mysql;
       update user set authentication_string = password('321') where user = 'test1' and host = '%';
       flush privileges;
    # 注意:通过表的⽅式修改之后，需要执⾏ flush privileges;才能对⽤户⽣效。
    # 5.7 中user表中的 authentication_string 字段表⽰密码，⽼的⼀些版本中密码字段是 password。

    # 修改密码的加密方式
    ALTER USER 'root'@'%' IDENTIFIED BY 'yourpassword' PASSWORD EXPIRE NEVER; 
    ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY 'yourpassword';
    flush privileges;

  ```
* 命令行操作(登录成功后)
  ```bash
    # 显示所有数据库:
    show databases;
    # 进入指定的库:
    use 库名;
    # 显示当前库中所有的表
    show tables;
    # 查看其他库中所有的表:
    show tables from 库名;
  ```
## MySQL语法规范
1. 不区分⼤⼩写，但建议关键字⼤写，表名、列名⼩写
2. 每条命令⽤英⽂分号结尾
3. 每条命令根据需要，可以进⾏缩进或换⾏
4. 注释
  – 单⾏注释：# 注释⽂字
  – 单⾏注释：-- 注释⽂字  注意这⾥需要加空格
  – 多⾏注释：/* 注释⽂字 */
## 常用类型使用场景
* 表字段数据类型选择原则
  - 选⼩不选⼤：⼀般情况下选择可以正确存储数据的最⼩数据类型，越⼩的数据类型通常更快，占⽤磁盘，内存和CPU缓存更⼩。
  - 简单就好：简单的数据类型的操作通常需要更少的CPU周期
  - 尽量避免NULL：尽量制定列为 NOT	NULL，除⾮真的需要 NULL 类型的值，有NULL的列值会使得索引、索引统计和值⽐较更加复杂。
* 整数类型：tinyint、smallint、mediumint、int、bigint
  > 确保数据不会超过取值范围
  - tinyint 一般用于枚举数据
  - smallint 较小范围的统计数据
  - mediumint 较大整数的计算（车站每日的客流量）
  - int 用的最多，一般不用考虑超限问题
  - bigint 处理特别巨大的整数用到，如大型门户网站的点击量，双十一的交易量
* 浮点数类型：float(单精度)、double（双精度）、real(默认就是 DOUBLE)
  - FLOAT 和 DOUBLE 这两种数据类型的区别是啥呢？FLOAT 占用字节数少，取值范围小；DOUBLE 占用字节数多，取值范围也大
  - 浮点数的缺陷就是不精准，在一些对精确度要求较高的项目中，千万不要使用浮点数 如商品价格的设置
* 定点数类型：decimal(M,D)
  - M 表示整数部分加小数部分，一共有多少位，
  - M<=65。D 表示小数部分位数，D<M
  - 用在涉及金额计算中
* 文本类型：char、varchar、enum,set、text(tinytext、mediumtext、longtext)
  > char 和 varchar的区别?
  - char(M)   固定长度字符串
  - varchar(M) 可变长度字符串,只要不超过这个最大长度，具体存储的时候，是按照实际字符串长度存储的。
  - text 字符串 系统自动按照实际长度存储，不需要预先定义长度，因为实际存储长度不固定，MySQL 不允许 TEXT 类型的字段做主键
  - enum: 枚举类型，取值必须是预先设定的一组字符串值范围之内的一个，必须要知道字符串所有可能的取值。
  - set：是一个字符串对象，取值必须是在预先设定的字符串值范围之内的 0 个或多个，也必须知道字符串所有可能的取值。
* 日期与时间类型：Date、DateTime、TimeStamp、Time、Year
  - DateTime 用的最多（实际项目中尽量用这个）表达的时间最完整，不会随着系统的日期时区变化而变化
## 库表管理
> 如：建库、删库、建表、修改表、删除表、对列的增删改等等。
* 库管理
  + MySQL 系统自带的数据库
    - information_schema：是 MySQL 系统自带的数据库，主要保存 MySQL 数据库服务器的系统信息，比如数据库的名称、数据表的名称、字段名称、存取权限、数据文件所在的文件夹和系统使用的文件夹
    - performance_schema：是 MySQL 系统自带的数据库，可以用来监控 MySQL 的各类性能指标。
    - sys：数据库是 MySQL 系统自带的数据库，主要作用是，以一种更容易被理解的方式展示 MySQL 数据库服务器的各类性能指标，帮助系统管理员和开发人员监控 MySQL 的技术性能。“mysql”数据库保存了 MySQL 数据库服务器运行时需要的系统信息，比如数据文件夹、当前使用的字符集、约束检查信息

  + 建库通⽤的写法
    - drop database if exists 旧库名;
    - create database 新库名;

  - 删库 drop databases [if exists] 库名;

  + 字符集：在国内正常都是用【UTF-8】
  + 排序：utf_bin和utf_general_ci
      - utf_bin
      - utf_general_ci
* 表管理
  + 创建：create table xx(字段名1 类型[(宽度)] [约束条件] [comment '字段说明'])[表的⼀些设置];
    - not null 标识该字段不能为空
    - primary key：主键，可以唯⼀的标识记录，插⼊重复的会报错
    - foreign key：外键
    - unique key(uq)：标识该字段的值是唯⼀的,可为空值
    - auto_increment：标识该字段的值⾃动增长（整数类型，⽽且为主键）
      ```sql
        -- 示例：
        create table tb_test(b int not null default 0 comment '字段b'  primary key);
      ``` 
  + 修改表的相关语句：
    - 删除：drop table [if exists] 表名;
    - 修改表名： alter table 表名 rename [to] 新表名;
    - 修改字段： ALTER TABLE 表名 CHANGE 旧字段名 新字段名 数据类型;
    - 新增字段： ALTER TABLE 表名 ADD COLUMN 字段名 字段类型;
    - 表设置备注： alter table 表名 comment '备注信息';
## 表常见操作
> 以 INSERT、UPDATE、DELETE三种指 令为核⼼，分别代表插⼊、更新与删除
* 插⼊操作
  + 单行：
    - insert into 表名 set 字段 = 值,字段 = 值;（推荐使用）
  + 批量：
    - insert into 表名 [(字段,字段)] values (值,值),(值,值),(值,值)
    - 插入查询结果：insert into 表 [(字段,字段)] 数据来源 select 语句;
    ```sql
      INSERT INTO test(barcode,goodsname,price) VALUES ('0001','本',3),('0002','本',4);

      insert into test1 (a,b) select c2,c3 from test2 where c1>=200;

      -- t1 t2 表结构相同，把表t2中的数据合到t1中，存在相同 barcode 字段t2 覆盖t1
      INSERT INTO t1 SELECT * FROM t2 as a ON DUPLICATE KEY UPDATE barcode = a.barcodgoodsname=a.goodsname;
    ```
* 数据更新
  + 单表：update 表名 [[as] 别名] set [别名.]字段 = 值,[别名.]字段 = 值 [where条件];
    - update test1 as t set t.a = 3,t.b=4 where t.id=1
  + 多表:(推荐单表更新)
    - update 表1 [[as] 别名1],表名2 [[as] 别名2] set [别名.]字段 = 值,[别名.]字段 = 值 [where条件]
    - update test1 t1,test2 t2 set t1.a = 2 ,t1.b = 2, t2.c1 = 10 where t1.a= t2.c1;
* 数据删除
  + delete [别名] from 表名 [[as] 别名] [where条件];
    - delete from test1; 删除所有纪录
    - delete t1 from test1 t1 where t1.a>100;
  + 删除多表： delete t1 from test1 t1,test2 t2 where t1.a=t2.c2;
  + drop，truncate，delete区别：
    - drop(删除表)：删除内容和定义，释放空间，简单来说就是把整个表去掉，以后要新增数据是不可能的，除⾮新增⼀个表。
    - truncate(清空表中的数据)：删除内容、释放空间但不删除定义(保留表的数据结构)，与drop不同的是，只是清空表数据⽽已。
    - delete (删除表中的数据)：⽤于删除表中的⾏。delete语句执⾏删除的过程是每次从表中删除⼀⾏，并且同时将该⾏的删除操作作为事务记录在⽇志中保存，以便进⾏进⾏回滚操作。
## select 查询
* 语法
  ```sql
    SELECT *|字段列表
    FROM 数据源
    WHERE 条件
    GROUP BY 字段
    HAVING 条件
    ORDER BY 字段
    LIMIT 起始点，行数
  ```
* 条件查询：
  - 运算符详解（=、<、>、>=、<=、<>、!=）
  - 逻辑查询运算符 （and、or）
  - like 模糊查询介绍
  - between and 查询
  - in、not in 查询
  - IS	NULL、IS NOT NULL 查询空值的语法
* 案例：
  + 基础查询：
    - select * from stu t where t.age between 25 and 32; 等同于
    - select * from stu t where t.age >= 25 and t.age <= 32;
  + in 
    - select * from test6 t where t.age in (10,15,20,30);
    - select * from test6 t where t.age not in (10,15,20,30);
  + null：
    - 注意：查询运算符 like、between and、in、not in 对 NULL 值查询不起效。
    - mysql 为我们提供了查询空值的语法：IS	NULL、IS NOT NULL
    - 建议创建表的时候，尽量设置表的字段不能为空，给字段设置⼀个默认值
  + like
    - select * from students where name like '%xxx%';
  + 面试题：2个sql查询结果⼀样么？
    - select * from students;
    - select * from students where name like '%';
    - 当 name 没有 NULL 值时，返回的结果⼀样。当name有NULL值时，第2个sql查询不出name为NULL的记录。
* 排序和分页
  + 排序：
    - 排序语法：select 字段名 from 表名 order by 字段1 [asc|desc],字段2 [asc|desc];
    - 排序的规则：asc：升序，desc：降序，默认为asc；
    - select age '年龄',id as '学号' from stu order by 年龄 asc,学号 desc;
  + 分页
    - select 列 from 表 limit [offset,] count;
    - offset：表⽰偏移量，通俗点讲就是跳过多少⾏，offset可以省略，默认为0，表⽰跳过0⾏；范围：[0,+∞)。
    - count：跳过offset⾏之后开始取数据，取count⾏记录；范围：[0,+∞)。
    ```sql
      select * from user limit (currentPage - 1) * pageSize,pageSize;
    ```
* 分组查询
  ```sql
    -- 基本的分组查询
    SELECT user_id,count(*) FROM t_order  GROUP BY user_id

    -- 按字段分组，并获取的不同状态的数据
    SELECT deal_dep,count(1) '总任务数',sum( CASE WHEN `status` = 50 THEN 1 ELSE 0 END ) AS '已完成' FROM lz_task GROUP BY deal_dep

    -- 计算百分比
	SELECT 
	 COUNT(*) as total,
	 CONCAT(ROUND((SUM(CASE WHEN status = 20 THEN 1 ELSE 0 END) / COUNT(*) ) * 100, 2),'%') AS '未签收占比'
	 from lz_task task

    -- 按指定日期间隔分组，存在不连续的日期:1. 代码补全、2.创建一个连续日期的临时表
    
    -- 现有的表，各类型数据不全，根据类型字典表关联补全
    
    SELECT
      name,
      sum(CASE WHEN `status` > 0 THEN 1 ELSE 0 END ) '总任务数',
      sum( CASE WHEN `status` = 50 THEN 1 ELSE 0 END )  '已完成',
      sum( CASE WHEN `status` < 50 AND `status` > 10 THEN 1 ELSE 0 END )  '未完成' 
    FROM
      lz_department AS dep
      LEFT JOIN lz_task AS task ON dep.name = task.deal_dep
    GROUP BY
      name
  ```
* where 和 having 的区别:
  - where 对表中的字段进行限定，来筛选结果（在关联查询中先筛选再连接）
  - having 则需要跟分组关键字 GROUP BY 一起使用，通过对分组字段或分组计算函数进行限定，来筛选结果（在关联查询中先连接再筛选）
* 数据去重
  - distinct 通常效率较低。它不适合用来展示去重后具体的值，一般与 count 配合用来计算条数
  - group by
  - 示例：
   ```sql
    select distinct taskId from task
    select count(distinct taskID) as taskNum from task

    select task_id from Task group by task_id;
    select count(task_id) task_num from (select task_id from Task group by task_id) tmp;
   ```
## 关联查询
* 外键约束：
  - 可以帮助我们确定从表中的外键字段与主表中的主键字段之间的引用关系，
  - 还可以确保从表中数据所引用的主表数据不会被删除，从而保证了 2 个表中数据的一致性。
  - 在高并发场景下，影响性能，可在业务代码中处理一致性的问题
* 笛卡尔积
  - 有两个集合A和B，笛卡尔积表⽰A集合中的元素和B集合中的元素任意相互关联产⽣的所有可能的结果。
* 内连接：
  - 表示查询结果只返回符合连接条件的记录，这种连接方式比较常用
  - 关键字 JOIN、INNER JOIN、CROSS JOIN 的含义是一样的

  - select 字段 from 表1 inner join 表2 on 连接条件;
  - select 字段 from 表1 join 表2 on 连接条件;

* 外连接
  - 表示查询结果返回某一个表中的所有记录，以及另一个表中满足连接条件的记录。
  - 外连接涉及到2个表，分为：主表和从表，要查询的信息主要来⾃于哪个表，谁就是主表
  + 左连接
    - select 列 from 主表 left join 从表 on 连接条件;
    - SELECT t1.emp_name,t2.team_name FROM t_employee t1 LEFT JOIN t_team t2 ON t1.team_id = t2.id WHERE t2.team_name IS  NOT NULL;
  + 右链接
    - select 列 from 从表 right join 主表 on 连接条件;
## 子查询
> 出现在 select 语句中的 select语句，称为⼦查询或内查询
* select后面的子查询
  ```sql
    # 查询每个部门员工个数
    SELECT
    a.*,
    (SELECT count(*)
    FROM employees b
    WHERE b.department_id = a.department_id) AS 员工个数
    FROM departments a;

    # 查询员工号=102的部门名称
    SELECT (SELECT a.department_name
        FROM departments a, employees b
        WHERE a.department_id = b.department_id
              AND b.employee_id = 102) AS 部门名;
  ```
* from 后面的子查询
    ```sql
        # 查询每个部门平均工资的工资等级
        -- 查询每个部门平均工资
        SELECT
        department_id,
        avg(a.salary)
        FROM employees a
        GROUP BY a.department_id;

        -- 薪资等级表
        SELECT *
        FROM job_grades;
        -- 将上面2个结果连接查询，筛选条件:平均工资 between lowest_sal and highest_sal;

        SELECT
        t1.department_id,
        sa AS '平均工资',
        t2.grade_level
        FROM (SELECT
                department_id,
                avg(a.salary) sa
            FROM employees a
            GROUP BY a.department_id) t1, job_grades t2
        WHERE
        t1.sa BETWEEN t2.lowest_sal AND t2.highest_sal;
    ```
* where 和 having 后面的子查询
  ```sql
    # 查询员工编号最小并且工资最高的员工信息
    SELECT *
    FROM employees a
    WHERE a.employee_id = (SELECT min(employee_id)
                        FROM employees)
        AND salary = (SELECT max(salary)
                        FROM employees);

    # 返回location_id 是 1400 或 1700 的部门中的所有员工姓名
    SELECT DISTINCT department_id
    FROM departments
    WHERE location_id IN (1400, 1700);

    # 子查询+分组函数，示例
    # 查询最低工资大于 50号部门最低工资的 部门id和其最低工资【having】
    SELECT
    min(a.salary) minsalary,
    department_id
    FROM employees a
    GROUP BY a.department_id
    HAVING min(a.salary) > (SELECT min(salary)
                            FROM employees
                            WHERE department_id = 50);
    ```
* 字段值为 NULL 的时候，not in 查询有大坑，这个要注意
## NULL 的坑
* 任何值和NULL使用运算符（>、<、>=、<=、!=、<>）或者（in、not in、any/some、all）比较时，返回值都为NULL，NULL作为布尔值的时候，不为1也不为0。
* count(字段)无法统计字段为NULL的值，count(*)可以统计值为null的行
## 常⽤函数
* 数值型函数
  - abs 绝对值
  - sqrt 开方
  - mod 取余
  - ceil 和 ceiling 向上取整
  - floor 向下取整
  - rand 生成随机数
  - round 四舍五入
* 字符串函数
  - length: select length('javacode2018')
  - concat:合并字符串  select concat('路⼈甲','java'),若有任何⼀个参数为NULL，则返回值为 NULL
  - upper:将字⺟转换成⼤写  select upper('路⼈甲java');
  - left:从左侧截取字符串  select left('路⼈甲JAVA',2)
  - right:从右侧截取字符串
  - substr 和 substring:截取字符串 select substr('12345',2) 
  - trim:删除字符串两侧空格   select '[ 路⼈甲Java ]',concat('[',trim(' 路⼈甲Java '),']');
  - reverse:反转字符串
* ⽇期和时间函数
  - 获取当前时间：
    ```sql
      -- curdate 和 current_date:作⽤相同，返回当前系统的⽇期值：2019-09-17  20190918
      select current_date(),current_date()+1;

      -- curtime 和 current_time:获取系统当前时间 16:11:25  161126
      select curtime(),current_time(),current_time()+1;
      
      -- now 和 sysdate:获取当前时间⽇期 2019-09-17 16:13:28
      select now(),sysdate();

      -- 2019-09-17
      select DATE(now())  

      -- DAYOFWEEK() 今天周几 1 表示周日，2 表示周一，以此类推，直到 7 表示周六。
      select DAYOFWEEK(now());

      -- 获取 UNIX 时间戳
      select unix_timestamp(),unix_timestamp(now()),unix_timestamp('2019-09-17 12:00:00');
      -- 时间戳转⽇期 FROMUNIXTIME(unixtimestamp[,format]) format：要转化的格式 ⽐如“”%Y-%m-%d“”	
    ```
  - 获取指定的时间
    ```sql
     -- year:获取年份  
     select year(now()),year('2019-01-02');

     -- month:获取指定⽇期的⽉份  

     select month('2017-12-15'),month(now());
     -- day
     -- hour
     -- MINUTE
     -- SECOND
    ```
  - 时间转换
    ```sql
      -- time_to_sec:将时间转换为秒值
      select time_to_sec(now());

      -- sec_to_time:将秒值转换为时间格式  
      select sec_to_time(100),sec_to_time(10000);

      -- date_format:格式化指定的⽇期
      select date_format(now(), '%Y-%m-%d')
      select date_format('2017-11-30','%Y%m%d') as col0,date_format(now(),'%Y%m%d%H%i%s') as col2;

    ```
  - 时间运算：
    ```sql
      -- date_add 和 adddate:向⽇期添加指定时间间隔
      -- date_sub 和 subdate:⽇期减法运算 
      select date_sub('2019-01-01',interval 10 day)
      select subdate('2019-01-01 16:00:00',interval 100 SECOND)

      -- addtime:时间加法运算
      -- subtime:时间减法运算

      -- datediff:获取两个⽇期的时间间隔
      select datediff('2017-11-30','2017-11-29') as col1, datediff('2017-11-29','2017-11-30') as col2; 

     -- TIMESTAMPDIFF：获取两个日期的差值 单位分钟
      SELECT * FROM lz_yqms_data WHERE TIMESTAMPDIFF(MINUTE, publish_time, CURRENT_TIMESTAMP) <= 30
    ```
* 聚合函数:多用在分组统计
  - max
  - min
  - count 统计结果函数
  - sum 求和
  - avg 求平均值
* 流程控制函数
  - if
  - IFNULL(v1,v2)：v1为空返回v2，否则返回v1。
  - case:搜索语句,类似于java中的if..else if..else
* 其他函数
  - md5  SELECT md5('123456');
## 索引
> 解决数据量大时查询慢的问题
* 索引是什么？
  - 就相当于图书馆的检索目录，它是帮助 MySQL 系统快速检索数据的一种存储结构
  - 我们可以在索引中按照查询条件，检索索引字段的值，然后快速定位数据记录的位置，这样就不需要遍历整个数据表了。而且，数据表中的字段越多，表中数据记录越多，速度提升越是明显。
  - mysql 支持单字段索引和组合索引
  - 给表设定主键约束或者唯一性约束的时候，MySQL 会自动创建主键索引或唯一性索引
* 单字段索引管理：
  ```sql
    -- 给已存在的表建索引
    CREATE INDEX 索引名 ON  表名 (字段);
    -- 创建表的同时创建索引
    CREATE TABLE 表名
    (
    字段 数据类型,
    { INDEX | KEY } 索引名(字段)
    )
    -- 修改表时创建索引
    ALTER  表名 ADD { INDEX | KEY } 索引名 (字段);

    -- 删除索引
    DROP INDEX 索引名 ON 表名;

    -- 有些索引不能使用上面的命令 如删除主键索引，可用下面修改表的语句
    ALTER TABLE 表名 DROP PRIMARY KEY；
   
  ```
* 单字段索引的作用原理：
  - explain select filed from tableName where ['字段'] 条件
  - 存在多个索引的时候mysql会选择最优的索引来执行查询操作
* 组合索引：
  - 组合索引的多个字段是有序的，遵循左对齐的原则
  ```sql 
    -- 多个索引同时发挥作用
    CREATE INDEX 索引名 ON TABLE 表名 (字段1，字段2，...); 

    -- 创建表的同时创建索引：
    CREATE TABLE 表名
    (
    字段 数据类型,
    { INDEX | KEY } 索引名(字段1，字段2，...)
    )

  ```
* 索引设置的建议：
  - 优先使用唯一索引
  - 常用查询字段
  - 为排序和分组字段
  - 一张表的索引不超过5个
  - 表数量少，可不建
  - 尽量使用占用空间少的字段
  - 用idx_或unx_等前缀命名
* 使用索引的成本
  - 存储空间的开销，是指索引需要单独占用存储空间。
  - 数据操作上的开销，插入、修改、删除数据，如果涉及索引字段，都需要对索引本身进行修改。
## 事务
* 事务: 指对数据库执行一批操作，这些操作最终要么全部执行成功，要么全部失败，不会存在部分成功的情况
* 语法
  ```sql
    START TRANSACTION 或者 BEGIN （开始事务）
    一组DML语句
    COMMIT（提交事务）
    ROLLBACK（事务回滚）
  ```
* 特性:
  - 原子性: 要么全部成功，或者全部失败
  - 一致性: 数据库从一个一致性状态变换到另一个一致性状态。转账的例子
  - 隔离性: 一个事务的执行不能被其他事务干扰。
  - 持久性: 当事务提交之后，数据会持久化到硬盘，修改是永久性的。
* 隐式事务: mysql中事务默认是隐式事务，执行 insert、update、delete 操作的时候，数据库自动开启事务、提交或回滚事务
    - 查看变量 autocommit 是否开启了自动提交
    - show variables like 'autocommit';
* 显式事务:需要手动开启、提交或回滚，由开发者自己控制。
## 临时表
* 什么是临时表：
  - 是一种特殊的表，用来存储查询的中间结果，会随着当前连接的结束而自动删除
* 使用场景：一般用来简化复杂查询
* mysql中有两种临时表：
  - 内部临时表：用于性能优化，由系统自动产生，我们无法看到
  - 外部临时表：通过 SQL 语句创建，我们可以使用
* 创建外部临时表
  - 语法：
    ```sql
        CREATE TEMPORARY TABLE 表名
        (
        字段名 字段类型,
        ...
        );
    ```
  - 通过查询创建的示例
    ```sql
      -- 用查询的结果直接生成临时表
      CREATE TEMPORARY TABLE demo.mysales
        SELECT  itemnumber, SUM(quantity) AS QUANTITY, SUM(salesvalue) AS salesvalue FROM demo.transactiondetails 
        GROUP BY itemnumber
        ORDER BY itemnumber;
    ```
* 内存临时表
  - 由于采用的存储方式不同，临时表也可分为内存临时表和磁盘临时表（默认）
  - 创建内存临时表,查询速度更快
    ```sql
        CREATE TEMPORARY TABLE test
        (
        itemnumber int,
        groupnumber int,
        branchnumber int
        ) ENGINE = MEMORY; 
    ```
* 临时表开销较大不建议在高并发的场景下使用
## 视图
* 视图：是一种虚拟表，把一段查询语句作为视图存储在数据库中，在需要的时候，可以把视图看做一个表，对里面的数据进行查询。
* 使用场景：
  - 多个地方使用到同样的查询结果，并且该查询结果比较复杂的时候。
* 视图的好处：
  - 简化复杂的sql操作，不用知道他的实现细节
  - 提高了安全性：隔离了原始表，可以不让使用视图的人接触原始的表，保护原始数据
* 语法：
  - create view 视图名 as 查询语句;
* 案例
  ```sql
    /*案例1：查询姓名中包含a字符的员工名、部门、工种信息*/
    /*①创建视图myv1*/
    CREATE VIEW myv1
    AS
    SELECT
        t1.last_name,
        t2.department_name,
        t3.job_title
    FROM employees t1, departments t2, jobs t3
    WHERE t1.department_id = t2.department_id
            AND t1.job_id = t3.job_id;
            
    /*②使用视图*/
    SELECT * FROM myv1 a where a.last_name like 'a%';
  ```
* 注意：可对视图中的数据更改，但不建议这么做，更改去具体的表
* 视图和临时表有什么区别？
  - 视图是存储在服务器上的查询语句，所有的连接只要有相应的权限，就可以使用。临时表只限于当前连接，连接中断自动删除的。
  - 视图是不保存数据的，临时表保存数据
## 存储过程
* 存储过程：
   - 就是把一系列 SQL 语句预先存储在 MySQL 服务器上，需要执行的时候，客户端只需要向服务器端发出调用存储过程的命令，服务器端就可以把预先存储好的这一系列 SQL 语句全部执行。
* 使用场景
  - 超市每天营业结束后，超市经营者都要计算当日的销量，核算成本和毛利等营业数据，这也就意味着每天都要做重复的数据统计工作。其实，这种数据量大，而且计算过程复杂的场景，就非常适合使用存储过程
* 好处：
  - 不仅执行效率非常高，减少sql网络传输暴露的风险。
* 如何创建存储过程？
  - CREATE PROCEDURE 存储过程名 （[ IN | OUT | INOUT] 参数名称 类型）程序体
  - 示例：
  ```sql
     DELIMITER // -- 设置分割符为//
     CREATE PROCEDURE demo.dailyoperation(transdate TEXT)
     BEGIN -- 开始程序体
     DECLARE startdate,enddate DATETIME; -- 定义变量
     SET startdate = date_format(transdate,'%Y-%m-%d'); -- 给起始时间赋值
     SET enddate = date_add(startdate,INTERVAL 1 DAY); -- 截止时间赋值为1天以后
     -- 删除原有数据
     DELETE FROM demo.dailystatistics
     WHERE
     salesdate = startdate;
     -- 插入新计算的数据
     INSERT into dailystatistics
     (
     salesdate,
     itemnumber,
     quantity,
     actualvalue,
     cost,
     profit,
     profitratio
     )
     SELECT
     LEFT(b.transdate,10),
     a.itemnumber,
     SUM(a.quantity), -- 数量总计
     SUM(a.salesvalue), -- 金额总计
     SUM(a.quantity*c.avgimportprice), -- 计算成本
     SUM(a.salesvalue-a.quantity*c.avgimportprice), -- 计算毛利
     CASE sum(a.salesvalue) WHEN 0 THEN 0
     ELSE round(sum(a.salesvalue-a.quantity*c.avgimportprice)/sum(a.salesvalue),4) END -- 计算毛利率
     FROM
     demo.transactiondetails AS a
     JOIN
     demo.transactionhead AS b
     ON (a.transactionid = b.transactionid)
     JOIN
     demo.goodsmaster c
     ON (a.itemnumber=c.itemnumber)
     WHERE
     b.transdate>startdate AND b.transdate<enddate
     GROUP BY
     LEFT(b.transdate,10),a.itemnumber
     ORDER BY
     LEFT(b.transdate,10),a.itemnumber;
     END
     // -- 语句结束，执行语句
     DELIMITER ; -- 恢复分隔符为；
    ```
## 触发器
  - 让数据修改自动触发关联操作，确保数据一致性
## 权限管理
* 用户权限工作原理
  - mysql 采⽤⽤户名+主机名来识别⽤户的⾝份
+ 权限验证分为2个阶段
  - 阶段1：连接数据库，此时 mysql 会根据你的⽤户名及你的来源（ip或者主机名称）判断是否有权限连接
  - 阶段2：对 mysql 服务器发起请求操作，如 create table、select、delete、update、create index 等操作，此时 mysql 会判断你是否有权限操作这些指令
* 创建用户
  ```sql
    # 语法: create user ⽤户名[@主机名] [identified by '密码'];
    # 主机名默认值为 %，表⽰这个⽤户可以从任何主机连接 mysql 服务器
    # 密码可以省略，表⽰⽆密码登录
    create user test1; 不指定主机名,表⽰这个⽤户可以从任何主机连接 mysql 服务器
    create user 'test2'@'localhost' identified by '123'; 
    create user 'test3'@% identified by '123';
  ```
## 日志
 >日志帮助我们排查错误，性能,日志也可以帮助我们找回由于误操作而丢失的数据，
* 通用查询日志
  - 记录了所有用户的连接开始时间和截止时间，以及发给 MySQL 数据库服务器的所有 SQL 指令。
  ```bash
    mysql> SHOW VARIABLES LIKE '%general%';
    +------------------+---------------+
    | Variable_name | Value |
    +------------------+---------------+
    | general_log | OFF | -- 通用查询日志处于关闭状态
    | general_log_file | GJTECH-PC.log | -- 通用查询日志文件的名称是GJTECH-PC.log
    +------------------+---------------+
    2 rows in set, 1 warning (0.00 sec)
  ```
  - 开启通用查询日志
  ```bash
    SET GLOBAL general_log = 'ON';
  ```
  - mysql 日志中的日期默认是utc 需要改成系统时间
  ```sql
    SHOW GLOBAL VARIABLES LIKE 'log_timestamps';
    SET GLOBAL log_timestamps = SYSTEM;
  ```
* 慢查询日志
  - 慢查询日志用来记录执行时间超过指定时长的查询
  - MySQL 的配置文件进行控制
  + 如何开启和配置
    - 配置文件：需要重启服务
    - windows 的配置文件 my.ini 一般在MySql安装的根目录下
    - Linux 系统中的MySQL配置文件是 一般情况下 在 /etc/my.cnf 或 /etc/mysql/my.cnf 目录下
     ```sql
        slow-query-log=1 -- 表示开启慢查询日志，系统将会对慢查询进行记录。
        slow_query_log_file="GJTECH-PC-slow.log"  -- 表示慢查询日志的名称是"GJTECH-PC-slow.log"
        long_query_time=10  -- 表示慢查询的标准是查询执行时间超过10秒
     ```  
    - 命令行
      ```bash
      set global slow_query_log = 1;
      set global long_query_time=10;
      ```
* 错误日志
  - 错误日志默认是开启的
  - 配置文件中配置
  ```bash
    # Error Logging.
    log-error="GJTECH-PC.err"
  ```
* 二进制日志
  - 作用：二进制日志主要记录数据库的更新事件,是进行数据恢复和数据复制的利器
  - 二进制日志的操作
  ```sql
    # 查看当前正在写入的二进制日志
    SHOW MASTER STATUS;

    # 查看所有的二进制日志
    SHOW BINARY LOGS;

    # 查看二进制日志中所有数据更新事件
    SHOW BINLOG EVENTS IN 二进制文件名;

    # 刷新二进制日志
    FLUSH BINARY LOGS;

    # 用二进制日志恢复数据
    mysqlbinlog –start-positon=xxx --stop-position=yyy 二进制文件名 | mysql -u 用户 -p

    # 删除二进制日志
    RESET MASTER;
  ```
* 中继日志
* 回滚日志
* 重做日志
## 三个范式
* 第一范式：数据表中所有字段都是不可拆分的基本数据项。
* 第二范式：在满足第一范式的基础上，数据表中所有非主键字段，必须完全依赖全部主键字段，不能存在部分依赖主键字段的字段。
* 第三范式：在满足第二范式的基础上，数据表中不能存在可以被其他非主键字段派生出来的字段，或者说，不能存在依赖于非主键字段的字段。
## ER模型
* 理清数据库设计思路


