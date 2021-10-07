import React, { useEffect, useState } from 'react';
import Link from 'next/link';

import { AiOutlineFileImage, AiOutlineVideoCamera } from 'react-icons/ai';
import { BiFile } from 'react-icons/bi';
import { FaRegFileAudio } from 'react-icons/fa';

import Loader from './Loader';

export default function FilesList({ files, setFiles, globalSize, setGlobalSize }) {
    useEffect(() => {
        async function getFiles() {
            const request = await fetch('/api/files');
            if (!request.ok)
                return console.error(request);

            const data = await request.json();

            if (!data?.files) 
                return setFiles([]);
    
            let somme = 0;
            data.files.map((file) => somme += parseInt(file?.brutSize, 10));

            setFiles(data.files);
            setGlobalSize(somme);
        }

        getFiles();
        return () => setFiles(null);
    }, [setFiles]);

    console.log('files', files);
    if (files === null) {
        return <div className='no-files'>
            <Loader label='Chargement des fichiers' top={false} />
        </div>
    } else if (files?.length < 1 || files === undefined) {
        return <div className='no-files'>
            <p>Aucun fichier</p>
        </div>
    }

    return <>
        <ul className='filelist'>
            {files.map((file, key) => {
                const { type, name, fileName, size, extension } = file;
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

                return <li className='file' key={key}>
                    <Link href={`/file/${fileName}`}>
                        <a>
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
                        </a>
                    </Link>
                </li>
            })}
        </ul>
    </>
}