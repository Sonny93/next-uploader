import React, { useEffect, useState } from 'react';
import Link from 'next/link';

import { AiOutlineFileImage, AiOutlineVideoCamera } from 'react-icons/ai';
import { BiFile } from 'react-icons/bi';
import { FaRegFileAudio } from 'react-icons/fa';

import Loader from './Loader';
import { calculSize } from '../utils';

export default function FilesList({ files, globalSize }) {
    const [inputContent, setInputContent] = useState('');
    const [filesFilter, setFilesFilter] = useState(files);

    return (<>
        <div className='filter'>
            <label htmlFor='input_search'>Rechercher • {globalSize && calculSize(globalSize)}</label>
            <input
                name='input_search'
                id='input_search'
                placeholder={`Rechercher parmis ${files?.length || 0} fichier${files?.length > 1 ? 's' : ''}`}
                onChange={({ target }) => {
                    setInputContent(target.value);
                    if (!files || files?.length < 1) return;

                    const filesFiltered = files.filter((file) => {
                        console.log(file, file.name, file.name.toLowerCase(), target.value.toLowerCase());
                        return file.name.toLowerCase().includes(target.value.toLowerCase()) ? file : false;
                    });
                    setFilesFilter(filesFiltered);
                }}
                value={inputContent} />
        </div>
        {filesFilter.length < 1 ? <>
                <div className='no-files'>
                    <p>Aucune correspondance pour "<b>{inputContent}</b>"</p>
                </div>
            </> : <>
                <ul className='filelist'>
                    {filesFilter.map((file, key) => {
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
            </>}
    </>);
}