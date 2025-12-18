module.exports = {
    apps: [
        {
            name: "demo-server",
            script: "dist/main.js",
            cwd: "./", // 根目录
            watch: true, // 是否监听文件变动然后重启
            ignore_watch: [
                // 不用监听的文件
                "node_modules",
                "public",
            ],
            exec_mode: "cluster_mode", // 应用启动模式，支持 fork 和 cluster 模式
            instances: "max", // 应用启动实例个数，仅在 cluster 模式有效 默认为 fork
            error_file: "./logs/app-err.log", // 错误日志文件
            out_file: "./logs/app-out.log", // 正常日志文件
            merge_logs: true, // 设置追加日志而不是新建日志
            log_date_format: "YYYY-MM-DD HH:mm:ss", // 指定日志文件的时间格式
            min_uptime: "60s", // 应用运行少于时间被认为是异常启动
            max_restarts: 30, // 最大异常重启次数
            restart_delay: "60", // 异常重启情况下，延时重启时间

            env_production: {
                RUNNING_ENV: "prod",
            },
            env_development: {
                RUNNING_ENV: "dev",
            },
        },
    ],

    // deploy: {
    //   production: {
    //     user: 'SSH_USERNAME',
    //     host: 'SSH_HOSTMACHINE',
    //     ref: 'origin/master',
    //     repo: 'GIT_REPOSITORY',
    //     path: 'DESTINATION_PATH',
    //     'pre-deploy-local': '',
    //     'post-deploy':
    //       'npm install && pm2 reload ecosystem.config.js --env production',
    //     'pre-setup': '',
    //   },
    // },
};
