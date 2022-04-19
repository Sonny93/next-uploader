import Link from 'next/link';

import styles from '../styles/error.module.scss';

import { FrontPageProps } from '../front';

export default function Custom404({ transitionClass }: FrontPageProps) {
    return (
        <div className={`${transitionClass} ${styles['error-page']}`}>
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