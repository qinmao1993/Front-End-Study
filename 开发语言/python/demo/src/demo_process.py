from concurrent.futures import ProcessPoolExecutor, ThreadPoolExecutor, as_completed
import multiprocessing
import time

from module.test_module import FaceRecognition


# 模拟一个耗时的任务
def simulate_task(task_name):
    print(f"Starting {task_name}")
    time.sleep(1)  # 模拟耗时操作
    print(f"Finished {task_name}")
    return f"{task_name} result"


# 属于标准库 multiprocessing 模块的一部分。
# 适用于 Python 2 和 Python 3。
# 提供了多种方法来提交任务，如 apply, map, apply_async 等，可以简单地并行执行函数或方法。
def multiprocessingPool():
    tasks = ["Task 1", "Task 2", "Task 3", "Task 4", "Task 5"]
    # 创建一个进程池，可以指定最大的工作进程数量，默认是 os.cpu_count()
    with multiprocessing.Pool() as pool:
        # 使用map方法来将任务分发给进程池中的工作进程，按执行顺序返回
        results = pool.map(simulate_task, tasks)
    # 打印所有任务的结果
    for result in results:
        print(result)


# ProcessPoolExecutor
# 是对 multiprocessing.Pool 的更高级别抽象，提供了更为简洁的接口来管理进程池。
# 从 Python 3.2 开始引入，支持与其他执行器（如 ThreadPoolExecutor）相似的 API，使得代码更易于迁移和维护。
def processPoolExecutor():
    # 创建一个 ProcessPoolExecutor，可以指定进程池中的最大进程数
    with ProcessPoolExecutor(max_workers=3) as executor:
        # 提交多个任务给进程池
        future_to_task = {executor.submit(simulate_task, i): i for i in range(5)}

        # 使用 as_completed() 来迭代已完成的任务
        for future in as_completed(future_to_task):
            task_index = future_to_task[future]
            try:
                result = future.result()  # 获取任务的返回值
            except Exception as e:
                print(f"Task {task_index} generated an exception: {e}")
            else:
                print(result)  # 打印任务的结果


# 问题：多进程内，Class 多次初始化的问题


def handle_frame(frame):
    faceRecognition = FaceRecognition()
    return faceRecognition.deal_frame(frame)


def concurrent_process(frames):
    results = []
    max_workers = len(frames)
    with ProcessPoolExecutor(max_workers) as executor:
        # 提交多个任务给进程池
        futures = [executor.submit(handle_frame, frame) for frame in frames]
        for index, future in enumerate(futures):
            try:
                process_frame = future.result()  # 获取任务的返回值
                results.append(process_frame)
            except Exception as e:
                print(f"Task {index} generated an exception: {e}")
        return results

def concurrent_thread(frames):
    results = []
    max_workers = len(frames)
    with ThreadPoolExecutor(max_workers) as executor:
        # 提交多个任务给进程池
        futures = [executor.submit(handle_frame, frame) for frame in frames]
        for index, future in enumerate(futures):
            try:
                process_frame = future.result()  # 获取任务的返回值
                results.append(process_frame)
            except Exception as e:
                print(f"Task {index} generated an exception: {e}")
        return results
    

# 多进程处理的例子 2s
def test_parallel():
    start_time = time.time()
    frames = []
    max_workers = 2
    frame_index = 0
    while True:
        frames.append(frame_index)
        # print(f'数组长度{len(frames)},index:{frame_index}')
        if len(frames) == max_workers:
            process_frames = concurrent_thread(frames)
            for process_frame in process_frames:
                print(f"打标process_frame:{process_frame}")
            frames = []
        frame_index += 1
        if frame_index == 10:
            break

    # 记录结束时间
    end_time = time.time()
    execution_time = end_time - start_time
    print(f"{max_workers}线程，并行耗时: {execution_time} seconds")
    # print(f"{max_workers}进程，并行耗时: {execution_time} seconds")



# 串行 10s
def test_serial():
    start_time = time.time()
    frame_index = 0
    while True:
        process_frame = handle_frame(frame_index)
        print(f"打标process_frame:{process_frame}")
        frame_index += 1
        if frame_index == 10:
            break
    # 记录结束时间
    end_time = time.time()
    execution_time = end_time - start_time
    print(f"串行耗时: {execution_time} seconds")


if __name__ == "__main__":
    # processPoolExecutor()

    # multiprocessing.set_start_method("spawn")  # 设置启动方法为'spawn'
    test_parallel()
    # test_serial()
