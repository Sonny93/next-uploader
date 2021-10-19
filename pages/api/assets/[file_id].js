import { createReadStream } from 'fs';

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function File(req, res) {
    const { file_id } = req.query;
    const file = await prisma.file.findUnique({
        where: { file_id }
    });

    console.log(file);
    if (!file)
        return res.status(403).send('Unable to find file ' + file_id);

    const filePath = `${process.env.UPLOAD_DIR}/${file.fileSaveAs}`;
    console.log('là', filePath);

    const readStream = createReadStream(filePath);
    await new Promise((resolve, reject) => {
        readStream.pipe(res);
        readStream.once('end', () => {
            res.writeHead(200, {
                'Content-Type': file.fileMimeType,
                'Content-Length': file.fileBrutSize
            });
        
            file.size = file.fileBrutSize;
            file.url = `${process.env.UPLOAD_URL}/${file.file_id}`;
            delete file.password;
            delete file.id;
            delete file.fileBrutSize;
            delete file.fileSaveAs;

            resolve();
        });
        readStream.once('error', (error) => {
            console.error(error);
            res.status(403).send('Unable to find file ' + file.file_id);
        });
    });
}