import { NextApiRequest, NextApiResponse } from 'next';
import { prisma, fileSafeProps } from '../../utils';

import { File } from './api';

//@ts-ignore
BigInt.prototype.toJSON = function () { return this.toString() }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const files: File[] = await (await prisma.file.findMany()).reverse();
        files.map((file: File) => fileSafeProps(file));

        res.status(200).json({ files });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error });
    }
}