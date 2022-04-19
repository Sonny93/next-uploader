import { useSession } from 'next-auth/client';
import Link from 'next/link';

import Loader from '../components/Loader/Loader';
import Meta from '../components/Meta/Meta';

import styles from '../styles/about.module.scss';

import { FrontPageProps } from '../front';

export default function About({ transitionClass }: FrontPageProps) {
    const [session, isLoadingSession] = useSession();

    if (isLoadingSession && !session) { // Chargement session
        return (
            <div className={`${transitionClass} ${styles['App']}`}>
                <Meta />
                <Loader label={'Chargement de la session'} top={true} backdrop={true} />
            </div>
        );
    }

    return (
        <div className={`${transitionClass} ${styles['App']}`}>
            <Meta />
            <h2>Qu'est ce que NextUpload</h2>
            <p>
                NextUpload est une solution « clé-en-main » vous permettant d'héberger vos fichiers comme n'importe quel autre service cloud à la différence près que vous pouvez choisir de les hébérger vous-même sur vorte serveur.
                <Link href={'/'}>
                    <a>En savoir plus</a>
                </Link>
            </p>
            <p>
                Mais ce n'est pas tout, vous pouvez également gérer l'accès à chacun de vos fichiers via un système de permission pointu qui vous octroi un contrôle total et précis pour vos fichiers. Les fichiers peuvent être sécurisé à l'aide d'un mot de passe, ou expirer au bout de X temps.
            </p>
            <p>
                NextUpload intégre également des outils pour créer vos images, vidéos, PDFs, ou encore des fichiers textuels !
                <Link href={'/create'}>
                    <a>En savoir plus</a>
                </Link>
            </p>
            <p>
                Alors qu'attendez vous pour vous lancer dans l'avanture ?
                <Link href={'/upload'}>
                    <a>Se lancer</a>
                </Link>
            </p>
        </div>
    )
}