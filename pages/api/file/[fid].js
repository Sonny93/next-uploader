import nextConnect from 'next-connect';
import { stat, unlink } from 'fs';

import { prisma, fileSafeProps, createLogHTTP } from '../../../utils';
BigInt.prototype.toJSON = function () { return this.toString() }

const apiRoute = nextConnect({
    onError: (error, req, res) => res.status(501).json({ error: `Une erreur est survenue! ${error.message}` }),
    onNoMatch: (req, res) => res.status(405).json({ error: `La méthode '${req.method}' n'est pas autorisée` })
});

apiRoute.use((req, res, next) => {
    createLogHTTP(req);
    next();
});

apiRoute.get(async (req, res) => {
    const { fid } = req.query;

    const file = await prisma.file.findUnique({
        where: { file_id: fid }
    });

    if (!file)
        res.status(400).json({ error: `Impossible de trouver le fichier ${fid}`, ok: false });
    else
        res.status(200).json({ file: fileSafeProps(file), ok: true });
});

apiRoute.delete(async (req, res) => {
    const { fid } = req.query;

    try {
        const file = await prisma.file.delete({
            where: { file_id: fid }
        });

        if (!file) {
            return res.status(400).json({ error: `Impossible de trouver le fichier "${file.name}"`, ok: false });
        }
       
        const filePath = `${process.env.UPLOAD_DIR}/${file.fileSaveAs}`;
        stat(filePath, (error, stat) => {
            if (error) {
                console.error(error);
                return res.status(400).json({ message: `Une erreur est survenue lors de la suppression du fichier "${file.name}"`, ok: false });
            }

            unlink(filePath, (error) => {
                if (error) {
                    console.error(error)
                    res.status(400).json({ message: `Impossible de supprimer le fichier "${file.name}"`, ok: false });
                } else {
                    res.status(200).json({ message: `Le fichier "${file.name}" a bien été supprimé`, ok: true });
                }
            });
        });
    } catch (error) {
        res.status(400).send({ error: `Impossible de trouver le fichier ${fid}` });
    }
});

export default apiRoute;