import { useEffect, useState } from 'react';
import Image from 'next/image';

import { GetIcon } from '../../utils';
import { FileFront, FileType } from '../../front.d';

import Input from '../Inputs/input';

import styles from '../../styles/file-preview/file-protected.module.scss';
import FilePreview from './FilePreview';

export default function FileProtected({ file }: { file: FileFront }): JSX.Element {
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [blob, setBlob] = useState<string | null>(null);
    const { meta } = file;

    useEffect(() => {
        const timeout = setTimeout(() => setError(null), 5000);
        return () => clearTimeout(timeout);
    }, [error]);

    async function getToken(event) {
        event.preventDefault();

        const headers = new Headers();
        headers.set('password', password);

        const request = await fetch(`/api/assets/${file.file_id}`, { headers });
        if (!request.ok) {
            setError(await request.text());
            return;
        }

        const data = await request.blob();
        console.log(data, request);
        if (data) {
            setBlob(URL.createObjectURL(data));
            setError(null);
        } else {
            setBlob(null);
            setError("Impossible d'accéder au fichier demandé");
        }
    }

    if (blob) {
        return (<>
            <FilePreview file={file} blob={blob} />
        </>);
    }

    return (<>
        <div className={styles['file-protected']}>
            <Image
                src={GetIcon(file.passwordSet ? FileType.PROTECTED : file.meta.type)}
                alt={`${meta.type} icon`}
                height={100}
                width={100}
            />
            <p>
                Vous essayez d'accéder à un fichier protégé
            </p>
            <form onSubmit={getToken}>
                <Input
                    name='password'
                    label='Mot de passe'
                    type='password'
                    placeholder='Mot de passe...'
                    fieldClass={styles['password']}
                    value={password}
                    onChangeCallback={({ target }, value) => setPassword(value)}
                />
                <button type='submit' disabled={!password}>
                    Confirmer
                </button>
            </form>
            {error && (
                <p className={styles['error']}>{error}</p>
            )}
        </div>
    </>);
}