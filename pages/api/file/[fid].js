import { stat } from 'fs/promises';
import { File as FileClass } from '../../../utils';

export default async function File(req, res) {
    const { fid } = req.query;

    try {
        const fileStat = await (await stat(`${process.env.UPLOAD_DIR}/${fid}`));
        const file = new FileClass({ fileName: fid, size: fileStat.size, url: process.env.UPLOAD_URL });
        if (!file)
            return res.status(400).json({ error: `Impossible de trouver le fichier ${fid}`, ok: true });
        else 
            res.status(200).json({ file, ok: false });
    } catch (error) {
        return res.status(400).json({ error: `Impossible de trouver le fichier ${fid}`, ok: false });
    }
}