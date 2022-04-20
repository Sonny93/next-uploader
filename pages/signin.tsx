import { getProviders, signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

import Meta from '../components/Meta/Meta';
import { FrontPageProps } from '../front';

import styles from '../styles/login.module.scss';

interface SignInProps extends FrontPageProps {
    providers: any;
}

export default function SignIn({ providers, transitionClass }: SignInProps): JSX.Element {
    const { data: session, status } = useSession();
    const { success, error } = useRouter().query;

    return (<>
        <Meta
            title='Uploader — Authentification'
            description='Page de connexion'
        />
        <div className={`${transitionClass} ${styles['login']}`}>
            <h1>Authentification</h1>
            <Providers providers={Object.values(providers)} />
            {success && (<p className={styles['success']}>{success}</p>)}
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
                        Se connecter avec {name}
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