const request = require('request');
const cheerio = require('cheerio');
let fs = require('fs');
let path = require('path');

let url = process.argv[2]; // url for collect links for download them further
let baseUrl = 'http://www.ts.kg';
let listOfSeriesLinks = [];
let resultSeriesLinks = [];
let fileName = process.argv[3]; // file name for links. links save into the file
let fileNameAfterDownloadLinks = process.argv[4];
let folders = [];

function createFolders(folders, basePath = process.cwd()) {
	folders.forEach(folder => {
		const folderPath = path.join(basePath, folder);

		try {
			if (!fs.existsSync(folderPath)) {
				fs.mkdirSync(folderPath, { recursive: true });
				console.log(`✅ Папка создана: ${folderPath}`);
			} else {
				console.log(`⚠️ Папка уже существует: ${folderPath}`);
			}
		} catch (err) {
			console.error(`❌ Ошибка при создании папки "${folder}":`, err);
		}
	});
}

request(url, (err, res, html) => {
	const $ = cheerio.load(html);

	$('.app-show-seasons-section-light').find('h3').each((i, el) => {
		let season = `Сезон_${$(el).text().split('').at(-1)}`
		folders.push(season)
	})

	createFolders(folders)

	$('.app-show-seasons-section-light').find('a').each((i, el) => {
		let linkObject = {
			number: null,
			link: ''
		};
		linkObject.number = $(el).text();
		linkObject.link = el.attribs.href;

		listOfSeriesLinks.push(linkObject);
	})


	for (let i = 0; i < listOfSeriesLinks.length; i++) {
		let linkObject = listOfSeriesLinks[i]

		// one link
		request(baseUrl + linkObject.link, (err, res, html) => {
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
				let numberOfEpisod = arrayOfLink.at(- 1);
				let season = linkObject.link.split('/').at(-2)

				fs.appendFile(fileNameAfterDownloadLinks, linkObject.number +'|'+ numberOfEpisod + '|' + season + '\n', 'utf-8', (err) => {
					if (err) console.log(err)
				});
			});
		});
	}
});

