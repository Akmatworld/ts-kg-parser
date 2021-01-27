const request = require('request');
const cheerio = require('cheerio');
let fs = require('fs');

let url = 'http://www.ts.kg/show/healer';
let baseUrl = 'http://www.ts.kg';
let listOfSeriesLinks = [];
let resultSeriesLinks = [];
let fileName = 'links.txt';

request(url, (err, res, html) => {  
	const $ = cheerio.load(html);

	let a = $('.pagination').children('li');
	Object.keys(a).forEach(item => {
		if (!isNaN(item))
			listOfSeriesLinks.push(a[item].children[0].attribs.href);		
	});

	for (let i = 0; i < listOfSeriesLinks.length; i++) {
		// one link
		request(baseUrl + listOfSeriesLinks[i], (err, res, html) => {
			const $ = cheerio.load(html);
			let downloadBtn = $('#download-button')[0].attribs.href;

			request(baseUrl + downloadBtn, (err, res, html) => {
				const $ = cheerio.load(html);
				let urlOneSeries = $('#dl-button a.btn')[0].attribs.href;
				resultSeriesLinks.push(baseUrl + urlOneSeries);

				fs.appendFile(fileName, baseUrl + urlOneSeries + '\n', 'utf-8', (err) => {
					if (err) console.log(err)
				});
			});	
		});
	}
});

