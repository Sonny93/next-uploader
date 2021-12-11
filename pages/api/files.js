import { fileSafeProps } from '../../utils';
import requestip from 'request-ip';

import prisma from '../../lib/prisma';

BigInt.prototype.toJSON = function () { return this.toString() }

export default async function handler(req, res) {
    try {
        const ip = requestip.getClientIp(req);
        const logs = await prisma.log_http.create({ 
            data: {
                method: req.method,
                url: req.url,
                ip
            } 
        });
    } catch (error) {
        console.error('Unable to create http_log', error);
    }

    try {
        const files = await (await prisma.file.findMany()).reverse();
        files.map(file => fileSafeProps(file));

        res.status(200).json({ files });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error });
    }
}