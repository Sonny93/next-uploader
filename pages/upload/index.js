import { useRef, useState } from 'react';
import { AiFillFileAdd } from 'react-icons/ai';

import Link from 'next/link';
import { LineProgressBar } from '@frogress/line';
import axios from 'axios';
import toastr from 'toastr';

import { calculSize } from '../../utils';

export default function Upload() {
    const refInput = useRef();
    const [files, setFiles] = useState([]);

    function handleFiles(event) {
        const filesInput = event.target.files;
        const files = (Array.from(filesInput)).map((file) => {
            file.progress = null;
            return file;
        });
        setFiles(files);
    }

    return (<>
        <div className='App upload'>
            <div className='input-container'>
                <Link href='/'>
                    <a className='home-link'>Revenir à la page d'accueil</a>
                </Link>
            </div>
            <ul className='upload-list'>
            {files ? files.map((file, key) => {
                const { id, name, size, progress } = file;
                const percent = progress ? ((progress?.loaded / progress?.total) * 100).toFixed(2) : 0;

                function onChangeName(event) {
                    const value = event.target.value;
                    files.find(f => f.id === id);
                    const newFiles = files.map((file) => {
                        if (file.id !== id) return file; 
                        file.name = value;
                        return file;
                    });
                    setFiles(newFiles);
                }

                if (progress > 100) return;

                return (
                    <li className='file-upload' key={key}>
                        <div className='name'>
                            <input onChange={onChangeName} value={name} style={{ width: '100%' }} className='nostyle input-name' />
                        </div>
                        <div className='progression'>
                            <LineProgressBar
                                progressColor={percent < 100 ? 'linear-gradient(to right, #78abe9, #74dad8, #ec7cac)' : 'lightgreen'}
                                percent={percent}
                                className='progression-bar'
                            />
                            <div className='div-center'>
                                <span style={{ color: '#3f88c5' }}>{calculSize(progress?.loaded || 0)}</span> sur <span style={{ color: '#3f88c5' }}>{calculSize(progress?.total || size)}</span> ({percent}%)
                            </div>
                        </div>
                    </li>
                )
            }) : 'erreur'}
            </ul>
            <div className='controls'>
                <input
                    type='file'
                    id='file-upload'
                    onChange={handleFiles}
                    multiple={true}
                    ref={refInput} 
                    className='nostyle input-upload' />
                <button onClick={() => UploadFiles(files, setFiles, refInput)} disabled={files.length < 1 || !refInput?.current ? true : false}>
                    Envoyer {files.length > 0 ? `(${files.length} fichier${files.length > 1 ? 's' : ''})` : null}
                </button>
                <button className='icon-btn btn' onClick={() => refInput?.current?.click()}>
                    <AiFillFileAdd />
                </button>
            </div>
        </div>
    </>);
}

async function UploadFiles(files, setFiles, refInput) {
    if (!files || files?.length < 1) return;
    try {
        for await (const file of files) {
            const fileIndex = files.findIndex(f => f.name === file.name);
            if (fileIndex === -1) return;

            const formData = new FormData();
            formData.append('file', file);

            const { data } = await axios.request({
                method: 'post',
                url: '/api/upload',
                data: formData,
                onUploadProgress: (progress) => {
                    setFiles((filesPrev) => {
                        const files = [...filesPrev];
                        files[fileIndex].progress = progress;

                        return files;
                    });
                }
            });

            if (!data?.file)
                toastr.warning(`Veuillez rafraîchir la page pour avoir le fichier uploadé`);
        }

        toastr.success(`${files.length} fichier(s) uploadés`);
    } catch (error) {
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
    setFiles([]);
    refInput.current.value = null;
    console.log(refInput.current, refInput.current.files);
}