// import { readFile } from 'fs/promises';
// Pour envoyer fichiers
// export default async function File(req, res) {
//     const { file_id } = req.query;

//     try {
//         fs.readFile(file.uploadPath, (err, data) => {
//             if (err) {
//                 console.error(err);
//                 return res.status(404).send('file not found');   
//             }
//             res.contentType(file.extension);
//             res.send(data);
//             res.end();
//         });
//     } catch (error) {
//         return res.status(400).json({ error: `Impossible de trouver le fichier ${fid}`, ok: false });
//     }
// }