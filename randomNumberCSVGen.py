# Simple script for generating CSVs of random values. Only does ints right now
# but will probably modify it for floats.
# Davidson Eklund, 22/01/18

#Usage: randomNumberCSVGen <outputFilename>

import random
import sys
import os

if len(sys.argv) != 2:
	sys.exit("Usage: randomNumberCSVGen <outputFilename>")

numRows = input("Enter number of rows: ")
numColumns = input("Enter number of columns: ")
rangeMax = int(input("Enter maximum value: "))
fileName = sys.argv[1]


file = open(fileName, "w" )

for i in range(int(numRows)):
    for i in range(int(numColumns)):
        newVal = random.randint(0, rangeMax)
        file.write(str(newVal))
        if i != int(numColumns) -1:
            file.write(",")
    file.write("\n")
file.close()

print("Done." )
afile = open(fileName, "r")
print(afile.read())
afile.close()