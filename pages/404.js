import Link from 'next/link';

import styles from '../styles/error.module.scss';

export default function Custom404() {
    return (
        <div className={styles['error-page']}>
            <div className={styles['wrapper']}>
                <p>
                    <span>404</span> Page introuvable
                </p>
                <Link href='/'>
                    <a>Revenir à l'accueil</a>
                </Link>
            </div>
        </div>
    );
}