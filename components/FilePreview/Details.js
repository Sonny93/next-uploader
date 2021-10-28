import dayjs from 'dayjs';
import 'dayjs/locale/fr';
dayjs.extend(require('dayjs/plugin/relativeTime'));
dayjs.locale('fr');

export default function Details({ file, mime }) {
    const { name, fileExtension, size, createdAt } = file;
    return <ul className='file-details'>
        <li className='field'>
            <span>Nom: </span>
            <span>{name}</span>
        </li>
        <li className='field'>
            <span>Type: </span>
            <span>{mime.join(' - ')} (fichier {fileExtension})</span>
        </li>
        <li className='field'>
            <span>Taille: </span>
            <span>{size}</span>
        </li>
        <li className='field'>
            <span>Date de création: </span>
            <span>{dayjs(createdAt).format('D MMMM YYYY à HH:mm')}</span>
        </li>
    </ul>;
}