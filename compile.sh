#!/bin/bash
jekyll build
rm -rf ~/Sites/
cp -rf ./_site/ ~/Sites/
chmod -R 777 ~/Sites/
git add .
git commit -m "Compile script..."
git push
