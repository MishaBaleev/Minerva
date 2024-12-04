import serial 
import json

class SerialReader5800Class():
    def __init__(self, int):
        self.int = int 
        self.session = None

    def createCon(self):
        self.session = serial.Serial(self.int, baudrate=230400)

    def parseData(self, data:dict) -> list:
        # freq_arr = [0 for i in range(51)]
        # data = data["freq"]
        # for key in data.keys():
        #     freq_arr[int(key)-5645] = int(data[key])
        # return freq_arr
        res_arr = [0 for _ in range(39)]
        base = ['5645', '5658', '5665', '5685', '5695', '5705', '5725', '5732', '5733', '5740', '5745', '5752', '5760', '5765', '5769', '5771', '5780', '5785', '5790', '5800', '5805', '5806', '5809', '5820', '5825', '5828', '5840', '5843', '5845', '5847', '5860', '5865', '5866', '5880', '5885', '5905', '5917', '5925', '5945']
        for _, value in enumerate(data["freq"].items()):
            res_arr[base.index(value[0])] = int(value[1])
        return res_arr

    def getData(self):
        raw_data = self.session.readline()
        print(raw_data)
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
