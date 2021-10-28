import fs, { createReadStream } from 'fs';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function FileAssets(req, res) {
    const { file_id } = req.query;
    const file = await prisma.file.findUnique({ where: { file_id } });

    if (!file)
        return res.status(403).send(`Impossible de trouver le fichier ${file_id}`);
        
    const filePath = `${process.env.UPLOAD_DIR}/${file.fileSaveAs}`;
    if (!fs.existsSync(filePath)) 
        return res.status(403).send(`Impossible de récupérer le fichier correspondant à ${file_id}`);

    const readStream = createReadStream(filePath);
    res.writeHead(200, {
        'Content-Type': file.fileMimeType,
        'Content-Length': file.fileBrutSize
    });

    readStream.pipe(res);
    readStream.once('error', (error) => {
        console.error('error', error);
        if (!res.headersSend)
            res.status(403).send(`Une erreur est survenue lors de la lecture du fichier ${file_id}`);
    });
}

export const config = {
    api: { bodyParser: { sizeLimit: '20mb' } }
}