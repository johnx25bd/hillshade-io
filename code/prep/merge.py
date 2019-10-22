#!usr/bin/python
import os
import sys


def merge_rasters(dir):
    if dir[-1] != '/':
        dir += '/'

    files_to_merge = ''
    for file in os.listdir(dir):
        if '.img' in file:
            files_to_merge += dir + file + ' '

    os.mkdir(dir + 'merged')
    # print(files_to_merge)
    cmd = 'gdal_merge.py -of GTiff -o ' + dir + 'merged/colorado.tif ' + files_to_merge

    os.system(cmd)

if __name__ == '__main__':
    merge_rasters(sys.argv[1])
