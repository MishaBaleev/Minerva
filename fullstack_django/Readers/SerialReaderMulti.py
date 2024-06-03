import serial 
import json

class SerialReaderMultiClass():
    def __init__(self, int):
        self.int = int 
        self.session = None
        self.counter = 0
        self.raw_data = []

    def createCon(self):
        self.session = serial.Serial(self.int, baudrate=230400)

    def parseData(self):
        arr915 = [0 for i in range(101)]
        arr2400 = [0 for i in range(82)]
        item915 = self.raw_data[0]
        if "freq0" in item915:
            for item in json.loads(item915)["value"]:
                index = list(item.keys())[0]
                arr915[int(index)-820] = int(item[index])
        
        chanShift = {
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
        formString2400 = "".join(self.raw_data[1:]).replace("\r\n", "")
        json2400 = json.loads(formString2400)
        for key in json2400.keys():
            for index, value in enumerate(json2400[key]):
                target_index = index + chanShift[key]
                arr2400[target_index] = int(value)

        self.counter = 0
        self.raw_data = []
        return arr915, arr2400
        

    def getData(self):
        try:
            raw_data = self.session.readline()
            raw_data = raw_data.decode()
            if raw_data and "Test" not in raw_data:
                self.raw_data.append(raw_data.replace("'", '"'))
                self.counter += 1
                if self.counter == 15:
                    arr915, arr2400 = self.parseData()
                    return {
                        "arr915": arr915,
                        "arr2400": arr2400
                    }
            return None
        except ValueError as err:
            print(err)