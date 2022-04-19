import { getCsrfToken, getProviders, signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/router';

import Input from '../components/Inputs/input';

import styles from '../styles/login.module.scss';

export default function SignIn({ csrfToken, providers }) {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const { error } = useRouter().query;

    return (
        <div className={styles['login']}>
            {Object.values(providers).map(({ name, id }) => (
                <div key={name}>
                    <button onClick={() => signIn(id)}>
                        Sign in with {name}
                    </button>
                </div>
            ))}
            <form method='post' action='/api/auth/callback/credentials'>
                <h1>Connexion</h1>
                <input name='csrfToken' type='hidden' defaultValue={csrfToken} />
                <Input
                    label='Email'
                    name='email'
                    fieldClass={styles['field']}
                    value={email}
                    placeholder='user@example.com'
                    onChangeCallback={({ target }, value) => setEmail(value)}
                />
                <Input
                    label='Password'
                    name='password'
                    type='password'
                    fieldClass={styles['field']}
                    value={password}
                    placeholder='********'
                    onChangeCallback={({ target }, value) => setPassword(value)}
                />
                <button type='submit'>Se connecter</button>
                {error && (
                    <p className={styles['error']}>{error}</p>
                )}
            </form>
        </div>
    )
}

export async function getServerSideProps(context) {
    const csrfToken = await getCsrfToken(context);
    const providers = await getProviders();

    return {
        props: {
            csrfToken,
            providers: await getProviders()
        }
    }
}