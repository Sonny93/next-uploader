import { AiOutlineLoading } from 'react-icons/ai';

import styles from './loader.module.scss';

interface LoaderProps {
    label?: string;
    top?: boolean;
    backdrop?: boolean;
}

export default function Loader({
    label = 'Chargement en cours',
    top = true,
    backdrop = false
}: LoaderProps) {
    let className: string = `${styles['loader']}`;

    if (top) {
        className += ` ${styles['top']}`;
    }

    if (backdrop) {
        className += ` ${styles['backdrop']}`;
    }

    return <div className={className}>
        <AiOutlineLoading />
        <div className={styles['label']}>
            {label}
        </div>
    </div>
}