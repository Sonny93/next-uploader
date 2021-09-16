import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import toastr from 'toastr';

import { AiOutlineFileImage, AiOutlineVideoCamera } from 'react-icons/ai';
import { BiFile } from 'react-icons/bi';
import { FaRegFileAudio } from 'react-icons/fa';
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs';

import Loader from './Loader';
import FilePreview from './FilePreview';

export default function FilesList({ files, setFiles, isBrowser }) {
    const [filePreview, setFilePreview] = useState(null);

    useEffect(() => {
        async function getFiles() {
            const request = await fetch('/api/files');
            if (!request.ok)
                return console.error(request);

            const data = await request.json();
            setFiles(data?.files || []);
        }

        getFiles();
        return () => setFiles(null);
    }, [setFiles]);

    function ModalPreviewFile({ file }) {
        if (!file) return <Modal isOpen={false} className='modal-container' />;

        const fileIndex = files.findIndex(f => f.name === file.name);
        if (fileIndex === -1) return <Modal isOpen={false} className='modal-container' />;

        return <>
            <Modal 
                isOpen={true} 
                contentLabel="File preview" 
                appElement={isBrowser ? document.getElementById("__next") : document.body}
                className='modal-container'>
                <div className='modal-content'>
                    <div className='modal-header'>
                        <a onClick={() => fileIndex > 0 ? setFilePreview(files[fileIndex - 1]) : null} disabled={fileIndex > 0}>
                            {fileIndex > 0 && <BsArrowLeft />}
                        </a>
                        <button onClick={() => setFilePreview(null)} className='close'>
                            Fermer
                        </button>
                        <a onClick={() => fileIndex < files.length - 1 ? setFilePreview(files[fileIndex + 1]) : null} disabled={fileIndex < files.length - 1}>
                            {fileIndex < files.length - 1 && <BsArrowRight />}
                        </a>
                    </div>
                    <FilePreview file={file} filesLength={files.length} index={fileIndex} />
                </div>
            </Modal>
        </>;
    }

    if (!files) {
        return <div>
            <Loader label='Chargement des fichiers' />
        </div>
    } else if (files.length < 1) {
        return <div>
            Aucun fichier
        </div>
    }

    return <>
        <ul className='filelist'>
            <ModalPreviewFile file={filePreview} />
            {files.length} fichier{files.length > 1 ? 's' : ''}
            {files.map((file, key) => {
                const { type, name, size, extension } = file;
                let icon = null;

                if (type === 'image') {
                    icon = <AiOutlineFileImage />
                } else if (type === 'video') {
                    icon = <AiOutlineVideoCamera />
                } else if (type === 'audio') {
                    icon = <FaRegFileAudio />
                } else {
                    icon = <BiFile />;
                }

                return <li className='file' key={key} onClick={(e) => setFilePreview(file)}>
                    <div className='icon-btn'>
                        {icon}
                    </div>
                    <div className='meta'>
                        <span className='name'>
                            {name}    
                        </span>
                        <span className='details'>
                            {size} - fichier {extension}
                        </span>
                    </div>
                </li>
            })}
        </ul>
    </>
}