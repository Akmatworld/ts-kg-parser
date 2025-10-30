let fs = require('fs');
let path = require('path');

async function organizeVideosBySeason() {
    const sourceDir = process.cwd()

    try {
        const files = await fs.promises.readdir(sourceDir);

        for (const file of files) {
            const filePath = path.join(sourceDir, file);

            // Проверяем, что это файл, а не папка
            const stat = await fs.promises.stat(filePath);
            if (!stat.isFile()) continue;

            const ext = path.extname(filePath); // получаем расширение, например ".txt"
            if (ext.includes('txt')) {
                continue
            }

            // Ищем число
            const seasonNumber = file.split('s').at(-1).split('.')[0]

            const seasonDir = path.join(sourceDir, `Сезон_${seasonNumber}`);

            // Новый путь для файла
            const newFilePath = path.join(seasonDir, file);

            // Перемещаем файл
            await fs.promises.rename(filePath, newFilePath);
            console.log(`✅ Перемещён: ${file} → ${seasonDir}`);
        }

        console.log('🎬 Все файлы обработаны.');
    } catch (err) {
        console.error('❌ Ошибка:', err);
    }
}

organizeVideosBySeason();
