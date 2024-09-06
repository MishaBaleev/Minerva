from channels.generic.websocket import WebsocketConsumer
import json
from Readers.SerialReader5800 import SerialReader5800Class
from threading import Thread
import time
import os
import sqlite3
from Detectors.Detector5800 import Detector5800

class Consumer_5800(WebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.con_state = False
        self.serial_reader = None
        self.thread = None
        self.base_config = {
            "is_rec": False,
            "rec_arr": [],
            "note": [],
            "is_detect_act": False
        }
        self.detector = Detector5800()
    
    def stopRec(self, file_name):
        connection = sqlite3.connect(f"{os.getcwd().replace('backend', 'logs')}/{file_name}.db")
        cursor = connection.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS Frames5800 (
            id INTEGER PRIMARY KEY,
            frame TEXT,
            time_point REAL,
            note TEXT,
            zone_state TEXT
            )
        ''')
        connection.commit()
        for item in self.base_config["rec_arr"]:
            cursor.execute('INSERT INTO Frames5800 (frame, time_point, note, zone_state) VALUES (?, ?, ?, ?)', 
                           (json.dumps(item["frame"]), item["time"], json.dumps(item["note"]), json.dumps(item["zone_state"])))
        connection.commit()
        connection.close()
        self.base_config["rec_arr"] = []
    
    def stableCon(self):
        while self.serial_reader != None:
            frame, raw_data = self.serial_reader.getData()
            if frame != None:
                zone_state = {
                    "type": 0
                }
                send_data = {
                    "frame": frame,
                    "time": time.time(),
                    "zone_state": self.detector.analize(frame) if self.base_config["is_detect_act"]==True else zone_state,
                    "raw_data": str(raw_data)
                }
                if self.base_config["is_rec"] == True:
                    rec_data = {
                        "frame": send_data["frame"],
                        "time": send_data["time"],
                        "note": self.base_config["note"],
                        "zone_state": send_data["zone_state"]
                    }
                    self.base_config["note"] = []
                    self.base_config["rec_arr"].append(rec_data)

                self.send(json.dumps(send_data))
            else:
                zone_state = {
                    "type": 0
                }
                send_data = {
                    "frame": [],
                    "time": time.time(),
                    "zone_state": zone_state,
                    "raw_data": str(raw_data)
                }
                self.send(json.dumps(send_data))

    def connect(self):
        self.accept()

    def receive(self, text_data):
        data = json.loads(text_data)
        command = data["command"]
        match command:
            case  "start":
                try: 
                    print(data["start_config"])
                    interface = data["start_config"]["int"]
                    self.base_config["is_detect_act"] = data["start_config"]["is_detect_act"]
                    self.serial_reader = SerialReader5800Class(interface)
                    self.serial_reader.createCon()
                    self.thread = Thread(target=self.stableCon, args={})
                    self.thread.daemon = True 
                    self.thread.start()
                except:
                    self.send(json.dumps({"recieve": "Ошибка при подключении к порту"}))
            case  "off":
                self.serial_reader = None
                self.thread.join()
            case  "change_detect":
                self.base_config["is_detect_act"] = data["value"]
            case  "act_rec":
                self.base_config["is_rec"] = data["value"]
                if data["value"] == False:
                    self.stopRec(data["file_name"])
            case  "add_note":
                self.base_config["note"].append(data["value"])
            

    def disconnect(self, code):
        pass