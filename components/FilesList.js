import React, { useEffect } from 'react';
import toastr from 'toastr';

export default function FilesList({ files, setFiles }) {
    useEffect(async () => {
        const request = await fetch('/api/files');
        if (!request.ok)
            return console.error(request);

        const data = await request.json();
        setFiles(data?.files || []);
    }, []);

    if (!files) {
        return <div>
            chargement des fichiers
        </div>
    }

    return <ul className='filelist'>
        {files.length} fichier{files.length > 1 ? 's' : ''}
        {files.length > 0 ? <>
            {files.map((file, key) => <li className='file' key={key}>
                <img src={file} />
                <span>fichier</span>
            </li>)}
        </> : 'Aucun fichier'}
    </ul>
}