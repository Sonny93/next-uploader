import { useRef, useState } from 'react';
import { AiFillFileAdd } from 'react-icons/ai';

import Link from 'next/link';
import axios from 'axios';
import toastr from 'toastr';

import UploadList from '../../components/Upload/UploadList';

export default function Upload() {
    const refInput = useRef();
    const [files, setFiles] = useState([]);

    function handleFiles(event) {
        const filesInput = event.target.files;
        const files = (Array.from(filesInput)).map((file) => {
            file.customName = file.name;
            file.password = '';
            file.progress = null;
            return file;
        });
        setFiles(files);
    }

    return (<>
        <div className='App upload'>
            <header>
                <Link href='/'>
                    <a className='home-link'>Revenir à la page d'accueil</a>
                </Link>
            </header>
            {files && files.length > 0 ?
                <UploadList files={files} setFiles={setFiles} /> : 
                <div className='no-files'>
                    <p>Aucun fichier</p>
                </div>}
            
            <div className='controls'>
                <input
                    type='file'
                    id='file-upload'
                    onChange={handleFiles}
                    multiple={true}
                    ref={refInput} 
                    className='nostyle input-upload' 
                />
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
    try {
        if (!files || files?.length < 1) return;
        for await (const file of files) {
            const fileIndex = files.findIndex(f => f.name === file.name);
            if (fileIndex === -1) return;

            const formData = new FormData();
            formData.append('file', file);
            formData.append('customName', file?.customName);
            formData.append('password', file?.password);

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