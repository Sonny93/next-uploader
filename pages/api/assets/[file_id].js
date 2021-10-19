import { createReadStream } from 'fs';

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function File(req, res) {
    const { file_id } = req.query;
    const file = await prisma.file.findUnique({
        where: { file_id }
    });

    const filePath = `${process.env.UPLOAD_DIR}/${file.fileSaveAs}`;
    console.log('là', filePath);

    delete file.password;
    delete file.id;
    delete file.fileSaveAs;
    file.url = `${process.env.UPLOAD_URL}/${file.file_id}`;

    res.writeHead(200, {
        'Content-Type': file.fileMimeType,
        'Content-Length': file.brutSize
    });
    const readStream = createReadStream(filePath);
    await new Promise((resolve) => {
        readStream.pipe(res);
        readStream.on('end', resolve);
    });
}