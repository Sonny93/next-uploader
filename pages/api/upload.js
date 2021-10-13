import { stat } from 'fs/promises';
import nextConnect from 'next-connect';
import {  getSession } from 'next-auth/client';
import multer from 'multer';

import { File } from '../../utils';

const upload = multer({
    storage: multer.diskStorage({
        destination: process.env.UPLOAD_DIR,
        filename: (req, file, cb) => {
            // faire les verifs ici avant d'upload
            console.log('là', file);
            cb(null, file?.originalname);
        }
    })
});

const apiRoute = nextConnect({
    onError(error, req, res) {
        res.status(501).json({ error: `Une erreur est survenue! ${error.message}` });
    },
    onNoMatch(req, res) {
        res.status(405).json({ error: `La méthode '${req.method}' n'est pas autorisée` });
    },
});

apiRoute.use(async (req, res, next) => { // Middleware auth
    const session = await getSession({ req });
    if (!session)
        return res.status(403).send({ error: 'Vous devez être connecté' });
    else
        next();
});

// Check for upload
apiRoute.use(upload.single('file'));

// Post file upload
apiRoute.post(async (req, res) => {
    const fileReq = req?.file;
    const fileStat = await (await stat(`${process.env.UPLOAD_DIR}/${fileReq?.originalname}`));
    const file = new File({ fileName: fileReq?.originalname, size: fileStat.size, url: process.env.UPLOAD_URL });
    
    res.status(200).json({ file });
});

export default apiRoute;

export const config = {
    api: {
        bodyParser: false
    }
}