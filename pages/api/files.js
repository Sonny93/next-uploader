import { prisma, fileSafeProps, createLogHTTP } from '../../utils';
BigInt.prototype.toJSON = function () { return this.toString() }

export default async function handler(req, res) {
    createLogHTTP(req);

    try {
        const files = await (await prisma.file.findMany()).reverse();
        files.map(file => fileSafeProps(file));

        res.status(200).json({ files });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error });
    }
}