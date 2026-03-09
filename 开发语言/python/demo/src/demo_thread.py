# 计算机资源充足时，并行提升处理任务的速度

from concurrent.futures import ThreadPoolExecutor, as_completed
import queue
from threading import Thread
import time

# q=multiprocessing.Queue()
# q.full、q.empty()、q.qsize()(windows)

tasks = [1, 2, 3, 4, 2, 2, 2, 3, 1, 1, 1]


# 定义一个函数，模拟耗时操作
def deal_task(name, delay):
    time.sleep(delay)  # 模拟耗时操作
    print(name)
    return name


# 串行耗时: 10.009476900100708 seconds
def test_serial():
    # # 记录开始时间
    start_time = time.time()

    for index, taskName in enumerate(tasks):
        deal_task(taskName, index + 1)

    # 记录结束时间
    end_time = time.time()

    # 计算执行时间：10.016077041625977 seconds
    execution_time = end_time - start_time
    print(f"串行耗时: {execution_time} seconds")


# # 单核：多线程不关心执行结果的顺序，适合IO密集型任务
# # max_workers 默认值是 None
# # 线程池会根据需要动态增加或减少线程数量，以最大程度地利用可用的系统资源和提高任务执行效率。
# # 通常情况下，会根据当前系统的 CPU 内核数量来决定线程池的大小。


# 并行
def test_parallel():
    start_time = time.time()
    results = []
    # max_workers = len(tasks)
    with ThreadPoolExecutor() as executor:
        # 注意：as_completed() 方法会在每个 Future 有结果就返回，而不是按照它们被提交到线程池的顺序
        #      executor.map()：按照任务提交的顺序获取结果，但它不会立即返回结果，而是等到所有任务完成后一次性返回一个生成器。
        futures = []
        for index, task in enumerate(tasks):
            future = executor.submit(deal_task, task, delay=task)
            futures.append(future)

        for index, future in enumerate(futures):
            try:
                data = future.result()
                results.append(data)
            except Exception as exc:
                print("异常", exc)

        # for future in as_completed(futures):
        #     try:
        #         data = future.result()
        #         results.append(data)
        #     except Exception as exc:
        #         print("异常", exc)
    # 记录结束时间
    end_time = time.time()
    execution_time = end_time - start_time
    print(f"并行耗时: {execution_time:.2f} seconds")
    print(results)
    return results


# 队列中的数据如何并行：生产者消费者

def producer(q):
    for i in range(20):
        q.put(i)
        time.sleep(0.1)  # 模拟生产时间

def consumer(q, batch_size):
    while True:
        batch = []
        while len(batch) < batch_size:
            try:
                item = q.get(timeout=1)  # 尝试获取数据，超时为 1 秒
                batch.append(item)
                q.task_done()
            except queue.Empty:
                break
        
        if batch:
            print(f"Processing batch: {batch}")
            # 模拟处理时间
            time.sleep(1)
        else:
            break  # 如果队列为空，退出循环


def test_parallel_queue():
    # 初始化队列
    q = queue.Queue()

    batch_size = 5
    # 启动生产者和消费者线程
    producer_thread = Thread(target=producer, args=(q,))
    consumer_thread = Thread(target=consumer, args=(q, batch_size))

    producer_thread.start()
    consumer_thread.start()

    # 等待线程完成
    producer_thread.join()
    consumer_thread.join()


if __name__ == "__main__":
    # test_serial()
    test_parallel()
