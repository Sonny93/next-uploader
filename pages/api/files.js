import { PrismaClient } from '@prisma/client';
import { calculSize, fileSafeProps } from '../../utils';
const prisma = new PrismaClient();

BigInt.prototype.toJSON = function () { return this.toString() }

export default async function handler(req, res) {
    try {
        const files = await prisma.file.findMany();
        files.map(file => fileSafeProps(file));

        res.status(200).json({ files });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error });
    }
}