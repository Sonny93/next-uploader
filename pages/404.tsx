import Link from 'next/link';
import { FrontPageProps } from '../front';
import styles from '../styles/error.module.scss';

function Custom404Page({ transitionClass }: FrontPageProps) {
    return (<>
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
    </>);
}

Custom404Page.authRequired = true;
export default Custom404Page;