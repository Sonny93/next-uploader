import { NextSeo } from 'next-seo';
import { getProviders, signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { FcGoogle } from 'react-icons/fc';

import Loader from '../components/Loader/Loader';
import MessageManager from '../components/MessageManager';

import { FrontPageProps } from '../front';

import styles from '../styles/login.module.scss';

interface SignInProps extends FrontPageProps {
    providers: any;
}

export default function SignInPage({ providers, transitionClass }: SignInProps): JSX.Element {
    const { status } = useSession();
    const { error, success, info } = useRouter().query;

    if (status === 'loading') {
        return (<>
            <NextSeo
                title={'Authentification'}
                description={'Page de connexion'}
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
            <div className={`${transitionClass} ${styles['login']}`}>
                <div className={styles['field']} style={{ color: '#fff' }}>
                    <p>Aucun provider d'authentification disponible</p>
                </div>
            </div>
        </>);
    }

    return (<>
        <NextSeo
            title={'Authentification'}
            description={'Page de connexion'}
        />
        <div className={`${transitionClass} ${styles['login']}`}>
            <div className={styles['field']}>
                <h1>Authentification</h1>
                {status === 'unauthenticated'
                    ? <Providers providers={Object.values(providers)} />
                    : <p>Vous êtes connecté</p>}
                <Link href='/'>
                    <a>Retourner à l'accueil</a>
                </Link>
            </div>
            <MessageManager
                error={error as string}
                info={info as string}
                success={success as string}
            />
        </div>
    </>);
}

function Providers({ providers }): JSX.Element {
    return (<>
        {providers.map(({ name, id }) => (
            <div key={name}>
                <button type='button' onClick={() => signIn(id, { callbackUrl: '/' })}>
                    Continuer avec <FcGoogle /> {name}
                </button>
            </div>
        ))}
    </>);
}

export async function getServerSideProps() {
    const providers = await getProviders();
    return { props: { providers } }
}