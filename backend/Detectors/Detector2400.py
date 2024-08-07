HAND_CONTROL_RANGE = [5, 12] # нужно исправить
WI_FI_CONTROL_RANGE = [13, 15]
WI_FI_DOWNLOAD_RANGE = [18, 25]
WI_FI_UPLOAD_RANGE = [30, 85]
RANGES = [HAND_CONTROL_RANGE, WI_FI_CONTROL_RANGE, WI_FI_DOWNLOAD_RANGE, WI_FI_UPLOAD_RANGE]

def getHills(freq_arr:list, crit_level):
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

def getWidth(freqArr:list, critLevel:int) -> int:
    counter = 0
    for d in freqArr:
        if d >= critLevel: counter += 1
    return counter   

def isIn(target:int, range:list) -> bool:
    if range[0] <= target <= range[1]: return True 
    else: return False

# 0 - unknown
# 1 - hand-control
# 2 - wi-fi control
# 3 - wi-fi download
# 4 - wi-fi upload
def autoAnalize(freqArr:list) -> int:
        hillArr = []
        for critLevel in [5, 10, 15]:
            hills = getHills(freqArr, critLevel)
            for h in hills:
                hillArr.append({
                    "critLevel": critLevel,
                    "hill": h
                })
        targetHills = []
        for h1 in hillArr:
            counter = 0
            hillArr.pop(0)
            for h2 in hillArr:
                if h1["critLevel"] != h2["critLevel"]: 
                    centerH1 = (h1["hill"][1] + h1["hill"][0])/2
                    centerH2 = (h2["hill"][1] + h2["hill"][0])/2
                    if (centerH2 - 3) <= centerH1 <= (centerH2 + 3): counter += 1
            if counter == 2:
                targetHills.append(h1["hill"])

        for th in targetHills:
            length = th[1] - th[0]
            # print(length)
            for index, r in enumerate(RANGES): 
                if isIn(length, r): return index+1
        return 0

# 0 - undefined
# 1 - warning
# 2 - safe
class Detector():
    def __init__(self):
        self.counter = 0
        self.screens = []
        self.screen_count = 0

    def baseRules(self, hill_arr, freq_arr) -> list:
        result_arr = []
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
        return result_arr

    def analize(self, crit_level, freq_arr):
        hill_arr = getHills(freq_arr, crit_level)
        self.screen_count += 1
        temp_results = None
        if self.screen_count == 10:
            temp_results = analizeTemp(self.screens)
            self.screen_count = 0
            self.screens = []        
        baseResult = self.baseRules(hill_arr, freq_arr)

        return {
            "type": 2 if len(baseResult)==0 else 1,
            "targets": baseResult,
            "temp_results": temp_results,
            "anom_type": autoAnalize(freq_arr)
        }