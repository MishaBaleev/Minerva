import apsw
import json
from os import listdir

CENTERS_5FROM2 = [43.17368303, 59.55606945, 83.99677811]
RANGES_5FROM2 = [
    [23.22533548, 76.92892293],
    [14.88095238, 89.52122855],
    [78.5355116, 98.25306045]
]
CENTERS_10FROM2 = [25.85470844, 15.858277, 76.36046154]
RANGES_10FROM2 = [
    [12.15110633, 44.35394254],
    [1.734693878, 76.16050354],
    [61.56010404, 86.26145459]
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
        case [True, False, False]: return 1
        case [False, True, False]: return 2
        case [False, False, True]: return 3
    
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
                if r == 2: counter += 1
            print(f"Точность первой метрики - {counter/len(data)*100}%")  

            counter = 0
            for r in res2Array:
                if r == 2: counter += 1
            print(f"Точность второй метрики - {counter/len(data)*100}%")  
        except:
            pass