#!usr/bin/python
import os
import sys
import zipfile

def unzip(dir_of_zips):
    if dir_of_zips[-1] != '/':
        dir_of_zips += '/'

    for f in os.listdir(dir_of_zips):
        if '.zip' in f:
            target_zip = dir_of_zips + f
            target_dir = dir_of_zips + f.replace('.zip', '')
            try:
                with zipfile.ZipFile(target_zip, 'r') as z:
                    z.extractall(target_dir)
            except:
                print(target_zip, 'failed to unzip')


if __name__ == '__main__':
    unzip(sys.argv[1])
