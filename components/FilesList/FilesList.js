import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';

import File from './File';
import Filter from './Filter';

export default function FilesList({ files, showFilter, globalSize }) {
    const itemsPerPage = 20;
    const [inputContent, setInputContent] = useState('');
    const [filesFilter, setFilesFilter] = useState(files);

    const [currentItems, setCurrentItems] = useState(filesFilter);
    const [pageCount, setPageCount] = useState(0);
    // Here we use item offsets; we could also use page offsets
    // following the API or data you're working with.
    const [itemOffset, setItemOffset] = useState(0);

    const [contextMenu, setContextMenu] = useState(null);

    function loadItems() {
        const endOffset = itemOffset + itemsPerPage;
        console.log(`Loading items from ${itemOffset} to ${endOffset}`);

        setCurrentItems(filesFilter.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(filesFilter.length / itemsPerPage));
    }

    useEffect(loadItems, [itemOffset, itemsPerPage]);

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % filesFilter.length;
        console.log(`User requested page number ${event.selected}, which is offset ${newOffset}`);
        setItemOffset(newOffset);
    };

    function handleRemoveFile(file) {
        if (!file) 
            return console.error('file missing', file);

        const arr = files.filter((f) => f.file_id === file.file_id ? null : f);
        setFilesFilter(arr);
        loadItems();
    }

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
            </div> : <>
                <ul className='filelist'>
                    {currentItems.map((file, key) => (
                        <File 
                            file={file} 
                            key={key} 
                            index={key} 
                            contextMenu={file.file_id === contextMenu} 
                            setContextMenu={setContextMenu}
                            removeFile={handleRemoveFile} />
                    ))}
                </ul>
                <ReactPaginate
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={5}
                    pageCount={pageCount}
                    breakLabel='...'
                    nextLabel='Suivant'
                    previousLabel='Précédent'
                    renderOnZeroPageCount={null}
                    containerClassName='controls-page'
                    nextClassName='reset btn'
                    previousClassName='reset btn'
                    activeClassName='reset btn'
                />
            </>}
    </>);
}