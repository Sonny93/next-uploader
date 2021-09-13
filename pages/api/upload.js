import nextConnect from 'next-connect';
import multer from 'multer';

const uploadPath = '/static/uploads';

const upload = multer({
    storage: multer.diskStorage({
        destination: `./public${uploadPath}`,
        filename: (req, file, cb) => cb(null, file.originalname)
    })
});

const apiRoute = nextConnect({
    onError(error, req, res) {
        res.status(501).json({ error: `Sorry something Happened! ${error.message}` });
    },
    onNoMatch(req, res) {
        res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
    },
});

apiRoute.use(upload.array('theFiles'));

apiRoute.post((req, res) => {
    const files = req.files.map((file) => `${uploadPath}/${file.originalname}`);
    res.status(200).json({ data: 'success', files });
});

export default apiRoute;

export const config = {
    api: {
        bodyParser: false
    }
}