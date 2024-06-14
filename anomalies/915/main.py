import apsw 
from os import listdir
import json 
import pandas as pd

def getData(fileName:str) -> list:
    with apsw.Connection(f"915/logs/{fileName}") as db:
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
    
def getCoverageAverage(data:list) -> list:
    coverageArr = []
    avArr = []
    for item in data:
        coverage = 0
        summ = 0
        for freq in item[81:]:
            if freq > 0: 
                coverage += 1
                summ += freq
        coverageArr.append(coverage/20*100)
        if coverage == 0: avArr.append(0)
        else: avArr.append(summ/coverage)
    return coverageArr, avArr

def writeXLS(data:list) -> None:
    maxHeight = 0 
    for item in data:
        if len(item["cover"]) > maxHeight: maxHeight = len(item["cover"])
    resultArray = [[] for i in range(maxHeight)]
    resultArray.insert(0, [])
    for item in data:
        resultArray[0].append(item["file"])
        resultArray[0].append("")
        resultArray[0].append("")
    
    resultArray.insert(1, [])
    for item in data:
        resultArray[1].append("cover")
        resultArray[1].append("average")
        resultArray[1].append("")
        
    for index in range(2, len(resultArray)):
        resultArray[index] = ["" for i in range(len(data)*3)]
        
    for item in data:
        startIndex = resultArray[0].index(item["file"])
        for index, value in enumerate(item["cover"]):
            resultArray[index+2][startIndex] = value
        for index, value_ in enumerate(item["av"]):
            resultArray[index+2][startIndex+1] = value_
            # for levelIndex, _ in enumerate(value):
            #     resultArray[index+1][startIndex+levelIndex] = value[levelIndex]

    df = pd.DataFrame(resultArray)
    df.to_excel(excel_writer = "915Summary2.xlsx", index=False)
        
    
def getActivity(dirName:str) -> None:
    data915 = []
    for file in listdir(f"915/{dirName}"):
        if file != ".DS_Store":
            try:
                logData = getData(file)
                coverage, av = getCoverageAverage(logData)
                data915.append({
                    "file": file,
                    "cover": coverage,
                    "av": av
                })
            except ValueError as err: print(err)
    writeXLS(data915)
    
if __name__ == "__main__":
    getActivity("logs")