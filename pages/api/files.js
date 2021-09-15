import { readdir, stat } from 'fs/promises';
import { File } from '../../utils';

export default async function handler(req, res) {
    try {
        const uploadPath = './public/static/uploads';

        const filesFolder = await readdir(uploadPath);
        const files = [];

        for await (const fileName of filesFolder) {
            const fileStat = await (await stat(`${uploadPath}/${fileName}`));
            files.push(
                new File({ fileName, size: fileStat.size, url: 'http://localhost:4000/uploads' })
            );
        }
        
        res.status(200).json({ files: Array.from(files) });
    } catch (error) {
        res.status(501).json({ error });
    }
}