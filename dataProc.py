import csv, sys, re, math
import statistics as stats

#Market,averageProfit,medianProfit,sumProfit,averageBuildingCost,medianBuildingCost,sumBuildingCost,averageProximity,medianProximit,sumProximity

denProfit, atlProfit, dalProfit = [], [], []


#function only takes strings with numbers, ie does not handle blanks
#identifies dollar sign and comma only, and then converts to float

def toFloat(curString):

    curString = curString.replace('$', '')

    curString = curString.replace(',', '')

    return float(curString)


#checks if a numeric field is blank by finding if there are any numbers
def numCheck(string):
    return (any(char.isdigit() for char in string))


#read-in for PROFIT

'''
cpq rows
0       1           2            3             4             5             6             7            8       9            10    11     12
CPQ ID, Account ID, CreatedDate, ProductGroup, X36 MRC List, X36 NRR List, X36 NPV List, Building ID, Market, Street Addr, City, State, Postal Code

'''

with open('ZayoHackathonData_CPQs.csv', newline='') as csvfile:
    reader = csv.reader(csvfile, delimiter=',')
    for row in reader:
        if (row[8] == "Denver"):
             if (numCheck(row[6])): #if a number exists
                 denProfit.append(toFloat(row[6])) #add it to the appropriate list

        elif (row[8] == "Dallas"):
            if (numCheck(row[6])):
                 dalProfit.append(toFloat(row[6]))

        elif (row[8] == "Atlanta"):
            if (numCheck(row[6])):
                atlProfit.append(toFloat(row[6]))



#read-in for BUILDING COST

'''
buildings rows
0            1       2            3     4      5            6         7          8                       9                   10    11                 12
Building ID, Market, Street Addr, City, State, Postal Code, Latitude, Longitude, On Zayo Network Status, Net Classification, Type, Network Proximity, Estimated Build Cost

'''

denBldgCost, atlBldgCost, dalBldgCost = [], [], []

denProx, atlProx, dalProx = [], [], []

with open('ZayoHackathonData_Buildings.csv', newline='') as csvfile:
    reader = csv.reader(csvfile, delimiter=',')

    for row in reader:
        if (row[1] == "Denver"):
            if (numCheck(row[12])):
                denBldgCost.append(toFloat(row[12]))
            if (numCheck(row[11])):
                denProx.append(toFloat(row[11]))

        elif (row[1] == "Dallas"):
            if (numCheck(row[12])):
                dalBldgCost.append(toFloat(row[12]))
            if (numCheck(row[11])):
                dalProx.append(toFloat(row[11]))

        elif (row[1] == "Atlanta"):
            if (numCheck(row[12])):
                atlBldgCost.append(toFloat(row[12]))
            if (numCheck(row[11])):
                atlProx.append(toFloat(row[11]))





#DATA PREP
'''
outData rows

0      1             2            3         4                   5                  6               7                8              9
Market,averageProfit,medianProfit,sumProfit,averageBuildingCost,medianBuildingCost,sumBuildingCost,averageProximity,medianProximit,sumProximity

'''

columnLabels = ['Market', 'averageProfit', 'medianProfit', 'sumProfit', 'averageBuildingCost', 'medianBuildingCost', 'sumBuildingCost', 'averageProximity', 'medianProximit', 'sumProximity']

#currently hardcoded to the markets, so right now this code doesn't extend to n markets--not ideal but will revisit when we are more on our feet

Denver = ['Denver', stats.mean(denProfit), stats.median(denProfit), sum(denProfit), stats.mean(denBldgCost), stats.median(denBldgCost), sum(denBldgCost), stats.mean(denProx), stats.median(denProx), sum(denProx)]

Dallas = ['Dallas', stats.mean(dalProfit), stats.median(dalProfit), sum(dalProfit), stats.mean(dalBldgCost), stats.median(dalBldgCost), sum(dalBldgCost), stats.mean(dalProx), stats.median(dalProx), sum(dalProx)]

Atlanta = ['Atlanta', stats.mean(atlProfit), stats.median(atlProfit), sum(atlProfit), stats.mean(atlBldgCost), stats.median(atlBldgCost), sum(atlBldgCost), stats.mean(atlProx), stats.median(atlProx), sum(atlProx)]


outData = [Denver, Dallas, Atlanta]

print(outData)

for i in range(0, len(outData)):
    for j in range(0, len(outData[i])):
        if isinstance(outData[i][j], float):
            outData[i][j] = round(outData[i][j])


print(outData)




#DATA OUT

with open('overviewData.csv', 'w') as out:
    writer = csv.writer(out)

    writer.writerow(columnLabels)

    for row in outData:
        writer.writerow(row)

out.close()
