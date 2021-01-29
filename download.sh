#!/bin/bash

#Url for serials
url=$1
#Folder name for save series
folderName=$2
#File to save links and change file names
fileForLinks=links.txt
fileNameAfterDownload=fileName.txt
#Save current directory path
currentDir=$(pwd)
#Get home directory
homeDir=$USER

#Change directory to user videos
cd "/home/$homeDir/Видео"

#Create folder
mkdir $folderName

#Change directory $folderName
cd $folderName

#Create file for save links
touch $fileForLinks $fileNameAfterDownload

#Run our node js script for download links
node "$currentDir/index.js" $url $fileForLinks $fileNameAfterDownload

#Run wget
wget -ci $fileForLinks 

#We need change name of every downloaded video files
node "$currentDir/changeFileName.js" $fileNameAfterDownload 

#We need remove some files after those actions
rm -rf $fileForLinks $fileNameAfterDownload

#Comment after success downloaded
echo 'Files succesed downloaded, Enjoy watching dude :)'