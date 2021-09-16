import React, { useEffect, useState, useRef } from 'react';
import ModalUpload from './ModalUpload';
import { AiFillFileAdd } from 'react-icons/ai';
import { success } from 'toastr';

function FileInput({ refInput, setFilesUpload }) {
    return <input
        type='file'
        id='file-upload'
        onChange={(event) => setFilesUpload(
            Array.from(
                event.target.files
            )
        )}
        multiple={true}
        ref={refInput} />
}

export default function Upload({ setFiles, isBrowser }) {
	const [filesUpload, setFilesUpload] = useState(null);
    const refInputFile = useRef();

    function successUpload(files) {
        if (!files) return console.log('success upload but receive no file in callback');
        
        setFiles((filesPrev) => {
            const filesToReturn = Array.from(filesPrev);
            for (const file of files)
                filesToReturn.push(file);

            return filesToReturn;
        });
    }

    return <div className='uploader'>
        {filesUpload?.length > 0 
            && <ModalUpload 
                filesUpload={filesUpload} 
                setFilesUpload={setFilesUpload} 
                successUpload={successUpload} 
                isBrowser={isBrowser} 
            />}
        <button
            className='icon-btn'
            onClick={(e) => {
                e.preventDefault();
                refInputFile.current.click();
            }}>
            <AiFillFileAdd />
        </button>
        <FileInput refInput={refInputFile} setFilesUpload={setFilesUpload} />
    </div>;
}