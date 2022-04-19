import { getCsrfToken } from 'next-auth/client';
import { useState } from 'react';
import { useRouter } from 'next/router';

import Input from '../components/Inputs/input';

import styles from '../styles/login.module.scss';

export default function SignIn({ csrfToken }) {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const { error } = useRouter().query;
    console.log(error);
    return (
        <div className={styles['login']}>
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
    const csrfToken = await getCsrfToken(context)
    return {
        props: { csrfToken }
    }
}