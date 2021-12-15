import Link from 'next/link';

import styles from '../styles/error.module.scss';

export default function Custom500() {
    return (
        <div className={styles['error-page']}>
            <div className={styles['wrapper']}>
                <p>
                    <span>500</span> Une erreur est survenue sur le serveur
                </p>
                <Link href='/'>
                    <a>Revenir à l'accueil</a>
                </Link>
            </div>
        </div>
    );
}