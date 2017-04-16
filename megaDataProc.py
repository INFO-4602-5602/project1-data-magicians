import csv, sys, re, math
import statistics as stats

'''
0-Account ID,1-Account ID (Accounts),2-Building ID,3-Building ID (Buildings),4-City (Buildings),

5-Estimated Build Cost,6-Industry,7-Industry (Accounts),8-IsClosed,9-IsWon,10-Latitude,11-Longitude,

12-MarketDONT USE,13-Market (Buildings),14-Net Classification,15-Network Proximity,16-Network Proximity (Buildings),

17-On Zayo Network Status,18-On Zayo Network Status (Buildings),19-Opportunity Type,20-Postal Code (Buildings),

21-Product Group,22-Sheet,23-Site ID,24-State (Buildings),25-Status,26-Street Address,27-Street Address (Sites+),28-Table Name,
29-Type,30-X36 NPV List,,

'''

'''
new schema


name: uniqueID(created),Lat,Long,BuildCost,ProfitNPV,Industry,ProductGroup,BuildingType,NetStatus,isClosesd,isWon,StreetAddress

'''
markets = {}

def toFloat(curString):

    curString = curString.replace('$', '')

    curString = curString.replace(',', '')

    return float(curString)


#checks if a numeric field is blank by finding if there are any numbers
def numCheck(string):
    return (any(char.isdigit() for char in string))


print('processing data, please wait...')

rowNum = 0
denIndex, atlIndex, dalIndex = 0,0,0
denOut, atlOut, dalOut = [], [], []


with open('zayofull.csv', newline='') as csvfile:
    reader = csv.reader(csvfile, delimiter=',')
    for row in reader:
        if (numCheck(row[30]) and row[25] != 'Active'):
            rowNum += 1

            if ((row[12] == 'Denver') or (row[13] == 'Denver')):

                streetAddr = row[26] + ' ' + row[4] + ' ' +  row[24] + ' ' + row[20]
                denOut.append([denIndex, row[10], row[11], row[5], row[30], row[7], row[21], row[29], row[18], row[8], row[9], streetAddr])
                denIndex += 1

            if ((row[12] == 'Atlanta') or (row[13] == 'Atlanta')):

                streetAddr = row[26] + ' ' + row[4] + ' ' +  row[24] + ' ' + row[20]
                atlOut.append([atlIndex, row[10], row[11], row[5], row[30], row[7], row[21], row[29], row[18], row[8], row[9], streetAddr])
                atlIndex += 1


            if ((row[12] == 'Dallas') or (row[13] == 'Dallas')):

                streetAddr = row[26] + ' ' + row[4] + ' ' +  row[24] + ' ' + row[20]
                dalOut.append([dalIndex, row[10], row[11], row[5], row[30], row[7], row[21], row[29], row[18], row[8], row[9], streetAddr])
                dalIndex += 1






'''
#debug print statements
for i in range(100):
    print (atlOut[i])

for i in range(100):
    print (dalOut[i])


print('lengths')
print('dallas', len(dalOut))


print('denver', len(denOut))
print('atlanta', len(atlOut))


print(rowNum, len(dalOut) + len(denOut) + len(atlOut))
'''




#FILES OUT


uniColumns =  ['uniqueID','Lat','Long','BuildCost','ProfitNPV','Industry','ProductGroup','BuildingType','NetStatus','isClosesd','isWon','StreetAddress']



with open('denverMin.csv', 'w') as out:
    writer = csv.writer(out)

    writer.writerow(uniColumns)

    for row in denOut:
        writer.writerow(row)

out.close()



with open('atlantaMin.csv', 'w') as out:
    writer = csv.writer(out)

    writer.writerow(uniColumns)

    for row in atlOut:
        writer.writerow(row)

out.close()



with open('dallasMin.csv', 'w') as out:
    writer = csv.writer(out)

    writer.writerow(uniColumns)

    for row in dalOut:
        writer.writerow(row)

out.close()

print('done!')
