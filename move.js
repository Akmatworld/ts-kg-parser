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

            // Ищем число после символа "|"
            const match = file.match(/\|(\d+)/);
            if (!match) {
                console.log(`⏭ Пропущен: ${file} (не содержит "|число")`);
                continue;
            }

            const seasonNumber = match[1];
            const seasonDir = path.join(sourceDir, `Сезон_${seasonNumber}`);

            // Создаём папку для сезона, если её нет
            await fs.promises.mkdir(seasonDir, { recursive: true });

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
