import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

BigInt.prototype.toJSON = function () { return this.toString() }

export default async function File(req, res) {
    const { fid } = req.query;
    const file = await prisma.file.findUnique({
        where: { file_id: fid }
    });

    if (!file) {
        res.status(400).json({ error: `Impossible de trouver le fichier ${fid}`, ok: false });
    } else {
        res.status(200).json({ file, ok: true });
    }
}