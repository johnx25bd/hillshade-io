#!usr/bin/python
import sys
import pandas as pd

def getURLs(file_csv):
    df = pd.read_csv(file_csv)
    print(str( df['downloadURL'].tolist()[0:5])) # Print rather than return, for the shell script

if __name__ == '__main__':
    getURLs(sys.argv[1])
