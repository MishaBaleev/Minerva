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
        raw_data = self.session.readline()
        try:
            line_data = raw_data.decode().replace("'", '"')
            if line_data:
                try: 
                    return self.parseData(json.loads(line_data)), str(raw_data).replace("\n", "").replace("\r", "")
                except: 
                    return None, str(raw_data).replace("\n", "").replace("\r", "")
            return None, str(raw_data).replace("\n", "").replace("\r", "")    
        except ValueError as err:
            return None, str(raw_data).replace("\n", "").replace("\r", "")
