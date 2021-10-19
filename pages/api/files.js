import { readdir, stat } from 'fs/promises';
import { File } from '../../utils';

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
    try {
        const files = await prisma.file.findMany();
        console.log(files);
        files.map((file, key) => {
            delete file.password;
            delete file.id;
            delete file.fileSaveAs;
            file.url = `${process.env.UPLOAD_URL}/${file.file_id}`;
            return file;
        });
        res.status(200).json({ files });
    } catch (error) {
        console.error(error);
        res.status(501).json({ error });
    }
}