import time

# 定义一个类，使用单例模式
class FaceRecognition:
    # 使用单例模式
    _instance = None

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super(FaceRecognition, cls).__new__(cls, *args, **kwargs)
        return cls._instance

    def __init__(
        self,
        gpu_id=0,
        face_db="face_db",
        threshold=1,
        det_thresh=0.50,
        det_size=(640, 640),
    ):
        if not hasattr(self, "initialized"):  # 确保初始化只进行一次
            print("FaceRecognition 初始化")
            self.initialized = True

            self.gpu_id = gpu_id
            self.face_db = face_db
            self.threshold = threshold
            self.det_thresh = det_thresh
            self.det_size = det_size


    def deal_frame(self, frame):
        time.sleep(1)  # 模拟耗时处理操作
        # print("执行", frame)
        return frame


if __name__ == "__main__":
    for i in range(5):
        face_recognitio = FaceRecognition()
        face_recognitio.deal_frame(i)
