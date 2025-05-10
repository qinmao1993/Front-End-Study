# git 
## SSH|对称性/非对称性加密
* SSH： 一种加密协议，用于计算机之间的登录
* 对称性加密
   - 在加密和解密时，使用同一个秘钥。
* 非对称性加密
   - 在加密和解密时，使用不同的秘钥。一般具有一对秘钥，一个被称为是 公钥；另一个被称为 私钥；
   - 如果明文使用了私钥加密，必须使用与其对应的公钥才能解密成功。
   - 如果明文使用了公钥加密，必须使用与其对应的私钥才能解密成功。
## GIT 的基本使用
* 仓库
  + 初始化本地仓库
    ```bash
        git init 
        git config core.ignorecase false  # 创建工程时 运行 配置 git大小写忽略
    ```
    > git 在管理文件时，所有文件都具有三种状态:已修改、已暂存、已提交
    > 在上述三种状态，又对应三种目录空间
    - 已修改 -> 工作目录
    - 已暂存 -> 本地仓库的暂存区，通常就是在.git目录下的HEAD或INDEX文件
    - 已提交 -> 本地仓库的版本库
  + 配置用户,clone 远程仓库项目
    > git客户端要连接仓库，就要先生成ssh key，ssh key有公钥和私钥，生成后把公钥填到 git 站点上
    + git config [option]
      - --global: 全局配置，在当前用户下的所有仓库都共享同一个用户的配置信息
      - --system：系统配置，在该电脑下的所有仓库都共享同一个用户的配置信息
      - --local： 本地配置，在该仓库下使用当前配置的用户信息
      ```bash
        git config --get user.name | git config --get user.email       # 查看

        # 1. 配置账号
        git config --global user.name 'xx'  # 提交记录的时候会显示这个用户名
        git config --global user.email 'xxx@xxx.com'

        # 2. 生成ssh key
        
        cat ~/.ssh/id_rsa.pub  # 判断本地是否已经存在公钥 windows 保存在 C:\Users\登录用户下.ssh文件夹里
        ssh-keygen -t rsa    # 没有生成公钥和私钥

        # 3. 存在将本机的公钥放到代码托管仓库，如gitlab、github 在个人信息下的ssh秘钥选项中，添加秘钥，复制粘贴上去
        
      ```
  + 删除仓库：rm -rf .git  
  + 本地关联远程仓库并推送
    ```bash
      # 查看本地仓库与远程仓库的关联详情：
      git remote -v 

      git remote add origin git@github.com:qinmao/test.git
      git push -u origin master
    ```
  + 解除与远程仓库的关联：
    - git remote remove origin
* Git的基本工作流程
  1. 使用git init 或者 git clone 初始化 本地仓库，让git管理该目录下所有文件
  2. 在工作目录下，修改文件，新增文件，完成功能开发
  3. 将工作目录的文件提交到本地仓库的暂存区；
  4. 最后，再将暂存区文件 提交到 版本库，形成一个版本保存起来。每一次，从暂存区 提交到 版本库 都会形成一个新的版本。然后同指令来做版本的控制
* 状态查看
  ```bash
    # 查看文件状态，注意：会忽略空的目录
    git status 
    # 查看提交的历史版本 
    git log 
    # 查看所有历史提交版本
    git reflog --oneline 
    # 撤销指定文件的修改
    git checkout filename 
  ```
* 版本管理
  + git add [option] 将文件添加到暂存区
    - git add * 或者 git add -A 将工作目录下所有文件 提交到 暂存区
    - git add filename 指定某个文件 添加到 暂存区
  + git commit [option] -m '当前版本的描述信息'
    - 在做版本回退操作时，要根据版本描述信息定位到 要回退的版本。
    - 提交当个文件到版本库，形成一个新的版本。git commit filename -m '版本的信息'
  + 回退版本(reset命令有3种方式)
    - git reset -–mixed：此为默认方式，不带任何参数的 git reset。版本区和暂存区变化，工作区不变
    - git reset -–soft：回退到某个版本，只回退了commit的信息，不会恢复暂存区。 如果还要提交，直接commit即可

    - git reset --hard head~ 可以回到合并之前的提交
    - git reset --hard '版本id-sha值' 将指定版本内的文件替换掉工作目录内文件，实现版本的退。--hard 参数表示，同时更改暂存区。
    
    - git reset [option] HEAD^ 回退到上一个版本 
    - git reset HEAD^^ 回退到上上一个版本
    - git reset [option] HEAD~2  
* Git 分支管理
    - 在初始化一个空的本地仓库时，默认是没有主分支（master分支）的，必须在主分支上提交至少一次版本，Git才会创建master分支。Git在创建分支时，必须保证当前仓库必须有master分支。
    1. 创建分支
        - git branch name
        - git checkout -b branchName 创建并切换到新分支上。
    2. 查看分支
        - git branch
        - 有 * 标记的分支，表示当前工作目录所处的分支。
        - git branch -r 查看远程分支
        - git branch -a 查看所有分支

    3. 切换分支：git checkout branchName

    4. 合并分支：git merge branchName

    5. 删除分支
        - 本地：git branch -d branchName
        - 远程：git push origin --delete [branchname]

    6. Git分支策略
        在实际开发时，虽然Git分支很强大，但是也不能肆意使用。通常按照一定的策略来使用分支，提高开发的效率。
        1. 要保证主分支的稳定性，也就说要保证主分支的代码 是 无Bug的、功能完整。
        不能在主分支上进行开发。

        2. 如果需要开发新的功能，那么就要创建一个开发该功能的分支。然后在该分支上进行代码编写。
        当功能开发完毕，并且测试无Bug，将该分支上的代码合并 到 主分支上。

        该分支命名的一般规范为：
        所有的开发分支 都已 'dev-' + 相关功能描述的单词
        eg：我要开发登录功能，此时可以考虑创建一个开发分支，名字为 dev-login

        3. 如果遇到协同开发，就要创建协同开发分支，在该分支上去编写代码。
        当代码合并时，可能会出现文件冲突。一旦出现冲突，Git是解决不了的，只能人为的手动去处理。

        该分支命名的一般规范为：
        所有的开发分支 都已 'feature-' + 相关功能描述的单词
        eg：我要开发主页功能，此时可以考虑创建一个协同开发分支，名字为 feature-index

        4. 如果在开发时，接到一个临时修改Bug的任务，此时不要在主分支或者当前未完成的分支，进行Bug修改任务。此时要创建一Bug分支，在该分支上去修改出现Bug的代码。修改完成后，在其合并到主分支。

        该分支命名的一般规范为：
        所有的开发分支 都已 'bug-' + 相关功能描述的单词
        eg：我要修改登录超时问题，此时可以考虑创建一个Bug分支，名字为 bug-loginTimeout

        __如果出现冲突必须手动将冲突解决掉，然后在重新提交版本，然后解决冲突后的文件保存成一个版本__
* Tag
    - git tag -a v3.0 -m "这是3.0版本"
    - git push origin v3.0 
    - git tag -d v1.1  //删除本地tag
    - git push origin --delete tag V1.1 
## 长期使用存在的问题
* Git仓库重置与体积优化
  > 长时间使用后，Git 仓库会随着提交次数的增加而变得越来越大，对于那些经常需要克隆的仓库来说，就特别影响效率了。
  - 在不删库的情况下重置所有提交记录
  ```bash
     # 1. 同步本地仓库到最新后创建一个空的临时分支
     git checkout --orphan latest_branch
 
     # 2. 添加当前所有文件临时分支
     git add -A
 
     # 3. 提交
     git commit -am "Initial commit."
 
     # 4. 删除主分支
     git branch -D master
 
     # 5. 将临时分支重命名为主分支
     git branch -m master
 
     # 6. 强推主分支到远程仓库
     git push -f origin master
 
  ```
  - 清理 Git 缓存
  ```bash
     rm -rf .git/refs/original/
     git reflog expire --expire=now --all
     git fsck --full --unreachable
     git repack -A -d
     git gc --aggressive --prune=now
     git push --force origin master
  ```