const fs = require('fs');
const path = require('path');

let fileName = process.argv[2]; // fileName.txt need to change every downloaded file

fs.readFile(fileName, 'utf8', (err, data) => {
    if (err) throw err;

    let arrayOfFileName = data.split('\n');
    arrayOfFileName = arrayOfFileName.slice(0, arrayOfFileName.length - 1);

    for (let i = 0; i < arrayOfFileName.length; i++) {
    	let fName = arrayOfFileName[i];
    	let newFName = fName.split('|')[0].trim();
    	let oldName = fName.split('|')[1].trim();

		// here newFileName can't be .mp4 need to check and fix
	    fs.rename('./' + oldName,'./' + `${newFName}.mp4`, function(err) {
		    if ( err ) console.log('ERROR: ' + err);
		});
    }


});

