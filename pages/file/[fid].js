import { useRouter } from "next/dist/client/router";
import { useEffect, useState } from "react";
import FilePreview from "../../components/FilePreview";

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
            {error}
        </p>);
    } else if (file === null) {
        return (<p>
            Chargement du fichier {fid} en cours
        </p>);
    } else if (file === undefined) {
        return (<p>
            Impossible de charger le fichier {fid}
        </p>);
    } else {
        return (<pre>
            <FilePreview file={file} />
            {JSON.stringify(file, null, 2)}
        </pre>);
    }
}