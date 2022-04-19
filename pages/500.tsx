import Link from 'next/link';

import styles from '../styles/error.module.scss';

import { FrontPageProps } from '../front';

export default function Custom500({ transitionClass }: FrontPageProps) {
    return (
        <div className={`${transitionClass} ${styles['error-page']}`}>
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