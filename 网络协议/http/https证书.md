# https 证书问题

## 使用 openssl 生成 tls 证书
1. 生成私钥
 ```bash
   # 这将生成一个加密的私钥文件 key.pem，并要求您设置密码以保护私钥。-aes256 
   # 选择 不加密 
   openssl genpkey -algorithm RSA -out private-key.pem 
 ```
2. 生成证书请求文件(用完可以删掉也可以保留)
 ```bash
  # 在执行该命令时，您需要输入一些证书相关的信息，如国家、州、城市等。
  openssl req -new -key private-key.pem -out csr.pem
 ```
3. 生成自签名证书
 ```bash
  # 这将生成一个有效期为 365 天的自签名证书 public-certificate.pem
  openssl x509 -req -days 365 -in csr.pem -signkey private-key.pem  -out public-certificate.pem
   
  ```

## 创建自签名证书
  > Create self signed tls certificates without OpenSSL.
  ```bash
    npm install -g mkcert
    # 创建证书颁发机构
    mkcert create-ca --organization demo --country-code CN --state anhui  --locality mingguang  --validity  365  --key ca.key  --cert ca.crt

    # 创建证书 默认是 --domains localhost,127.0.0.1
    mkcert create-cert --ca-key ca.key --ca-cert ca.crt --validity --key private-key.pem  --cert public-certificate.pem --organization  demo   

  ``` 
  ```js
    import { createCA, createCert } from "mkcert";

    const ca = await createCA({
        organization: "Hello CA",
        countryCode: "NP",
        state: "Bagmati",
        locality: "Kathmandu",
        validity: 365
    });

    const cert = await createCert({
        ca: { key: ca.key, cert: ca.cert },
        domains: ["127.0.0.1", "localhost"],
        validity: 365
    });

    console.log(cert.key, cert.cert); // certificate info
    console.log(`${cert.cert}${ca.cert}`); // create full chain certificate by merging CA and domain certificates
  ```  

## 自签名证书信任问题
* 信任问题 
  - 大多数浏览器会默认不信任自签名证书，因为它们没有经过公信机构的验证。您需要手动将自签名证书添加到浏览器的信任存储中。您可以在浏览器的证书管理或安全设置中找到选项来导入证书。一旦证书被信任，您应该能够通过 https://localhost 访问您的网站。
* 手动导入证书：在 Chrome 中
  1. 打开 Chrome 设置：点击右上角的菜单按钮，选择 "Settings"。
  2. 展开高级设置：在底部点击 "Advanced"。
  3. 管理证书：在 "Privacy and security" 部分，点击 "Manage certificates"。
  4. 导入证书：选择 "Trusted Root Certification Authorities" 选项卡，在那里导入您的自签名证书文件（一般是 .pem  或 .crt 格式）。
  5. 确认导入：按照指示导入证书，可能需要输入管理员密码。
  6. 重启浏览器：关闭并重新打开 Chrome，以确保更改生效。
  - [mac设置参考](https://www.cnblogs.com/mysticbinary/p/12577673.html)

## Let's Encrypt（常用免费的证书提供商）
* 免费、自动化、开放的证书颁发机构
* 证书有效期：90天
* 支持通配符证书（需要DNS验证）

## 自动续期工具
```bash
    # 安装Certbot
    # Ubuntu/Debian
    sudo apt update
    sudo apt install certbot python3-certbot-nginx

    # CentOS/RHEL
    sudo yum install certbot python3-certbot-nginx


    # 获取证书（Nginx示例）
    sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

    # 仅获取证书（不修改配置）
    sudo certbot certonly --webroot -w /var/www/html -d yourdomain.com

    # 测试自动续期
    sudo certbot renew --dry-run
    # 设置自动续期
    sudo certbot renew --quiet


    # 使用系统Cron 编辑 crontab
    sudo crontab -e

    # 添加以下行（每月1号和15号凌晨3点续期）
    # --post-hook 续期后脚本
    0 3 1,15 * * /usr/bin/certbot renew --quiet --post-hook "systemctl reload nginx"
```
