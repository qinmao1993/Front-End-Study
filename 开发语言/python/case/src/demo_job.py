# 任务调度 pip install apscheduler
from apscheduler.schedulers.blocking import BlockingScheduler
from apscheduler.triggers.date import DateTrigger
from apscheduler.triggers.cron import CronTrigger


# 创建调度器对象，它会阻塞当前线程，直到所有任务执行完成
scheduler = BlockingScheduler()


# 定义任务函数
def task_func():
    print("执行任务...")


# 添加定时任务-固定时间间隔
scheduler.add_job(task_func, "interval", seconds=2)


# 创建日期触发器
# trigger = DateTrigger(run_date="2024-09-06 12:00:00")

# scheduler.add_job(task_func, trigger)


# 使用Cron表达式进行任务调度
# Cron表达式是一种灵活而强大的调度方式，可以实现各种复杂的任务调度需求
trigger = CronTrigger.from_crontab('0 0 12 * * ?')


# 任务调度与多线程
# 在实际应用中，有些任务可能会耗时较长，为了不阻塞调度器的正常运行，我们可以将这些耗时任务放在单独的线程中执行

# import threading
# from apscheduler.schedulers.background import BackgroundScheduler

# 创建调度器对象
# scheduler = BackgroundScheduler()
# # 执行耗时任务
# threading.Thread(target=long_running_task).start()


# 启动调度器
scheduler.start()

