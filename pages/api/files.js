import { readdir } from 'fs/promises';

export default async function handler(req, res) {
    try {
        const files = await (await readdir('./public/static/uploads')).map((file) => `./static/uploads/${file}`);
        res.status(200).json({ files: Array.from(files) });
    } catch (error) {
        res.status(501).json({ error });
    }
}