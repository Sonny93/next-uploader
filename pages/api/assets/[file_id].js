import { readFile, stat } from 'fs/promises';
import { createReadStream } from 'fs';
import { File as FileClass } from '../../../utils';

export default async function File(req, res) {
    const { file_id } = req.query;

    try {
        const filePath = `${process.env.UPLOAD_DIR}/${file_id}`;
        const fileStat = await (await stat(filePath));
        const file = new FileClass({ fileName: file_id, size: fileStat.size, url: process.env.UPLOAD_URL });
        if (!file)
            return res.status(400).json({ error: `Impossible de trouver le fichier ${file_id}`, ok: false });

        res.writeHead(200, {
            'Content-Type': `${file.type}/${file.extension}`,
            'Content-Length': file.brutSize
        });
        const readStream = createReadStream(filePath);
        await new Promise((resolve) => {
            readStream.pipe(res);
            readStream.on('end', resolve)
        });
    } catch (error) {
        return res.status(400).json({ error: `Impossible de trouver le fichier ${file_id}`, ok: false });
    }
}