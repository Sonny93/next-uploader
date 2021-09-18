import { stat } from 'fs/promises';
import { File as FileClass } from '../../../utils';
import mysql from 'mysql2/promise';

export default async function File(req, res) {
    const { fid } = req.query;
    console.log(fid);

    // const connection = await mysql.createConnection({
    //     host: process.env.DB_HOST,
    //     user: process.env.DB_USER,
    //     password: process.env.DB_PASS,
    //     database: process.env.DB_DB
    // });
    // const [rows, fields] = await connection.execute('SELECT * FROM `table` WHERE `name` = ? AND `age` > ?', ['Morty', 14]);

    try {
        const fileStat = await (await stat(`${process.env.UPLOAD_DIR}/${fid}`));
        const file = new FileClass({ fileName: fid, size: fileStat.size, url: process.env.UPLOAD_URL });
        if (!file)
            return res.status(400).json({ error: `Impossible de trouver le fichier ${fid}`, ok: true });
        else 
            res.status(200).json({ file, ok: true });
    } catch (error) {
        return res.status(400).json({ error: `Impossible de trouver le fichier ${fid}`, ok: true });
    }
}