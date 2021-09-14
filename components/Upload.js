import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import toastr from 'toastr';

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

	async function upload() {
		if (!filesUpload || filesUpload?.length < 1) return;

		const formData = new FormData();
		Array.from(filesUpload).forEach((file) => formData.append('theFiles', file));

		const { data } = await axios.request({
			method: 'post',
			url: '/api/upload',
			data: formData,
			onUploadProgress: (p) => {
				console.log(calculSize(p.loaded), calculSize(p.total));
			}
		});
		setFilesUpload(null);
        
		setFiles(data?.files ? (filesPrev) => {
			const filesToReturn = Array.from(filesPrev);
			for (const file of data?.files)
				filesToReturn.push(file);

			return filesToReturn;
		} : []);
	}

	async function cancelUpload() {
        setFilesUpload(null);
        if (refInputFile?.current)
            refInputFile.current.files = null;
	}

    function ModalFilesUpload() {
        return <Modal 
            isOpen={true} 
            contentLabel="Files list" 
            appElement={isBrowser ? document.getElementById("__next") : document.body}>
            {filesUpload && Array.from(filesUpload).map((file, key) => {
                return <li key={key}>
                    {file.name} - {file.size}
                </li>
            })}
            <button onClick={upload} disabled={false}>
                Envoyer ({filesUpload.length} fichier{filesUpload.length > 1 ? 's' : ''})
            </button>
            <button onClick={cancelUpload} disabled={false}>
                Annuler
            </button>
        </Modal>
    }
    
    if (!filesUpload || filesUpload.length < 1) {
        return <div className='uploader'>
            <button
                onClick={(e) => {
                    e.preventDefault();
                    refInputFile.current.click();
                }}>
                Sélectionner des fichiers
            </button>
            <FileInput refInput={refInputFile} setFiles={setFilesUpload} />
        </div>;
    }

    return <div className='uploader'>
        <ModalFilesUpload />
        <button
            onClick={(e) => {
                e.preventDefault();
                refInputFile.current.click();
            }}>
            Sélectionner des fichiers
        </button>
        <FileInput refInput={refInputFile} setFiles={setFilesUpload} />
    </div>;
}