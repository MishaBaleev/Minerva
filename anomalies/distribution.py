import matplotlib.pyplot as plt 
from matplotlib.lines import Line2D
from matplotlib.patches import Circle

class mainPlt():
    def __init__(self) -> None:
        self.fig = plt.figure()
        self.ax = plt.axes(xlim=(0, 100), ylim=(0, 5))
        plt.xlabel("X-AXIS")
        plt.ylabel("Y-AXIS")

    def savePlot(self) -> None:
        centers1 = [43.17368303, 59.55606945, 83.99677811]
        ranges1 = [
            [23.22533548, 76.92892293],
            [14.88095238, 89.52122855],
            [78.5355116, 98.25306045]
        ]
        centers2 = [25.85470844, 15.858277, 76.36046154]
        ranges2 = [
            [12.15110633, 44.35394254],
            [1.734693878, 76.16050354],
            [61.56010404, 86.26145459]
        ]
        
        colors = ["red", "green", "blue"]
        # for index, r in enumerate(ranges1):
        #     lineAv = Line2D(r, [index+1, index+1], color=colors[index], lw=2)
        #     self.ax.add_line(lineAv)
        #     legend_handles = [Line2D([0], [0], color='red', lw=2), Line2D([0], [0], color='green', lw=2), Line2D([0], [0], color='blue', lw=2)]
        #     legend_labels = ['UAV_hand', 'UAV_wi-fi', 'wi-fi']
        #     center = Circle((centers1[index], index+1), 0.2, color=colors[index])
        #     self.ax.add_patch(center)
        #     plt.legend(legend_handles, legend_labels)
        #     plt.savefig("5from2.jpg")
        for index, r in enumerate(ranges2):
            lineAv = Line2D(r, [index+1, index+1], color=colors[index], lw=2)
            self.ax.add_line(lineAv)
            legend_handles = [Line2D([0], [0], color='red', lw=2), Line2D([0], [0], color='green', lw=2), Line2D([0], [0], color='blue', lw=2)]
            legend_labels = ['UAV_hand', 'UAV_wi-fi', 'wi-fi']
            center = Circle((centers2[index], index+1), 0.2, color=colors[index])
            self.ax.add_patch(center)
            plt.legend(legend_handles, legend_labels)
            plt.savefig("10from2.jpg")

def isIn(target:float, range:list) -> bool:
    if range[0] <= target <= range[1]: return True 
    else: return False

def getDistance(target:float, center:float) -> float:
    return abs(center - target)

def predict(percent:float, ranges, centers) -> str:
    #5from2
    isInArray = []
    for range in ranges:
        isInArray.append(isIn(percent, range))
    match isInArray:
        case [True, False, False]: return "UAV Hand"
        case [False, True, False]: return "UAV wi-fi"
        case [False, False, True]: return "wi-fi"
    
    minDist = 101
    names = ["UAV Hand", "UAV wi-fi", "wi-fi"]
    name = "Unknown"
    for index, range in enumerate(ranges):
        dist = getDistance(percent, centers[index]) if isInArray[index] else 101
        if dist < minDist: 
            minDist = dist
            name = names[index]
    return name

if __name__ == "__main__":
    #bad old values
    # centers1 = [43.17368303, 55.34602012, 68.34236264]
    # ranges1 = [
    #     [23.22533548, 76.92892293],
    #     [21.42857143, 81.48148148],
    #     [5, 97.82608696]
    # ]
    # centers2 = [25.85470844, 16.56609325, 55.08194843]
    # ranges2 = [
    #     [12.15110633, 44.35394254],
    #     [0, 64.51612903],
    #     [0, 97.6744186]
    # ]
    
    # classifyResult = predict(45, ranges1, centers1)
    # print(classifyResult)

    pltClass = mainPlt().savePlot()