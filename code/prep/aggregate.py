#!usr/bin/python
import os
import sys
import zipfile
import glob

import glob
import shutil
def aggregate(dir_of_unzipped_dirs):

    if dir_of_unzipped_dirs[-1] != '/':
        dir_of_unzipped_dirs += '/'

    aggregate_path = dir_of_unzipped_dirs + 'aggregated/'
    try:
        os.mkdir(aggregate_path)

    except:
        print('Adding to existing "aggregated" directory')

    for dir in os.listdir(dir_of_unzipped_dirs):
        if dir is not 'aggregated':
            if '.zip' not in dir:
                for file in os.listdir(dir_of_unzipped_dirs + dir):
                    if '.img' in file:
                        print (dir_of_unzipped_dirs)
                        print(dir)
                        print(file)
                        origin = dir_of_unzipped_dirs + dir + '/' + file

                        shutil.copy(origin, aggregate_path + file)



if __name__ == '__main__':
    aggregate(sys.argv[1])
