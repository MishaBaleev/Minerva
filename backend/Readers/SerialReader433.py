import serial 
import json

class SerialReader433Class():
    def __init__(self, int):
        self.int = int 
        self.session = None
        self.counter = 0
        self.freq_arr = [0 for i in range(101)]
        self.raw_data = []

    def createCon(self):
        self.session = serial.Serial(self.int, baudrate=230400)

    def parseData(self):
        for d in self.raw_data:
            for f in d["value"]:
                freq_index = list(f.keys())[0]
                self.freq_arr[int(freq_index)-820] = int(f[freq_index])

    def getData(self):
        raw_data = self.session.readline().decode()
        try:
            if raw_data:
                data = json.loads(raw_data.replace("'", '"'))
                self.raw_data.append(data)
                if int(data["freq"][:-3]) == 901:
                    self.parseData()
                    result = self.freq_arr
                    self.freq_arr = [0 for i in range(101)]
                    self.raw_data = []
                    return result, str(raw_data).replace("\n", "").replace("\r", "")
                else:
                    return None, str(raw_data).replace("\n", "").replace("\r", "")
            else: 
                return None, str(raw_data).replace("\n", "").replace("\r", "")    
        except:
            return None, str(raw_data).replace("\n", "").replace("\r", "") 

