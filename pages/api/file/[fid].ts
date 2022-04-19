import nextConnect from 'next-connect';
import { stat, unlink } from 'fs';

import { prisma } from '../../../utils';
import { NextApiRequest, NextApiResponse } from 'next';
import { FileBuilder } from '../../../utils/api';

// @ts-ignore
BigInt.prototype.toJSON = function () { return this.toString() }

const apiRoute = nextConnect({
    onError: (error: Error, req: NextApiRequest, res: NextApiResponse) => res.status(501).json({ error: `Une erreur est survenue! ${error.message}` }),
    onNoMatch: (req: NextApiRequest, res: NextApiResponse) => res.status(405).json({ error: `La méthode '${req.method}' n'est pas autorisée` })
});

apiRoute.get(async (req: NextApiRequest, res: NextApiResponse) => {
    const { fid } = req.query;

    const file = await prisma.file.findUnique({
        // @ts-ignore
        where: { file_id: fid }
    });

    if (!file) {
        res.status(400).json({ error: `Impossible de trouver le fichier ${fid}`, ok: false });
    } else {
        res.status(200).json({ file: FileBuilder(file), ok: true });
    }
});

apiRoute.delete(async (req: NextApiRequest, res: NextApiResponse) => {
    const file = await prisma.file.delete({
        where: {
            file_id: req.query.fid as string
        }
    });

    if (!file) {
        return res.status(400).json({ error: `Impossible de trouver le fichier "${file.name}"`, ok: false });
    }

    const filePath = `${process.env.UPLOAD_DIR}/${file.fileSaveAs}`;
    stat(filePath, (error: NodeJS.ErrnoException) => {
        if (error) {
            console.error(error);
            return res.status(400).json({ message: `Une erreur est survenue lors de la suppression du fichier "${file.name}"`, ok: false });
        }

        unlink(filePath, (error) => {
            if (error) {
                console.error(error);
                res.status(400).json({ message: `Impossible de supprimer le fichier "${file.name}"`, ok: false });
            } else {
                res.status(200).json({ message: `Le fichier "${file.name}" a bien été supprimé`, ok: true });
            }
        });
    });
});

export default apiRoute;