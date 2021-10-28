import dayjs from 'dayjs';
import 'dayjs/locale/fr';
dayjs.extend(require('dayjs/plugin/relativeTime'));
dayjs.locale('fr');

export default function Details({ file, mime }) {
    const { name, fileExtension, size, createdAt } = file;
    return <ul>
        <li style={{ marginBottom: '2px' }}>
            <span style={{ color: '#3f88c5', userSelect: 'none' }}>Nom: </span>
            <span>{name}</span>
        </li>
        <li style={{ marginBottom: '2px' }}>
            <span style={{ color: '#3f88c5', userSelect: 'none' }}>Type: </span>
            <span>{mime.join(' - ')} (fichier {fileExtension})</span>
        </li>
        <li style={{ marginBottom: '2px' }}>
            <span style={{ color: '#3f88c5', userSelect: 'none' }}>Taille: </span>
            <span>{size}</span>
        </li>
        <li style={{ marginBottom: '2px' }}>
            <span style={{ color: '#3f88c5', userSelect: 'none' }}>Date de création: </span>
            <span>{dayjs(createdAt).format('D MMMM YYYY à HH:mm')}</span>
        </li>
    </ul>;
}