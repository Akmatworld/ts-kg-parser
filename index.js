const request = require('request');
const cheerio = require('cheerio');
let fs = require('fs');

let url = 'http://www.ts.kg/show/healer';
let baseUrl = 'http://www.ts.kg';
let listOfSeriesLinks = [];
let resultSeriesLinks = [];
let fileName = 'links.txt';
let fileNameAfterDownloadLinks = 'fileName.txt';

request(url, (err, res, html) => {  
	const $ = cheerio.load(html);

	$('.pagination').find('a').each((i, element) => {

		let linkObject = {
			number: null,
			link: ''
		};

		linkObject.number = $(element).text();
		linkObject.link = element.attribs.href;
		listOfSeriesLinks.push(linkObject);
	});

	for (let i = 0; i < listOfSeriesLinks.length; i++) {
		// one link
		request(baseUrl + listOfSeriesLinks[i].link, (err, res, html) => {
			const $ = cheerio.load(html);
			let downloadBtn = $('#download-button')[0].attribs.href;

			request(baseUrl + downloadBtn, (err, res, html) => {
				const $ = cheerio.load(html);
				let urlOneSeries = $('#dl-button a.btn')[0].attribs.href;
				resultSeriesLinks.push(baseUrl + urlOneSeries);

				fs.appendFile(fileName, baseUrl + urlOneSeries + '\n', 'utf-8', (err) => {
					if (err) console.log(err)
				});

				let arrayOfLink = urlOneSeries.split('/');
				let hashFileName = arrayOfLink[arrayOfLink.length - 1];

				fs.appendFile(fileNameAfterDownloadLinks, listOfSeriesLinks[i].number +'|'+ hashFileName + '\n', 'utf-8', (err) => {
					if (err) console.log(err)
				});
			});	
		});
	}
});

