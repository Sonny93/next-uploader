import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../utils';

import { FileAPI } from '../../api';
import { FileBuilder } from '../../utils/api';

//@ts-ignore
BigInt.prototype.toJSON = function () { return this.toString() }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const filesDB: FileAPI[] = await (await prisma.file.findMany()).reverse();
        const files = filesDB.map((file: FileAPI) => FileBuilder(file));
        console.log(files);

        res.status(200).json({ files });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error });
    }
}