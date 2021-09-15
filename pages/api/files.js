import { readdir, stat } from 'fs/promises';
import { File } from '../../utils';

export default async function handler(req, res) {
    try {
        const filesFolder = await readdir(process.env.UPLOAD_DIR);
        const files = [];

        for await (const fileName of filesFolder) {
            const fileStat = await (await stat(`${process.env.UPLOAD_DIR}/${fileName}`));
            files.push(
                new File({ fileName, size: fileStat.size, url: process.env.UPLOAD_URL })
            );
        }
        
        res.status(200).json({ files: Array.from(files) });
    } catch (error) {
        res.status(501).json({ error });
    }
}