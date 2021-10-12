import axios from 'axios';
import toastr from 'toastr';
import { LineProgressBar } from '@frogress/line';

import { calculSize } from '../utils';
import { useRef, useState } from 'react';

export default function upload() {
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
        <div className='App'>
            <input
                type='file'
                id='file-upload'
                onChange={handleFiles}
                multiple={true}
                ref={refInput} />
            <div className='upload-list'>
                <ul>
                {files ? files.map((file, key) => {
                    console.log(file);
                    const { name, size, progress } = file;
                    const percent = progress ? ((progress?.loaded / progress?.total) * 100).toFixed(2) : 0;

                    return (
                        <li className='file-upload' key={key} style={{ width: '100%', marginBottom: '10px' }}>
                            <div className='name'>
                                {name}
                            </div>
                            <div className='progression'>
                                <span style={{ display: 'flex' }}>
                                    <LineProgressBar
                                        progressColor={percent < 100 ? 'linear-gradient(to right, #78abe9, #74dad8, #ec7cac)' : 'green'}
                                        style={{ position: 'relative' }}
                                        percent={percent}
                                        rounded={5}
                                        height={25}
                                    />
                                    <span style={{ wordBreak: 'normal' }}>{percent}%</span>
                                </span>
                                <div>
                                    {calculSize(progress?.loaded || 0)} sur {calculSize(progress?.total || size)}
                                </div>
                            </div>
                            <div className='controls'>
                                <button>changer nom</button>
                            </div>
                        </li>
                    )
                }) : 'erreur'}
                </ul>
                <button onClick={() => UploadFiles(files, setFiles)}>
                    Envoyer ({files.length} fichier{files.length > 1 ? 's' : ''})
                </button>
                <button disabled={true}>
                    Annuler
                </button>
            </div>
        </div>
    </>);
}

async function UploadFiles(files, setFiles) {
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

        setFiles([]);
        toastr.success(`${filesUploaded.length} fichier(s) uploadés`);
    } catch (error) {
        setFiles([]);
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