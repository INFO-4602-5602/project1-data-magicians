import csv, sys

import sqlite3 as sql


def toFloat(curString):

    curString = curString.replace('$', '')

    curString = curString.replace(',', '')

    return float(curString)


#checks if a numeric field is blank by finding if there are any numbers
def curCheck(string):
    return (any((char == '$') for char in string))


#db interaction variables

conn = sql.connect('zayo.db')

cursor = conn.cursor()





#cpq read-in
CPQ = []

with open('ZayoHackathonData_CPQs.csv', newline='') as csvfile:
    reader = csv.reader(csvfile, delimiter=',')

    headers = next(reader, None)

    if headers:
        for row in reader:
            CPQ.append(row)

#tup convert for read-in

headers = tuple(headers)

for i in range(0, len(CPQ)):
    CPQ[i] = tuple(CPQ[i])


print(CPQ[2])


cursor.execute('''CREATE TABLE CPQ
(NAME TEXT
AGE INT);''')

print("table created")

conn.commit()

conn.close()
