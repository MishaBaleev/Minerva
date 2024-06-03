import apsw
import json

def getData(fileName:str) -> list:
    with apsw.Connection(fileName) as db:
        cursor = db.cursor()
        cursor.execute('SELECT * FROM Frames;')
        frames = cursor.fetchall()
        log_data = []
        for frame in frames:
            log_data.append({
                "freq_arr": json.loads(frame[1])
            })
        for i in range(len(log_data)):log_data[i] = log_data[i]["freq_arr"]
    return log_data


if __name__ == "__main__":
    logData = getData("мавик_цпл_пульт.db")
    for item in logData:
        print(item)