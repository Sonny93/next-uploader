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
            Chargement des fichiers
        </div>
    } else if (files.length < 1) {
        return <div>
            Aucun fichier
        </div>
    }

    return <ul className='filelist'>
        {files.length} fichier{files.length > 1 ? 's' : ''}
        {files.map((file, key) => <li className='file' key={key}>
            <div className='icon-container'>
                <img src={file.uploadPath} />
            </div>
            <span>
                {file.fileName} - {file.size} - {file.type}
            </span>
        </li>)}
    </ul>
}