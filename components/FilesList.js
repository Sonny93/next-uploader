import React, { useState } from 'react';
import Link from 'next/link';

import { AiOutlineFileImage, AiOutlineVideoCamera } from 'react-icons/ai';
import { BiFile } from 'react-icons/bi';
import { FaRegFileAudio } from 'react-icons/fa';
import { DiJavascript1, DiCss3, DiHtml5 } from 'react-icons/di';

import { calculSize } from '../utils';

export default function FilesList({ files, showFilter, globalSize }) {
    const [inputContent, setInputContent] = useState('');
    const [filesFilter, setFilesFilter] = useState(files);

    console.log(filesFilter);
    return (<>
        {showFilter && <div className='filter'>
            <label htmlFor='input_search'>Rechercher • {globalSize && calculSize(globalSize)}</label>
            <input
                name='input_search'
                id='input_search'
                placeholder={`Rechercher parmis ${files?.length || 0} fichier${files?.length > 1 ? 's' : ''}`}
                onChange={({ target }) => {
                    setInputContent(target.value);
                    if (!files || files?.length < 1) return;

                    const filesFiltered = files.filter((file) => file.name.toLowerCase().includes(target.value.toLowerCase()) ? file : false);
                    setFilesFilter(filesFiltered);
                }}
                value={inputContent} />
        </div>}
        {filesFilter.length < 1 ? <>
            <div className='no-files'>
                <p>Aucune correspondance pour "<b>{inputContent}</b>"</p>
            </div>
        </> : <>
            <ul className='filelist'>
                {filesFilter.map((file, key) => {
                    const { file_id, name, size, fileMimeType } = file;
                    const mime = fileMimeType.split('/');

                    let icon = null;
                    if (mime[0] === 'image') {
                        icon = <AiOutlineFileImage />
                    } else if (mime[0] === 'video') {
                        icon = <AiOutlineVideoCamera />
                    } else if (mime[0] === 'audio') {
                        icon = <FaRegFileAudio />
                    } else {
                        if (mime[1] === 'javascript') {
                            icon = <DiJavascript1 />;
                        } else if (mime[1] === 'html') {
                            icon = <DiHtml5 />;
                        } else if (mime[1] === 'css') {
                            icon = <DiCss3 />;
                        } else {
                            icon = <BiFile />;
                        }
                    }

                    return <li className='file' key={key}>
                        <Link href={`/file/${file_id}`}>
                            <a>
                                <div className='icon-btn'>
                                    {icon}
                                </div>
                                <div className='meta'>
                                    <span className='name'>
                                        {name}
                                    </span>
                                    <span className='details'>
                                        {size} - fichier
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