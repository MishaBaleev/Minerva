class Detector5800():
    def __init__(self):
        pass

    # 0 - undefined
    # 1 - warning
    # 2 - safe
    def analize(self, frame:list) -> dict:
        for f in frame:
            if f > 100: return {"type": 1}
        return {
            "type": 0
        }
