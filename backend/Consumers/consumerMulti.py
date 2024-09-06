from channels.generic.websocket import WebsocketConsumer
import json
from Readers.SerialReaderMulti import SerialReaderMultiClass
from threading import Thread
import time
import os
import sqlite3

class Consumer_Multi(WebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.con_state = False
        self.serial_reader = None
        self.thread = None
        self.base_config = {
            "is_rec": False,
            "rec_arr": [],
            "note": [],
        }
        self.last_frame = {
            "arr915": [],
            "arr2400": []
        }
    
    def stopRec(self, file_name):
        connection = sqlite3.connect(f"{os.getcwd().replace('backend', 'logs')}/{file_name}.db")
        cursor = connection.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS FramesMulti (
            id INTEGER PRIMARY KEY,
            frame TEXT,
            time_point REAL,
            note TEXT
            )
        ''')
        connection.commit()
        for item in self.base_config["rec_arr"]:
            cursor.execute('INSERT INTO FramesMulti (frame, time_point, note) VALUES (?, ?, ?)', 
                           (json.dumps(item["frame"]), item["time"], json.dumps(item["note"])))
        connection.commit()
        connection.close()
        self.base_config["rec_arr"] = []
    
    def stableCon(self):
        while self.serial_reader != None:
            frame, raw_data = self.serial_reader.getData()
            if frame != None:
                send_data = {
                    "frame": frame,
                    "time": time.time(),
                    "raw_data": raw_data
                }
                if self.base_config["is_rec"] == True:
                    rec_data = {
                        "frame": send_data["frame"],
                        "time": send_data["time"],
                        "note": self.base_config["note"]
                    }
                    self.base_config["note"] = []
                    self.base_config["rec_arr"].append(rec_data)
                self.last_frame = frame
                self.send(json.dumps(send_data))
            else:
                frame = self.last_frame
                send_data = {
                    "frame": frame,
                    "time": time.time(),
                    "raw_data": raw_data
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
                    self.serial_reader = SerialReaderMultiClass(interface)
                    self.serial_reader.createCon()
                    self.thread = Thread(target=self.stableCon, args={})
                    self.thread.daemon = True 
                    self.thread.start()
                except:
                    self.send(json.dumps({"recieve": "Ошибка при подключении к порту"}))
            case  "off":
                self.serial_reader = None
                self.thread.join()
            case  "act_rec":
                self.base_config["is_rec"] = data["value"]
                if data["value"] == False:
                    self.stopRec(data["file_name"])
            case  "add_note":
                self.base_config["note"].append(data["value"])
            

    def disconnect(self, code):
        pass