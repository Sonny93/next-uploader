import React, { useState } from 'react';
import File from './File';
import { calculSize } from '../../utils';

export default function FilesList({ files, showFilter, globalSize }) {
    const [inputContent, setInputContent] = useState('');
    const [filesFilter, setFilesFilter] = useState(files);

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
        {filesFilter.length < 1 ? 
            <div className='no-files'>
                <p>Aucune correspondance pour "<b>{inputContent}</b>"</p>
            </div> : 
            <ul className='filelist'>
                {filesFilter.map((file, key) => <File file={file} key={key} index={key} />)}
            </ul>}
    </>);
}