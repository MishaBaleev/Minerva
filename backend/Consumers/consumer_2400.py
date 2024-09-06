from channels.generic.websocket import WebsocketConsumer
import json
from Readers.SerialReader import SerialReaderClass
from threading import Thread
from Detectors.Detector2400 import Detector
import time
import datetime
import os
import sqlite3

def normData(arr):
    result_arr = [0 for i in range(82)]
    max_value = max(arr)
    min_value = min(arr)
    for index, item in enumerate(arr):
        if (max_value-min_value) > 0:
            result_arr[index] = (item - min_value)/(max_value - min_value)
        else:
            result_arr[index] = 0
    return result_arr

class Consumer_2400(WebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.serial_reader = None
        self.thread = None
        self.detector = Detector()
        self.base_config = {
            "is_rec": False,
            "rec_arr": [],
            "note": [],
            "crit_level": 20,
            "is_detect_act": False
        }

    def stopRec(self, file_name):
        connection = sqlite3.connect(f"{os.getcwd().replace('backend', 'logs')}/{file_name}.db")
        cursor = connection.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS Frames (
            id INTEGER PRIMARY KEY,
            frame TEXT,
            norm_frame TEXT,
            time_point REAL,
            zone_state TEXT,
            crit_level INTEGER,
            note TEXT
            )
        ''')
        connection.commit()
        for item in self.base_config["rec_arr"]:
            cursor.execute('INSERT INTO Frames (frame, norm_frame, time_point, zone_state, crit_level, note) VALUES (?, ?, ?, ?, ?, ?)', 
                           (json.dumps(item["frame"]), json.dumps(item["norm_frame"]), item["time"], 
                            json.dumps(item["zone_state"]), item["crit_level"], json.dumps(item["note"])))
        connection.commit()
        connection.close()
        self.base_config["rec_arr"] = []

    def stableCon(self):
        while self.serial_reader != None:
            frame, raw_data = self.serial_reader.getData()
            if frame != None:
                zone_state = {
                    "type": 0,
                    "targets": [],
                    "temp_results": [],
                    "anom_type": 0
                }
                send_data = {
                    "frame": frame,
                    "norm_frame": normData(frame),
                    "time": time.time(),
                    "zone_state": self.detector.analize(self.base_config["crit_level"], frame) if self.base_config["is_detect_act"]==True else zone_state,
                    "raw_data": str(raw_data)
                }
                if self.base_config["is_rec"] == True:
                    rec_data = {
                       "frame": send_data["frame"],
                       "norm_frame": send_data["norm_frame"],
                        "time": send_data["time"],
                        "zone_state": send_data["zone_state"],
                        "crit_level": self.base_config["crit_level"],
                        "note": self.base_config["note"]
                    }
                    self.base_config["note"] = []
                    self.base_config["rec_arr"].append(rec_data)

                self.send(json.dumps(send_data))
            else:
                zone_state = {
                    "type": 0,
                    "targets": [],
                    "temp_results": [],
                    "anom_type": 0
                }
                send_data = {
                    "frame": [],
                    "norm_frame": [],
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
                case "start":
                    try: 
                        print(data["start_config"])
                        interface = data["start_config"]["int"]
                        self.base_config["crit_level"] = float(data["start_config"]["crit_level"])
                        self.base_config["is_detect_act"] = data["start_config"]["is_detect_act"]
                        self.serial_reader = SerialReaderClass(interface)
                        self.serial_reader.createCon()
                        self.thread = Thread(target=self.stableCon, args={})
                        self.thread.daemon = True 
                        self.thread.start()
                    except: 
                        self.send(json.dumps({"recieve": "Ошибка при подключении к порту"}))
                case "off":
                    self.serial_reader = None
                    self.thread.join()
                case  "change_detect":
                    self.base_config["is_detect_act"] = data["value"]
                case  "crit_level":
                    self.base_config["crit_level"] = float(data["value"])
                case  "act_rec":
                    self.base_config["is_rec"] = data["value"]
                    if data["value"] == False:
                        self.stopRec(data["file_name"])
                case  "add_note":
                    self.base_config["note"].append(data["value"])

    def disconnect(self, code):
        pass