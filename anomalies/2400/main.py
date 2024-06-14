import apsw 
from os import listdir
import json 
import pandas as pd

def getData(fileName:str) -> list:
    with apsw.Connection(f"2400/logs/{fileName}") as db:
        cursor = db.cursor()
        cursor.execute('SELECT * FROM Frames;')
        frames = cursor.fetchall()
        log_data = []
        for frame in frames:
            log_data.append({
                "freq_arr": json.loads(frame[1])
            })
        for index, _ in enumerate(log_data):    
            log_data[index] = log_data[index]["freq_arr"]
        return log_data
    
def getWidth(data:list, critLevel:int) -> list:
    result = []
    for line in data:
        counter = 0
        for l in line:
            if l >= critLevel: counter += 1
        result.append(counter)

    summ = 0
    for item in result:
        summ += item 
    return summ/len(result)

def writeXLS(data:list) -> None:
    maxHeight = 0 
    for item in data:
        if len(item["data"]) > maxHeight: maxHeight = len(item["data"])
    resultArray = [[] for i in range(maxHeight)]
    resultArray.insert(0, [])
    for item in data:
        resultArray[0].append(item["file"])
        resultArray[0].append("")
        resultArray[0].append("")
        resultArray[0].append("")
        
    for index in range(1, len(resultArray)):
        resultArray[index] = ["" for i in range(len(data)*4)]
        
    for item in data:
        startIndex = resultArray[0].index(item["file"])
        for index, value in enumerate(item["data"]):
            for levelIndex, _ in enumerate(value):
                resultArray[index+1][startIndex+levelIndex] = value[levelIndex]

    df = pd.DataFrame(resultArray)
    df.to_excel(excel_writer = "wi-fi.xlsx")

def getLevels(dirName:str) -> None:
    resultData = []
    for file in listdir(f"2400/{dirName}"):
        try:
            logData = getData(file)
            fileData = []
            for block in range(0, len(logData), 5):
                levelArr = []
                for critLevel in [2, 5, 10]:
                    levelData = getWidth(logData[block:block+5], critLevel)
                    levelArr.append(levelData)
                fileData.append(levelArr)
            resultData.append({"file": file, "data": fileData})
        except: pass
    writeXLS(resultData)


if __name__ == "__main__":
    getLevels("logs")