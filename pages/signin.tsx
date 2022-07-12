import { NextSeo } from 'next-seo';

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

export default function SignInPage({ providers, transitionClass }: SignInProps): JSX.Element {
    const { status } = useSession();
    const { error, info } = useRouter().query;

    if (status === 'loading') {
        return (<>
            <Meta
                title='Uploader — Authentification'
                description='Page de connexion'
            />
            <Loader label='Chargement de la session' />
        </>);
    }

    if (!providers) {
        return (<>
            <NextSeo
                title={'Authentification'}
                description={'Page de connexion'}
            />
            <p>aucun provider</p>
        </>);
    }

    return (<>
        <NextSeo
            title={'Authentification'}
            description={'Page de connexion'}
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
            {info && (<p className={styles['info']}>{info}</p>)}
        </div>
    </>);
}

function Providers({ providers }): JSX.Element {
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
    console.log('providers', providers);
    return { props: { providers } }
}