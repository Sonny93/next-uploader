import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import toastr from 'toastr';

import { AiFillFileAdd } from 'react-icons/ai';

import { calculSize } from '../utils';

function FileInput({ refInput, setFiles }) {
    return <input
        type='file'
        id='file-upload'
        onChange={(event) => setFiles(event.target.files)}
        multiple={true}
        ref={refInput} />
}

export default function Upload({ setFiles, filesUpload, setFilesUpload, isBrowser }) {
    const refInputFile = useRef();
    const [progress, setProgress] = useState(null);

    async function upload() {
        if (!filesUpload || filesUpload?.length < 1) return;

        const formData = new FormData();
        Array.from(filesUpload).forEach((file) => formData.append('theFiles', file));

        try {
            const { data } = await axios.request({
                method: 'post',
                url: '/api/upload',
                data: formData,
                onUploadProgress: (p) => {
                    setProgress(<p>{calculSize(p.loaded)} sur {calculSize(p.total)}</p>);
                }
            });

            console.log(data);
            toastr.success(`${filesUpload.length} fichier(s) upload`, 'Upload succès');
            setFiles(data?.files ? (filesPrev) => {
                const filesToReturn = Array.from(filesPrev);
                for (const file of data?.files)
                    filesToReturn.push(file);

                return filesToReturn;
            } : []);
        } catch (error) {
            if (error.response) {
                console.log(error.response);
                const dataError = error.response.data?.error;
                if (dataError)
                    toastr.error(dataError, 'Upload error');
                else
                    toastr.error('Upload error');
            } else if (error.request) {
                toastr.error('Aucune réponse envoyée par le serveur', 'Upload error');
                console.log(error.request);
            } else {
                console.log('Error', error.message);
            }
        }
        setFilesUpload(null);
    }

    async function cancelUpload() {
        setFilesUpload(null);
        if (refInputFile?.current)
            refInputFile.current.files = null;
    }

    function ModalFilesUpload() {
        console.log(filesUpload);
        return <Modal
            isOpen={true}
            contentLabel="File list"
            appElement={isBrowser ? document.getElementById("__next") : document.body}
            className='modal-container'>
            <button onClick={() => setFilesUpload(null)} className='close'>
                fermer
            </button>
            <div className='modal-content'>
                {filesUpload && Array.from(filesUpload).map((file, key) => {
                    return <li key={key}>
                        {file.name} - {file.size}
                    </li>
                })}
                {progress || null}
                <button onClick={upload} disabled={false}>
                    Envoyer ({filesUpload.length} fichier{filesUpload.length > 1 ? 's' : ''})
                </button>
                <button onClick={cancelUpload} disabled={false}>
                    Annuler
                </button>
            </div>
        </Modal>
    }

    return <div className='uploader'>
        {filesUpload?.length > 0 ? <ModalFilesUpload /> : null}
        <button
            className='icon-btn'
            onClick={(e) => {
                e.preventDefault();
                refInputFile.current.click();
            }}>
            <AiFillFileAdd />
        </button>
        <FileInput refInput={refInputFile} setFiles={setFilesUpload} />
    </div>;
}