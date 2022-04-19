import dayjs from 'dayjs';
import 'dayjs/locale/fr';

dayjs.extend(require('dayjs/plugin/relativeTime'));
dayjs.locale('fr');

import styles from '../../styles/file-preview/file-preview.module.scss';
import { FileFront } from '../../front.d';
import { GetIcon } from '../../utils';
import Image from 'next/image';

export default function Details({ file }: { file: FileFront }): JSX.Element {
    const { name, passwordSet, size, meta, createdAt } = file;

    return (<div className={styles['file-details']}>
        <div className={styles['details']}>
            <Image src={GetIcon(meta.type)} alt='File icon' width={24} height={24} />
            {name} — <span style={{ color: 'grey' }}>{PrettyDate(createdAt)}</span>
        </div>
        <div className={styles['size']}>
            {!passwordSet ? size.pretty : 'Protected'}
        </div>
    </div>);
}

function PrettyDate(date) {
    return dayjs(date).format('D MMMM YYYY à HH:mm');
}