import { PrismaClient } from '@prisma/client';
import { calculSize } from '../../utils';
const prisma = new PrismaClient();

BigInt.prototype.toJSON = function () { return this.toString() }

export default async function handler(req, res) {
    try {
        const files = await prisma.file.findMany();
        console.log(files);
        files.map((file, key) => {
            file.size = calculSize(file.fileBrutSize);
            file.url = `${process.env.UPLOAD_URL}/${file.file_id}`;
            delete file.password;
            delete file.id;
            delete file.fileBrutSize;
            delete file.fileSaveAs;
            
            return file;
        });
        res.status(200).json({ files });
    } catch (error) {
        console.error(error);
        res.status(501).json({ error });
    }
}