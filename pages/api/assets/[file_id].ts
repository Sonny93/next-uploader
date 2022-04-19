import { createReadStream, existsSync } from 'fs';
import { stat } from 'fs/promises';
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import bcrypt from 'bcrypt';

import { prisma } from '../../../utils';

const apiRoute = nextConnect({
    onError: (error: Error, req: NextApiRequest, res: NextApiResponse) => res.status(501).json({ error: `Une erreur est survenue! ${error.message}` }),
    onNoMatch: (req: NextApiRequest, res: NextApiResponse) => res.status(405).json({ error: `La méthode '${req.method}' n'est pas autorisée` })
});

apiRoute.get(async (req: NextApiRequest, res: NextApiResponse) => {
    const file_id = req.query?.file_id as string;
    const password = req.headers?.['password'] as string;

    const file = await prisma.file.findUnique({ where: { file_id } });
    if (!file) {
        return res.status(403).send(`Impossible de trouver le fichier ${file_id}`);
    }

    console.log('password required, header password:', password);
    if (file.passwordSet) {
        if (!password) {
            return res.status(400).send('Un mot de passe est requis pour accéder à ce fichier');
        }

        const passwordMatch = await bcrypt.compare(password, file.password);
        if (!passwordMatch) {
            return res.status(400).send('Mot de passe incorrect');
        }
    }

    const filePath = `${process.env.UPLOAD_DIR}/${file.fileSaveAs}`;
    if (!existsSync(filePath)) {
        return res.status(403).send(`Impossible de récupérer le fichier correspondant à ${file_id}`);
    }

    const range = req.headers.range;
    if (!range) {
        const readStream = createReadStream(filePath);
        // @ts-ignore
        res.writeHead(200, {
            'Content-Type': file.fileMimeType,
            'Content-Length': file.fileBrutSize
        });
        readStream.pipe(res);
    } else {
        const parts = range.replace('bytes=', '').split('-');
        const videoStat = await stat(filePath);
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : videoStat.size - 1;

        const readStream = createReadStream(filePath, { start, end });
        res.writeHead(206, {
            'Accept-Ranges': 'bytes',
            'Content-Range': `bytes ${start}-${end}/${videoStat.size}`
        });
        readStream.pipe(res);
    }
});

function isJsonString(str: string | null) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

export default apiRoute;