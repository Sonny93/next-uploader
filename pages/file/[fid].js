import { useRouter } from 'next/dist/client/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';

import FilePreview from '../../components/FilePreview';

export default function File() {
    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);

    const router = useRouter();
    const { fid } = router.query;
    console.log('fid', fid, 'file', file);

    useEffect(() => {
        if (!fid) return;
        (async () => {
            try {
                const request = await fetch(`/api/file/${fid}`);
                const data = await request.json();
                if (!data?.ok)
                    return setError(data?.error || `Une erreur est survenue lors de la récupération des données du ficher ${fid}`);
                else
                    setFile(data?.file);
            } catch (error) {
                console.error(error);
                return setError('Erreur requêtes');
            }
        })();
    }, [fid, setFile]);

    if (error) {
        return (<p>
            <Link href='/'>
                <a>revenir à la page d'accueil</a>
            </Link>
            {error}
        </p>);
    } else if (file === null) {
        return (<p>
            <Link href='/'>
                <a>revenir à la page d'accueil</a>
            </Link>
            Chargement du fichier {fid} en cours
        </p>);
    } else if (file === undefined) {
        return (<p>
            <Link href='/'>
                <a>revenir à la page d'accueil</a>
            </Link>
            Impossible de charger le fichier {fid}
        </p>);
    }

    return (
        <div className='App'>
            <div className='file'>
                <Link href='/'>
                    <a className='home-link'>revenir à la page d'accueil</a>
                </Link>
                <FilePreview file={file} />
            </div>
        </div>
    );
}