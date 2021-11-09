import React, { useState } from 'react';
import File from './File';
import Filter from './Filter';

export default function FilesList({ files, showFilter, globalSize }) {
    const [inputContent, setInputContent] = useState('');
    const [filesFilter, setFilesFilter] = useState(files);

    return (<>
        {showFilter && 
            <Filter 
                files={files} 
                filesFilter={filesFilter} 
                globalSize={globalSize} 
                inputContent={inputContent}
                setInputContent={setInputContent} 
                setFilesFilter={setFilesFilter} 
            />}
        {filesFilter.length < 1 ? 
            <div className='no-files'>
                <p>Aucune correspondance pour "<b>{inputContent}</b>"</p>
            </div> : 
            <ul className='filelist'>
                {filesFilter.map((file, key) => <File file={file} key={key} index={key} />)}
            </ul>}
    </>);
}