import apsw
import json
from os import listdir

CENTERS_5FROM2 = [75.06358997, 65.94311475, 46.93330667, 66.7732988]
RANGES_5FROM2 = [
    [67.24137931, 77.55102041], #wi-fi download
    [66, 70.58823529], #wiw-fi upload
    [57.57575758, 66.66666666], #wi-fi control
    [55.71428571, 71.69811321] #hand-control
]
CENTERS_10FROM2 = [68.14632137, 63.66633242, 4.35890836, 56.75914416]
RANGES_10FROM2 = [
    [57.37704918, 75.51020408], #wi-fi download
    [50, 68.88888889], #wiw-fi upload
    [1.515151515, 5.714285714], #wi-fi control
    [54.09836066, 60.71428571] #hand-control
]

def isIn(target:float, range:list) -> bool:
    if range[0] <= target <= range[1]: return True 
    else: return False

def getDistance(target:float, center:float) -> float:
    return abs(center - target)

def predictAnomalies(percent:float, ranges, centers) -> int:
    isInArray = []
    for range in ranges:
        isInArray.append(isIn(percent, range))
    match isInArray:
        case [True, False, False, False]: return 1
        case [False, True, False, False]: return 2
        case [False, False, True, False]: return 3
        case [False, False, False, True]: return 4
        case [False, False, False, False]: return 5
    
    minDist = 101
    result = 0
    for index, range in enumerate(ranges):
        dist = getDistance(percent, centers[index]) if isInArray[index] else 101
        if dist < minDist: 
            minDist = dist
            result = index+1
    return result

def getWidth(freqArr:list, critLevel:int) -> int:
    counter = 0
    for d in freqArr:
        if d >= critLevel: counter += 1
    return counter

def getData(fileName:str) -> list:
    with apsw.Connection(f"./{fileName}") as db:
        cursor = db.cursor()
        cursor.execute('SELECT * FROM Frames;')
        frames = cursor.fetchall()
        freqData = []
        for frame in frames:
            freqData.append(json.loads(frame[1]))
        return freqData

if __name__ == "__main__":
    fileList = listdir("./testLogs")
    print(fileList)
    for file in fileList:
        try:
            data = getData(f"./testLogs/{file}")
            res1Array = []
            res2Array = []
            # data = data
            for d in data:
                widthArr = []
                for level in [2, 5, 10]:
                    widthArr.append(getWidth(d, level))
                percent5From2 = widthArr[1]/widthArr[0]*100
                percent10From2 = widthArr[2]/widthArr[0]*100
                result1 = predictAnomalies(percent5From2, RANGES_5FROM2, CENTERS_5FROM2)
                res1Array.append(result1)
                result2 = predictAnomalies(percent10From2, RANGES_10FROM2, CENTERS_10FROM2)
                res2Array.append(result2)
            
            counter = 0
            for r in res1Array:
                if r == 5: counter += 1
            print(f"Точность первой метрики - {counter/len(data)*100}%")  

            counter = 0
            for r in res2Array:
                if r == 5: counter += 1
            print(f"Точность второй метрики - {counter/len(data)*100}%")  
        except:
            pass