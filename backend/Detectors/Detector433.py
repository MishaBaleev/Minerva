class Detector433():
    def __init__(self):
        pass

    # 0 - undefined
    # 1 - warning
    # 2 - safe
    def analize(self, frame):
        for f in frame:
            if f > 25:
                return {
                    "type": 1
                }
        return {
            "type": 2
        }