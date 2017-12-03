#!/bin/bash
jekyll build
rm -rf ~/Sites/
cp -rf ./_site/ ~/Sites/
chmod -R 777 ~/Sites/
git add .
time="$(date +'%F_%H:%M')"
git commit -m $time
git push
