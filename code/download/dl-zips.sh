#!/bin/sh

# adapted from https://gist.github.com/sepans/b493a0b9d3027310e9f2
# Must include the path to a csv file downloaded from USGS National Map
# as the parameter

num=1
csv=$1
urls=($(python './get-urls.py' $csv | tr -d '[],'))

for (( i = 0; i < ${#urls[@]}; ++i )); do
  filename="../../data/dls/colorado/ned-$num.zip"
  cmd="curl -s -o $filename  ${urls[i]}"
  eval $cmd
  num=$((num+1))
done
