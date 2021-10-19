import nextConnect from 'next-connect';
import { getSession } from 'next-auth/client';
import multer from 'multer';
import path from 'path';

import { rename } from 'fs/promises';

import { PrismaClient } from '@prisma/client';
import { fileSafeProps } from '../../utils';
const prisma = new PrismaClient();

const upload = multer({ 
    storage: multer.diskStorage({
        destination: process.env.UPLOAD_DIR,
        filename: async (req, file, cb) => cb(null, file.originalname)
    })
});

const apiRoute = nextConnect({
    onError: (error, req, res) => res.status(501).json({ error: `Une erreur est survenue! ${error.message}` }),
    onNoMatch: (req, res) => res.status(405).json({ error: `La méthode '${req.method}' n'est pas autorisée` })
});

apiRoute.use(async (req, res, next) => { // Middleware auth
    const session = await getSession({ req });
    if (!session)
        return res.status(403).send({ error: 'Vous devez être connecté' });
    else
        next();
});

apiRoute.use(upload.single('file'));
apiRoute.use(async (req, res) => {
    const file = req.file;
    const customName = req.body?.customName;
    if (!customName)    
        return res.status(403).send({ error: 'Vous devez préciser un nom pour le fichier' });
        
    const password = req.body?.password;
    const extension = path.extname(req.file.originalname).substr(1);

    let fileDB;
    try {
        const saveAs = `${Date.now()}-${extension}-${file.size}`;
        fileDB = await prisma.file.create({
            data: {
                name: customName,
                password: password,
                passwordSet: password ? true : false,
                fileBrutSize: file.size,
                fileSaveAs: saveAs.toString(),
                fileExtension: extension,
                fileMimeType: file.mimetype
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(400).send({ error: 'Une erreur est survenue lors de l\'ajout du fichier dans la base de donnée' });
    }

    try {
        await rename(`${process.env.UPLOAD_DIR}/${file.originalname}`, `${process.env.UPLOAD_DIR}/${saveAs}`);
        res.status(200).send({ status: 'OK', file: fileSafeProps(fileDB) });
    } catch (error) {
        console.error(error);
        res.status(400).send({ error: 'Une erreur est survenue lors de la création du fichier' });
    }
});

export default apiRoute;
export const config = {
    api: { bodyParser: false }
}