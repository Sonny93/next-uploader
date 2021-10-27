import { createReadStream } from 'fs';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function File(req, res) {
    const { file_id } = req.query;
    const file = await prisma.file.findUnique({
        where: { file_id }
    });

    if (!file)
        return res.status(403).send('Unable to find file ' + file_id);
    
    const filePath = `${process.env.UPLOAD_DIR}/${file.fileSaveAs}`;
    const readStream = createReadStream(filePath);
    await new Promise((resolve) => {
        readStream.pipe(res);
        readStream.once('end', () => {
            console.log('asset fileMimeType', file.fileMimeType);
            res.writeHead(200, {
                'Content-Type': file.fileMimeType,
                'Content-Length': file.fileBrutSize
            });
            resolve();
        });
        readStream.once('error', (error) => {
            console.error(error);
            // res.status(403).send('Une erreur est survenue lors de la lecture du fichier ' + file_id);
        });
    });
}

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '20mb'
        }
    }
}