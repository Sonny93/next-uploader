import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect, { NextHandler } from 'next-connect';
import { Session } from 'next-auth';
import { getSession } from 'next-auth/react';

import formidable, { Fields, File } from 'formidable';
import IncomingForm from 'formidable/Formidable';

import { extname } from 'path';
import { rename } from 'fs/promises';

import bcrypt from 'bcrypt';

import { prisma } from '../../utils';
import { FileBuilder } from '../../utils/api';

// @ts-ignore
BigInt.prototype.toJSON = function () { return this.toString() }

// Gesiton des erreurs
const apiRoute = nextConnect({
    onError: (error, req: NextApiRequest, res: NextApiResponse) => res.status(501).json({ error: `Une erreur est survenue! ${error.message}` }),
    onNoMatch: (req: NextApiRequest, res: NextApiResponse) => res.status(405).json({ error: `La méthode '${req.method}' n'est pas autorisée` })
});

// Middleware auth
apiRoute.post(async (req: NextApiRequest, res: NextApiResponse, next: NextHandler) => {
    const session: Session = await getSession({ req });
    if (!session) {
        res.status(403).send({ error: 'Vous devez être connecté' });
    } else {
        next();
    }
});

apiRoute.post(async (request: NextApiRequest, response: NextApiResponse) => {
    const form = formidable({
        multiples: false,
        maxFileSize: Number(process.env.UPLOAD_MAX_SIZE),
        uploadDir: process.env.UPLOAD_DIR
    });
    const { file, fields } = await HandleFiles(form, request);

    const fileExtension = extname(file.originalFilename).substring(1);
    const customName = fields['customName'] as string; // TODO: escape chars
    const password = (fields['password'] || '') as string; // TODO: escape chars

    if (!customName || typeof customName !== 'string') {
        return response.status(403).send({ error: 'Vous devez préciser un nom pour le fichier' });
    }

    const saveAs = `${Date.now()}-${file.size}.${fileExtension}`;
    await rename(file.filepath, `${process.env.UPLOAD_DIR}/${saveAs}`);

    const fileDB = await prisma.file.create({
        data: {
            name: customName,
            password: password ? await bcrypt.hash(password, 10) : '',
            passwordSet: password ? true : false,
            fileBrutSize: file.size,
            fileSaveAs: saveAs,
            fileExtension: fileExtension,
            fileMimeType: file.mimetype
        }
    });

    response.status(200).send({ status: 'OK', file: FileBuilder(fileDB) });
});

function HandleFiles(form: IncomingForm, request: NextApiRequest): Promise<{ fields: Fields; file: File; }> {
    return new Promise((resolve, reject) => {
        form.parse(request, (error, fields, files) => {
            if (error) {
                reject(error);
            } else {
                const file = files.file as File;
                resolve({ fields, file });
            }
        });
    });
}

export default apiRoute;
export const config = {
    api: { bodyParser: false }
}