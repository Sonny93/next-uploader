import dayjs from 'dayjs';
import 'dayjs/locale/fr';
dayjs.extend(require('dayjs/plugin/relativeTime'));
dayjs.locale('fr');

import styles from '../../styles/file-preview/file-preview.module.scss';

export default function Details({ file, mime }) {
    const { name, fileExtension, size, createdAt } = file;
    return <ul className={styles['file-details']}>
        <li className={styles['field']}>
            <span>Nom: </span>
            <span>{name}</span>
        </li>
        <li className={styles['field']}>
            <span>Type: </span>
            <span>{mime.join(' - ')} (fichier {fileExtension})</span>
        </li>
        <li className={styles['field']}>
            <span>Taille: </span>
            <span>{size}</span>
        </li>
        <li className={styles['field']}>
            <span>Date de création: </span>
            <span>{dayjs(createdAt).format('D MMMM YYYY à HH:mm')}</span>
        </li>
    </ul>;
}