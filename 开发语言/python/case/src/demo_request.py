# 常用的三方请求库  pip install requests aiohttp
import json
import time
import requests
import asyncio
import aiohttp

from concurrent.futures import ThreadPoolExecutor, as_completed


# get
def req_get(url):
    # response = requests.get(url)
    # print(response.status_code)
    # print(response.json())
    # await asyncio.sleep(1)
    time.sleep(1)
    return url


# post
def req_post():
    data = {"key1": "value1", "key2": "value2"}
    headers = {"User-Agent": "Mozilla/5.0"}
    response = requests.post(
        "https://api.example.com/post",
        json=data,
        headers=headers,
    )
    print(response.json())


# 处理异常
def req_err():
    try:
        response = requests.get("https://api.example.com")
        response.raise_for_status()  # 如果请求不成功会抛出异常
    except requests.exceptions.HTTPError as err:
        print(f"HTTP error occurred: {err}")
    except requests.exceptions.RequestException as err:
        print(f"Request failed: {err}")


# aiohttp get
async def aiohttp_get():
    url = "https://jsonplaceholder.typicode.com/posts"
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            response_data = await response.json()
            print(response_data)


# aiohttp post
async def aiohttp_post():
    url = "https://jsonplaceholder.typicode.com/posts"
    payload = {"title": "foo", "body": "bar", "userId": 1}
    headers = {'Content-Type': 'application/json'}
    async with aiohttp.ClientSession() as session:
        async with session.post(url, headers=headers, data=json.dumps(payload)) as response:
            response_data = await response.json()
            print(response_data)

            # 调用
            # 注意：多次运行 asyncio.run()： 在同一个程序中多次调用 asyncio.run() 可能会导致此 Event loop is closed"
            # 
            # asyncio.run(aiohttp_post())
            


# 线程池的并发请求：适合 I/O 密集型任务
def concurrent_thread():
    urls = ["http://url1.com", "http://url2.com", "http://url3.com"]
    max_workers = len(urls)
    with ThreadPoolExecutor(max_workers) as executor:
        futures = [executor.submit(req_get, url) for url in urls]
        # for future in as_completed(futures):
        for future in futures:
            try:
                result = future.result()
                print(result)  # 处理每个请求的结果
            except Exception as e:
                print(f"Exception: {e}")


# 异步并发请求适用情况：高性能要求，CPU 密集型任务
# 结合 async 和 await 关键字可以更好地利用多核 CPU 的能力，因为它避免了线程切换时的开销
async def fetch_url(url):
    # async with global_session.get(url) as response:
    #     return await response.json()

    # asyncio.sleep(1) 是异步的，不会阻塞事件循环，而是让出执行权给其他任务。
    # time.sleep(1) 是同步的，会阻塞当前线程的执行，直到休眠时间结束。

    await asyncio.sleep(1)
    name = "秦茂"
    similar = 90
    idNumber = "341182199306224817"
    return {
        "name": name,
        "similar": similar,
        "faceUrl": "",
        "idNumber": idNumber,
    }


# 异步并发请求:执行时间:1.0013749599456787
async def concurrent_asyncio():
    urls = [
        "https://api.example.com/endpoint1",
        "https://api.example.com/endpoint2",
        "https://api.example.com/endpoint3",
        "https://api.example.com/endpoint3",
    ]
    tasks = [fetch_url(url) for url in urls]
    results = await asyncio.gather(*tasks)
    print("results:", results)
    return results


# 串行执行：执行时间:4.014953851699829
def testSerial():
    results = []
    urls = [
        "https://api.example.com/endpoint1",
        "https://api.example.com/endpoint2",
        "https://api.example.com/endpoint3"
    ]
    for url in urls:
        result = req_get(url)
        results.append(result)
    print("results:", results)
    return results


if __name__ == "__main__":
    start_time = time.time()
    # 只能调用一次 asyncio.run()
    # asyncio.run(concurrent_asyncio())
    # asyncio.run(testSerial())
    concurrent_thread()
    # testSerial()

    end_time = time.time()

    print(f"执行时间:{end_time-start_time}")
