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

def getHills(freq_arr, crit_level):
    hill_arr = []
    range_start = 0
    range_end = 0
    for i in range(len(freq_arr)-1):
        cur_freq = freq_arr[i]
        next_freq = freq_arr[i+1]
        if cur_freq <= crit_level and next_freq > crit_level:
            range_start = i+1
        if cur_freq > crit_level and next_freq <= crit_level:
            range_end = i
            hill_arr.append([range_start, range_end])
            range_start = 0
            range_end = 0
    return hill_arr

def getAvHeight(arr, start, end):
    sum = 0
    for i in range(start, end):
        sum += arr[i]
    
    return sum/(end-start) if ((end-start)>0) else 0

def analizeTemp(arr):
    result = []
    result_arr = []
    for i in range(len(arr)):
        cur_shot = arr[i]
        shot_counter = 0
        for item in arr:
            target_len = cur_shot["end"] - cur_shot["start"]
            screen_len = item["end"] - item["start"]
            target_height = cur_shot["height"]
            screen_height = item["height"]
            if ((target_len - 2) <= screen_len <= (target_len + 2) and ((target_height - 5) <= screen_height <= (target_height + 5))):
                shot_counter += 1 
                    
        if  shot_counter/len(arr) >= 0.8:
            result.append([cur_shot["start"], cur_shot["end"]])   
    
    for item in result:
        if item not in result_arr:
            result_arr.append(item)
    return result_arr

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

#1 - UAV hand control
#2 - UAV wi-fi control
#3 - Wi-Fi router
def getLevelAnalize(freqArr:list) -> int:
    widthArr = []
    for level in [2, 5, 10]:
        widthArr.append(getWidth(freqArr, level))
    percent5From2 = widthArr[1]/widthArr[0]*100
    percent10From2 = widthArr[2]/widthArr[0]*100
    # print(percent5From2, percent10From2)
    return {
        "classifyResult_5from2": predictAnomalies(percent5From2, RANGES_5FROM2, CENTERS_5FROM2),
        "classifyResult_10from2": predictAnomalies(percent10From2, RANGES_10FROM2, CENTERS_10FROM2)
    }
    
# 0 - undefined
# 1 - warning
# 2 - safe
class Detector():
    def __init__(self):
        self.counter = 0
        self.screens = []
        self.screen_count = 0

    def analize(self, crit_level, freq_arr):
        result_arr = []
        hill_arr = getHills(freq_arr, crit_level)
        self.screen_count += 1
        temp_results = None
        if self.screen_count == 10:
            temp_results = analizeTemp(self.screens)
            self.screen_count = 0
            self.screens = []

        #base detector
        for hill in hill_arr:
            start = hill[0]
            end = hill[1]
            if 3 < (end - start) < 13:
                result_arr.append([start, end])
                self.screens.append({
                    "start": start, 
                    "end": end,
                    "height": getAvHeight(freq_arr, start, end)
                })
            elif (end - start) < 23:
                counter = 0
                for i in range(start, end):
                    if freq_arr[i] > 30:
                        counter += 1
                if (end - start) > 0 and (counter/(end - start) >= 0.8):
                    result_arr.append([start, end])
                    self.screens.append({
                        "start": start, 
                        "end": end,
                        "height": getAvHeight(freq_arr, start, end)
                    })
                
        return {
            "type": 2 if len(result_arr)==0 else 1,
            "targets": result_arr,
            "temp_results": temp_results,
            "anom_type": getLevelAnalize(freq_arr)
        }