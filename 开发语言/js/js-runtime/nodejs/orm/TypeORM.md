# TypeORM
## save 
* 表中数据存在则更新，不存在插入
* 它将所有给定的实体保存在一个事务中(对于实体，Manager 不是事务性的)。
* 还支持部分更新，因为跳过了所有未定义的属性。返回保存的实体/实体。
 ```ts
  await repository.save(user)
  await repository.save([category1, category2, category3])
 ```
## insert
* 插入一个新的或者多个实体
* 与save相比没有级联与关联操作操作，也不会查询数据库是否存在实体，因此执行的更快更有效率
* 插入的相同的数据会报错
  ```ts
    await repository.insert({
        firstName: "Timber",
        lastName: "Timber",
    })

    await repository.insert([
        {
            firstName: "Foo",
            lastName: "Bar",
        },
        {
            firstName: "Rizz",
            lastName: "Rak",
        },
    ])
  ```
## remove
* 移除一个或多个实体，返回被移除的实体
 ```ts
  await repository.remove(user)
  await repository.remove([category1, category2, category3])
 ```
## delete
* Deletes entities by entity id, ids or given conditions:
* 与save不同，没有级联和关联操作，也不会查询数据库是否存在实体，因此执行的更快更有效率
```ts
    await repository.delete(1)
    await repository.delete([1, 2, 3])
    await repository.delete({ firstName: "Timber" })
```
## update
* 通过给定的条件更新部分属性
* 与save不同，没有级联和关联操作，也不会查询数据库是否存在实体，因此执行的更快更有效率
```ts
    await repository.update({ age: 18 }, { category: "ADULT" })
    // executes UPDATE user SET category = ADULT WHERE age = 18

    await repository.update(1, { firstName: "Rizzrak" })
    // executes UPDATE user SET firstName = Rizzrak WHERE id = 1
```
## 执行原生的sql
* 返回执行结果，无实体转换
  ```ts
    const rawData = await repository.query(`SELECT * FROM USERS`)
    // For mysql/mysql2 you should use ? 
    const rawData = await repository.query(`SELECT * FROM USERS where id=?`,[1])
  ```
## 实体字段设置索引
```ts
    import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';
    // 为单个字段设置索引
    @Entity()
    export class User {
        @PrimaryGeneratedColumn()
        id: number;

        @Index()
        @Column()
        email: string;
    }

    // 为多个字段创建复合索引
    @Entity()
    @Index('IDX_USER_EMAIL_NAME', ['email', 'name']) 
    export class User {
        @PrimaryGeneratedColumn()
        id: number;

        @Column()
        email: string;

        @Column()
        name: string;

    // 其他字段
    }



```
## 表关系
> 表之间的关系有三种：一对一、一对多、多对多，在 typeorm中分别用装饰器 OneToOne、OneToMany、ManyToMany

## QueryBuilder
* QueryBuilder 是 TypeORM 最强大的特性之一，它允许您使用优雅和方便的语法构建 SQL 查询，执行它们并获得自动转换的实体。
  ```ts
    // 简单的例子
    repository
    .createQueryBuilder("user")
    .where("user.id = :id", { id: 1 })
    .getOne()

    // select
    .createQueryBuilder()
    .select("user")
    .from(User, "user")
    .where("user.id = :id", { id: 1 })
    .getOne()

    // 分页查询
    .skip(5)
    .take(10)
    .getManyAndCount()

    // insert
    .createQueryBuilder()
    .insert()
    .into(User)
    .values([
        { firstName: "Timber", lastName: "Saw" },
        { firstName: "Phantom", lastName: "Lancer" },
    ])
    .execute()

    // update
    .createQueryBuilder()
    .update(User)
    .set({ firstName: "Timber", lastName: "Saw" })
    .where("id = :id", { id: 1 })
    .execute()

    // delete
    .createQueryBuilder()
    .delete()
    .from(User)
    .where("id = :id", { id: 1 })
    .execute()

    // 关联
    .createQueryBuilder()
    .relation(User,"photos")
    .of(id)
    .loadMany();

    // 特殊的查询，如sum等没有实体对应，需要用 getRawOne、getRawMany
    .createQueryBuilder("user")
    .select("SUM(user.photosCount)", "sum")
    .where("user.id = :id", { id: 1 })
    .getRawOne()

    .createQueryBuilder("user")
    .select("user.id")
    .addSelect("SUM(user.photosCount)", "sum")
    .groupBy("user.id")
    .getRawMany()

    // .orderBy("user.id", "DESC")
    // .addOrderBy("user.id")
    // .having("user.firstName = :firstName", { firstName: "Timber" })
    // .andHaving("user.lastName = :lastName", { lastName: "Saw" })

    // 已建立关联关系的表
    createQueryBuilder("user")
    .leftJoinAndSelect("user.photos", "photo")
    .where("user.name = :name", { name: "Timber" })
    .getOne()

    // 未建立关联关系的
    createQueryBuilder("user")
    .leftJoinAndSelect("photos", "photo", "photo.userId = user.id")
    .getMany()
    
    // 未建立关联关系的分页

    // 避免服务crash，可设置最大执行时间
    .createQueryBuilder("user")
    .maxExecutionTime(1000) // milliseconds.
    .getMany()

    // 获取部分实体
    .createQueryBuilder("user")
    .select(["user.id", "user.name"])
    .getMany()

  ```


## 连接多数据库的问题
* TODO

## 如何查看 TypeORM 翻译后的原始SQL语句
> 有两种方式
1. 日志：有两种
  - 通用的开启 MySQL 的日志文件
  - TypeORM 通过配置开启自带的日志文件，生成的日志 ormlogs.log 在项目的根目录下 [详情](https://typeorm.io/logging)
2. createQueryBuilder 自带 getSql、printSql两方法，getQueryAndParameters
