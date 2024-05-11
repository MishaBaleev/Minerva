
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
            "temp_results": temp_results
        }