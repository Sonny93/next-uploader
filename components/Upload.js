import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
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

export default function Upload({ setFiles }) {
	const refInputFile = useRef();
	const [filesUpload, setFilesUpload] = useState(null);

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
            <button onClick={upload} disabled={true}>
                Upload
            </button>
        </div>;
    }

    return <div className='uploader'>
        <button
            onClick={(e) => {
                e.preventDefault();
                refInputFile.current.click();
            }}>
            Sélectionner des fichiers
        </button>
        <FileInput refInput={refInputFile} setFiles={setFilesUpload} />
        <button onClick={upload} disabled={false}>
            Envoyer ({filesUpload.length} fichier{filesUpload.length > 1 ? 's' : ''})
        </button>
        <ul>
            <legend>
                Fichiers à envoyer
            </legend>
            {Array.from(filesUpload).map((file, key) => {
                return <li key={key}>
                    {file.name} - {calculSize(file.size)}
                </li>
            })}
        </ul>
    </div>;
}