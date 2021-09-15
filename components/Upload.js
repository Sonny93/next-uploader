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
        console.log(filesUpload);
        return <Modal 
            isOpen={true} 
            contentLabel="File list" 
            appElement={isBrowser ? document.getElementById("__next") : document.body}
            className='modal-container'>
            <button onClick={() => setFilePreview(null)} className='close'>
                fermer
            </button>
            <div className='modal-content'>
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
            </div>
        </Modal>
    }

    return <div className='uploader'>
        {filesUpload?.length > 0 ? <ModalFilesUpload /> : null}
        <div
            className='icon-btn'
            onClick={(e) => {
                e.preventDefault();
                refInputFile.current.click();
            }}>
            <AiFillFileAdd />
        </div>
        <FileInput refInput={refInputFile} setFiles={setFilesUpload} />
    </div>;
}