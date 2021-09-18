import { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import toastr from 'toastr';
import { calculSize } from '../../utils';

async function upload(filesUpload, setFilesUpload, successUpload) {
    filesUpload.map((file) => file.progress = null);
    try {
        const filesUploaded = [];
        for await (const file of filesUpload) {
            const name = prompt('name');

            console.log('name', name);
            file.nameByUser = name;

            const fileIndex = filesUpload.findIndex(f => f.name === file.name);
            if (fileIndex === -1)
                return console.error('fileindex -1');

            const formData = new FormData();
            formData.append('file', file);
            
            const { data } = await axios.request({
                method: 'post',
                url: '/api/upload',
                data: formData,
                onUploadProgress: (progress) => {
                    setFilesUpload((filesPrev) => {
                        const files = [...filesPrev];
                        files[fileIndex].progress = progress;
                        
                        return files;
                    });
                }
            });

            if (!data?.file)
                toastr.warning(`Veuillez rafraîchir la page pour avoir le fichier uploadé`);
            else 
                filesUploaded.push(data.file);
        }

        toastr.success(`${filesUploaded.length} fichier(s) uploadés`);
        setFilesUpload(null);
        successUpload(filesUploaded);
    } catch (error) {
        setFilesUpload(null);
        if (error.response) {
            console.error(error.response);
            const dataError = error.response.data?.error;
            if (dataError)
                toastr.error(dataError, 'Upload error');
            else
                toastr.error('Upload error');
        } else if (error.request) {
            toastr.error('Aucune réponse envoyée par le serveur', 'Upload error');
            console.error(error.request);
        } else {
            console.error('Error', error.message);
        }
    }
}

export default function ModalUpload({ filesUpload, setFilesUpload, isBrowser, successUpload }) {
    async function cancelUpload() {
        setFilesUpload(null);
        if (refInputFile?.current)
            refInputFile.current.files = null;
    }

    return (
        <Modal
            isOpen={true}
            contentLabel="File list"
            appElement={isBrowser ? document.getElementById("__next") : document.body}
            className='modal-container'>
            <button onClick={() => setFilesUpload(null)} className='close'>
                fermer
            </button>
            <div className='modal-content'>
                {filesUpload.map((file, key) => {
                    const { name, size, progress } = file;
                    const percent = progress ? ((progress.loaded / progress.total) * 100).toFixed(2) : null;

                    return <li className='file-upload' key={key}>
                        <div className='name'>
                            {name}
                        </div>
                        <div className='size'>
                            {calculSize(size)}
                        </div>
                        {progress && <div className='progression'>
                            <progress min={0} max={100} value={percent}></progress>
                            {`${percent}%`} - {calculSize(progress.loaded)} sur {calculSize(progress.total)}
                        </div>}
                    </li>
                })}
                <button onClick={() => upload(filesUpload, setFilesUpload, successUpload)} disabled={false}>
                    Envoyer ({filesUpload.length} fichier{filesUpload.length > 1 ? 's' : ''})
                </button>
                <button onClick={cancelUpload} disabled={false}>
                    Annuler
                </button>
            </div>
        </Modal>
    );
}