import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import toastr from 'toastr';

export default function FilesList({ files, setFiles, isBrowser }) {
    const [filePreview, setFilePreview] = useState(null);

    useEffect(async () => {
        const request = await fetch('/api/files');
        if (!request.ok)
            return console.error(request);

        const data = await request.json();
        setFiles(data?.files || []);
    }, []);

    function ModalPreviewFile({ file }) {
        console.log('modalpreviewfile file', file);
        if (!file) return <Modal isOpen={false} />
        return <Modal 
            isOpen={true} 
            contentLabel="File preview" 
            appElement={isBrowser ? document.getElementById("__next") : document.body}>
            {JSON.stringify(file, null, 4)}
            <button onClick={() => setFilePreview(null)}>
                fermer
            </button>
        </Modal>
    }

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
        <ModalPreviewFile file={filePreview} />
        {files.length} fichier{files.length > 1 ? 's' : ''}
        {files.map((file, key) => <li className='file' key={key} onClick={(e) => setFilePreview(file)}>
            <div className='icon-container'>
                <img src={file.uploadPath} />
            </div>
            <span>
                {file.fileName} - {file.size} - {file.type}
            </span>
        </li>)}
    </ul>
}