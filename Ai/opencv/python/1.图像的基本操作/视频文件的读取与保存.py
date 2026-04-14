# 读取视频
from os import getcwd, path
import cv2


def read_video(data):
    stream_url = data["streamUrl"]
    camera_id = data["cameraIndexCode"]

    # 摄像头的 RTSP 地址
    # stream_url = "rtsp://username:password@ip_address:port/stream"
    # capture = cv2.VideoCapture(stream_url)

    capture = cv2.VideoCapture(0)

    # 根据硬件 设置分辨率（例如 1920x1080）
    # capture.set(cv2.CAP_PROP_FRAME_WIDTH, 1920)
    # capture.set(cv2.CAP_PROP_FRAME_HEIGHT, 1080)

    # # 设置帧率（例如 30 FPS）以控制每秒捕捉的图像数量。帧率的设置可以影响视频的流畅度和处理的负担。
    # capture.set(cv2.CAP_PROP_FPS, 30)
    # # 开启自动对焦（如果支持）
    # capture.set(cv2.CAP_PROP_AUTOFOCUS, 1)  # 1 表示开启自动对焦
    # # 开启自动白平衡（如果支持）
    # capture.set(cv2.CAP_PROP_AUTO_WB, 1)  # 1 表示开启自动白平衡

    # video_url = path.join(getcwd(), "input/video/t2.mp4")
    # capture = cv2.VideoCapture(video_url)

    if not capture.isOpened():
        print("无法打开视频流")
        exit()
    fps = int(capture.get(cv2.CAP_PROP_FPS))
    frame_width = int(capture.get(cv2.CAP_PROP_FRAME_WIDTH))
    frame_height = int(capture.get(cv2.CAP_PROP_FRAME_HEIGHT))
    print("fps:", fps, "width:", frame_width, "height:", frame_height)

    # 定义视频编解码器和输出文件
    fourcc = cv2.VideoWriter_fourcc(*"XVID")  # 或 'MJPG', 'MP4V' 等
    save_video_path = path.join(getcwd(), "public/dest/video/output.avi")
    out = cv2.VideoWriter(save_video_path, fourcc, 25, (frame_width, frame_height))

    skip = 20
    frame_index = 0
    while True:
        ret, frame = capture.read()
        if not ret:
            break
        # 水平翻转画面:处理摄像头镜像
        # frame = cv2.flip(frame, 1)
        frame_index += 1

        # 调试用（全屏）
        # cv2.namedWindow("window_name", cv2.WINDOW_NORMAL)
        # cv2.setWindowProperty(
        #     "window_name", cv2.WND_PROP_FULLSCREEN, cv2.WINDOW_FULLSCREEN
        # )

        # 将帧写入输出视频文件
        out.write(frame)

        cv2.imshow("window_name", frame)
        if cv2.waitKey(1) & 0xFF == ord("q"):
            break

    # 释放资源
    capture.release()
    out.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    print("开始执行")

    data = {
        "streamUrl": "rtsp://50.105.1.50:554/openUrl/HM0YSs0",
        "cameraIndexCode": "1",
    }
    read_video(data)
