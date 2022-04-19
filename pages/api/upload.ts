import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect, { NextHandler } from 'next-connect';
import { Session } from 'next-auth';
import { getSession } from 'next-auth/client';

import multer from 'multer';
import { extname } from 'path';
import { rename } from 'fs/promises';

import bcrypt from 'bcrypt';

import { Request } from 'express';
import { prisma } from '../../utils';
import { FileBuilder } from '../../utils/api';

// @ts-ignore
BigInt.prototype.toJSON = function () { return this.toString() }

// Upload
const upload = multer({
    storage: multer.diskStorage({
        destination: process.env.UPLOAD_DIR,
        filename: async (req: Request, file: Express.Multer.File, cb: (error: Error, filename: string) => void) => cb(null, file.originalname)
    })
});

// Gesiton des erreurs
const apiRoute = nextConnect({
    onError: (error, req: NextApiRequest, res: NextApiResponse) => res.status(501).json({ error: `Une erreur est survenue! ${error.message}` }),
    onNoMatch: (req: NextApiRequest, res: NextApiResponse) => res.status(405).json({ error: `La méthode '${req.method}' n'est pas autorisée` })
});

// Middleware auth
apiRoute.use(async (req: NextApiRequest, res: NextApiResponse, next: NextHandler) => {
    const session: Session = await getSession({ req });
    if (!session) {
        return res.status(403).send({ error: 'Vous devez être connecté' });
    }

    next();
});

apiRoute.use(upload.single('file'));

apiRoute.use(async (req: Request, res: NextApiResponse) => {
    const file = req.file;
    const customName = req.body?.customName;

    if (!customName) {
        return res.status(403).send({ error: 'Vous devez préciser un nom pour le fichier' });
    }

    const password = req.body?.password;
    const extension = extname(req.file.originalname).substring(1);

    try {
        const saveAs = `${Date.now()}-${file.size}.${extension}`;
        const fileDB = await prisma.file.create({
            data: {
                name: customName,
                password: password ? await bcrypt.hash(password, 10) : null,
                passwordSet: password ? true : false,
                fileBrutSize: file.size,
                fileSaveAs: saveAs.toString(),
                fileExtension: extension,
                fileMimeType: file.mimetype
            }
        });
        try {
            await rename(`${process.env.UPLOAD_DIR}/${file.originalname}`, `${process.env.UPLOAD_DIR}/${saveAs}`);
            res.status(200).send({ status: 'OK', file: FileBuilder(fileDB) });
        } catch (error) {
            console.error(error);
            res.status(400).send({ error: 'Une erreur est survenue lors de la création du fichier' });
        }
    } catch (error) {
        console.error(error);
        return res.status(400).send({ error: 'Une erreur est survenue lors de l\'ajout du fichier dans la base de donnée' });
    }
});

export default apiRoute;
export const config = {
    api: { bodyParser: false }
}