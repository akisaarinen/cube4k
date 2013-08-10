#!/usr/bin/env bash
DIR=`dirname $0`

cd $DIR
grunt

html=`ls -al index.html | cut -d' ' -f8`
dist=`ls -al dist/Cube.min.js | cut -d ' ' -f8`
total=$(( $html + $dist ))
diff=$(( 4096 - $total ))

echo "HTML:  $html bytes"
echo "JS:    $dist bytes"
echo "-----------------"
echo "Total: $total bytes ($diff free)"
