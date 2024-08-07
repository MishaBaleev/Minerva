import serial 
import json

class SerialReader5800Class():
    def __init__(self, int):
        self.int = int 
        self.session = None

    def createCon(self):
        self.session = serial.Serial(self.int, baudrate=230400)

    def parseData(self, data:dict) -> list:
        freq_arr = [0 for i in range(301)]
        data = data["freq"]
        for key in data.keys():
            freq_arr[int(key)-5645] = int(data[key])
        return freq_arr

    def getData(self):
        try:
            raw_data = self.session.readline().decode().replace("'", '"')
            if raw_data:
                try: return self.parseData(json.loads(raw_data))
                except: 
                    # print(error)
                    return None
            return None
                
        except ValueError as err:
            print(err)
