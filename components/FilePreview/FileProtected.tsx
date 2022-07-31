import { useEffect, useState } from 'react';
import Image from 'next/image';

import { FetchFile, GetIcon } from '../../utils';
import { FileFront, FileType } from '../../front.d';

import Input from '../Inputs/Input';

import styles from '../../styles/file-preview/file-protected.module.scss';
import FilePreview from './FilePreview';

export default function FileProtected({ file }: { file: FileFront }): JSX.Element {
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [accessGranted, setAccessGranted] = useState<boolean>(false);
    const { meta } = file;

    useEffect(() => {
        const timeout = setTimeout(() => setError(null), 5000);
        return () => clearTimeout(timeout);
    }, [error]);

    function handleFormSubmit(event) {
        event.preventDefault();

        setAccessGranted(false);
        setError(null);

        FetchFile({ src: file.url, password, confirmationOnly: true })
            .then(() => setAccessGranted(true))
            .catch((error) => setError(error));
    }

    if (accessGranted) {
        return (<>
            <FilePreview file={file} password={password} />
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
            <form onSubmit={handleFormSubmit}>
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