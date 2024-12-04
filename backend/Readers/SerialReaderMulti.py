import serial 
import json

class SerialReaderMultiClass():
    def __init__(self, int):
        self.int = int 
        self.session = None
        self.raw_data = []

    def createCon(self):
        self.session = serial.Serial(self.int, baudrate=230400)

    def parseData(self):
        arr915 = [0 for i in range(100)]
        arr2400 = [0 for i in range(82)]
        # for item in self.raw_data: print(item, "------------\n")
        try:
            json915 = json.loads(self.raw_data[1])
            for key in json915.keys():
                arr915[int(key)-820] = int(json915[key][0])
        except: print("bad frame 915")

        try:
            json2400 = json.loads(self.raw_data[3])
            channels_shift = {
                "Channel_1": 0,
                "Channel_2": 5,
                "Channel_3": 10,
                "Channel_4": 15,
                "Channel_5": 20,
                "Channel_6": 25,
                "Channel_7": 30,
                "Channel_8": 35,
                "Channel_9": 40,
                "Channel_10": 45,
                "Channel_11": 50,
                "Channel_12": 55,
                "Channel_13": 60,
            }
            for key in json2400.keys():
                for index, value in enumerate(json2400[key]):
                    target_index = index + channels_shift[key]
                    arr2400[target_index] = int(value)
        except: print("bad frame 2400")
        self.raw_data = []
        return arr915, arr2400
        

    def getData(self):
        raw_data = self.session.readline().decode().replace("'", '"')
        print(raw_data)
        if "Channel" in raw_data:
            self.raw_data.append(raw_data)
            arr915, arr2400 = self.parseData() 
            return {
                "arr915": arr915,
                "arr2400": arr2400
            }, str(raw_data).replace("\n", "").replace("\r", "")
        else:
            self.raw_data.append(raw_data)
            return None, str(raw_data).replace("\n", "").replace("\r", "")