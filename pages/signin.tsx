import { getProviders, signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Loader from '../components/Loader/Loader';

import Meta from '../components/Meta/Meta';
import { FrontPageProps } from '../front';

import styles from '../styles/login.module.scss';

interface SignInProps extends FrontPageProps {
    providers: any;
}

export default function SignIn({ providers, transitionClass }: SignInProps): JSX.Element {
    const { data: session, status } = useSession();
    const { success, error } = useRouter().query;

    if (status === 'loading') {
        return (<>
            <Meta
                title='Uploader — Authentification'
                description='Page de connexion'
            />
            <Loader label='Chargement de la session' />
        </>);
    }

    return (<>
        <Meta
            title='Uploader — Authentification'
            description='Page de connexion'
        />
        <div className={`${transitionClass} ${styles['login']}`}>
            <h1>Authentification</h1>
            {status === 'unauthenticated'
                ? <Providers providers={Object.values(providers)} />
                : <p>Vous êtes connecté</p>}
            <Link href='/'>
                <a>Retourner à l'accueil</a>
            </Link>
            {error && (<p className={styles['error']}>{error}</p>)}
        </div>
    </>);
}

function Providers({ providers }): JSX.Element {
    console.log(providers)
    if (providers.length > 0) {
        return (<>
            {providers.map(({ name, id }) => (
                <div key={name}>
                    <button onClick={() => signIn(id)}>
                        Continuer avec {name}
                    </button>
                </div>
            ))}
        </>);
    } else {
        return (<>
            <p>Aucun provider d'authentification disponible</p>
        </>)
    }
}

export async function getServerSideProps() {
    const providers = await getProviders();
    return { props: { providers } }
}