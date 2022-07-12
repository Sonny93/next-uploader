import Link from 'next/link';
import { FrontPageProps } from '../front';
import styles from '../styles/error.module.scss';

function Custom500Page({ transitionClass }: FrontPageProps) {
    return (<>
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
    </>);
}

Custom500Page.authRequired = true;
export default Custom500Page;