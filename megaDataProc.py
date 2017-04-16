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

'''
overview schema

NPV->sum, avg, median
building cost -> sum.avg.median
for everybody (no filtering)
as well as those same attributes for those on the zayo network
and those accounts that are opportunities (a subset)


row-> market

NPVSum, NPVavg, NPVmedian,

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

#incrementors for map indices
denIndex, atlIndex, dalIndex = 0,0,0

#map lists
denOut, atlOut, dalOut = [], [], []

#overview lists in dicts
overview = {'DenverProf': [], 'AtlantaProf': [], 'DallasProf': [], 'DenverBuild': [], 'DallasBuild': [], 'AtlantaBuild': []}

#overview on net
onNet = {'DenverProf': [], 'AtlantaProf': [], 'DallasProf': [], 'DenverBuild': [], 'DallasBuild': [], 'AtlantaBuild': []}

#overview if opportunity
opportunity = {'DenverProf': [], 'AtlantaProf': [], 'DallasProf': [], 'DenverBuild': [], 'DallasBuild': [], 'AtlantaBuild': []}


with open('zayofull.csv', newline='') as csvfile:
    reader = csv.reader(csvfile, delimiter=',')
    for row in reader:


        #map and overview data gathering
        if (numCheck(row[30]) and row[25] != 'Active'):
            rowNum += 1


            if ((row[12] == 'Denver') or (row[13] == 'Denver')):

                #map
                streetAddr = row[26] + ' ' + row[4] + ' ' +  row[24] + ' ' + row[20]
                denOut.append([denIndex, row[10], row[11], row[5], row[30], row[7], row[21], row[29], row[18], row[8], row[9], streetAddr])
                denIndex += 1

                #overview
                overview['DenverProf'].append(toFloat(row[30]))
                overview['DenverBuild'].append(toFloat(row[5]))

                if (row[17] == 'On Zayo Network'):
                    onNet['DenverProf'].append(toFloat(row[30]))
                    onNet['DenverBuild'].append(toFloat(row[5]))

                if (row[19] != 'null'):
                    opportunity['DenverProf'].append(toFloat(row[30]))
                    opportunity['DenverBuild'].append(toFloat(row[5]))



            if ((row[12] == 'Atlanta') or (row[13] == 'Atlanta')):

                streetAddr = row[26] + ' ' + row[4] + ' ' +  row[24] + ' ' + row[20]
                atlOut.append([atlIndex, row[10], row[11], row[5], row[30], row[7], row[21], row[29], row[18], row[8], row[9], streetAddr])
                atlIndex += 1

                overview['AtlantaProf'].append(toFloat(row[30]))
                overview['AtlantaBuild'].append(toFloat(row[5]))

                if (row[17] == 'On Zayo Network'):
                    onNet['AtlantaProf'].append(toFloat(row[30]))
                    onNet['AtlantaBuild'].append(toFloat(row[5]))

                if (row[19] != 'null'):
                    opportunity['AtlantaProf'].append(toFloat(row[30]))
                    opportunity['AtlantaBuild'].append(toFloat(row[5]))


            if ((row[12] == 'Dallas') or (row[13] == 'Dallas')):

                streetAddr = row[26] + ' ' + row[4] + ' ' +  row[24] + ' ' + row[20]
                dalOut.append([dalIndex, row[10], row[11], row[5], row[30], row[7], row[21], row[29], row[18], row[8], row[9], streetAddr])
                dalIndex += 1

                overview['DallasProf'].append(toFloat(row[30]))
                overview['DallasBuild'].append(toFloat(row[5]))

                if (row[17] == 'On Zayo Network'):
                    onNet['DallasProf'].append(toFloat(row[30]))
                    onNet['DallasBuild'].append(toFloat(row[5]))

                if (row[19] != 'null'):
                    opportunity['DallasProf'].append(toFloat(row[30]))
                    opportunity['DallasBuild'].append(toFloat(row[5]))




#MAP FILES OUT


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


#OVERVIEW FILES OUT

overViewCol = ['Market', 'NPVSum', 'NPVmean', 'NPVmedian', 'costSum', 'costMean', 'costMedian']

'''
#overview lists in dicts
overview = {'DenverProf': [], 'AtlantaProf': [], 'DallasProf': [], 'DenverBuild': [], 'DallasBuild': [], 'AtlantaBuild': []}

#overview on net
onNet = {'DenverProf': [], 'AtlantaProf': [], 'DallasProf': [], 'DenverBuild': [], 'DallasBuild': [], 'AtlantaBuild': []}

#overview if opportunity
opportunity = {'DenverProf': [], 'AtlantaProf': [], 'DallasProf': [], 'DenverBuild': [], 'DallasBuild': [], 'AtlantaBuild': []}


'''


#main overview out
Denver = ['Denver', sum(overview['DenverProf']), stats.mean(overview['DenverProf']), stats.median(overview['DenverProf']), sum(overview['DenverBuild']), stats.mean(overview['DenverBuild']), stats.median(overview['DenverBuild'])]


Atlanta = ['Atlanta', sum(overview['AtlantaProf']), stats.mean(overview['AtlantaProf']), stats.median(overview['AtlantaProf']), sum(overview['AtlantaBuild']), stats.mean(overview['AtlantaBuild']), stats.median(overview['AtlantaBuild'])]


Dallas = ['Dallas', sum(overview['DallasProf']), stats.mean(overview['DallasProf']), stats.median(overview['DallasProf']), sum(overview['DallasBuild']), stats.mean(overview['DallasBuild']), stats.median(overview['DallasBuild'])]


outOverview = [Denver, Dallas, Atlanta]


for i in range(0, len(outOverview)):
    for j in range(0, len(outOverview[i])):
        if isinstance(outOverview[i][j], float):
            outOverview[i][j] = round(outOverview[i][j])



with open('overviewData.csv', 'w') as out:
    writer = csv.writer(out)

    writer.writerow(overViewCol)

    for row in outOverview:
        writer.writerow(row)

out.close()


#onNetOut

Denver = ['Denver', sum(onNet['DenverProf']), stats.mean(onNet['DenverProf']), stats.median(onNet['DenverProf']), sum(onNet['DenverBuild']), stats.mean(onNet['DenverBuild']), stats.median(onNet['DenverBuild'])]


Atlanta = ['Atlanta', sum(onNet['AtlantaProf']), stats.mean(onNet['AtlantaProf']), stats.median(onNet['AtlantaProf']), sum(onNet['AtlantaBuild']), stats.mean(onNet['AtlantaBuild']), stats.median(onNet['AtlantaBuild'])]


Dallas = ['Dallas', sum(onNet['DallasProf']), stats.mean(onNet['DallasProf']), stats.median(onNet['DallasProf']), sum(onNet['DallasBuild']), stats.mean(onNet['DallasBuild']), stats.median(onNet['DallasBuild'])]


outOnNet = [Denver, Dallas, Atlanta]


for i in range(0, len(outOnNet)):
    for j in range(0, len(outOnNet[i])):
        if isinstance(outOnNet[i][j], float):
            outOnNet[i][j] = round(outOnNet[i][j])



with open('onNetData.csv', 'w') as out:
    writer = csv.writer(out)

    writer.writerow(overViewCol)

    for row in outOnNet:
        writer.writerow(row)

out.close()



print('done!')
