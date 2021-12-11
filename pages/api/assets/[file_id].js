import fs, { createReadStream } from 'fs';
import nextConnect from 'next-connect';

import { prisma, createLogHTTP } from '../../../utils/index';

const apiRoute = nextConnect({
    onError: (error, req, res) => res.status(501).json({ error: `Une erreur est survenue! ${error.message}` }),
    onNoMatch: (req, res) => res.status(405).json({ error: `La méthode '${req.method}' n'est pas autorisée` })
});

apiRoute.use(async (req, res, next) => {
    createLogHTTP(req);    
    next();
});

apiRoute.get(async (req, res) => {
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
});

apiRoute.put(async (req, res) => {
    const { file_id } = req.query;
});

export default apiRoute;
export const config = {
    api: { bodyParser: { sizeLimit: '20mb' } }
}