import nextConnect from 'next-connect';
import { getSession } from 'next-auth/client';
import multer from 'multer';
import path from 'path';

import { calculSize } from '../../utils';

import { PrismaClient } from '@prisma/client';
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
    console.log('là', req.file);
    const customName = req.body?.customName;
    const password = req.body?.password;
    
    const file = req.file;

    const extension = path.extname(req.file.originalname);
    const fileName = (customName || file.originalname);

    try {
        const fileDB = await prisma.file.create({
            data: {
                name: customName,
                fullname: fileName + extension,
                password: password,
                passwordSet: password ? true : false,
                size: calculSize(file.size),
                uploadUrl: `${process.env.UPLOAD_URL}/${file.filename}`,
                uploadPath: file.path,
                fileBrutSize: file.size,
                fileExtension: extension,
                fileKind: file.mimetype
            }
        });
        console.log(fileDB);
        res.status(200).send({ status: 'OK' });
    } catch (error) {
        console.error(error);
        res.status(403).send({ error: 'Une erreur est survenue' });
    }
});

export default apiRoute;
export const config = {
    api: { bodyParser: false }
}