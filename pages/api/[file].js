import { readdir } from 'fs/promises';

export default async function handler(req, res) {
    const { file } = req.query;
    try {
        const files = await readdir('./uploads');
        for (const file of files) {
            console.log(file);
        }
        res.status(200).json({ count: files.length });
    } catch (error) {
        res.status(501).json({ error });
    }
}