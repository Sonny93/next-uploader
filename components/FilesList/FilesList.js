import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';

import File from './File';
import Filter from './Filter';

import styles from '../../styles/home/filelist.module.scss';

export default function FilesList({ files, globalSize }) {
    const itemsPerPage = 20;
    const [inputContent, setInputContent] = useState('');
    const [filesFilter, setFilesFilter] = useState(files);

    const [currentItems, setCurrentItems] = useState(filesFilter);
    const [pageCount, setPageCount] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);

    const [contextMenu, setContextMenu] = useState(null);
    
    function loadItems() {
        const endOffset = itemOffset + itemsPerPage;
        
        setCurrentItems(filesFilter.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(filesFilter.length / itemsPerPage));
    }
    
    useEffect(loadItems, [itemOffset, itemsPerPage, filesFilter]);

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % filesFilter.length;
        setItemOffset(newOffset);
    };

    function handleRemoveFile(file) {
        if (!file)
            return console.error('file missing', file);

        const arr = files.filter((f) => f.file_id === file.file_id ? null : f);
        setFilesFilter(arr);
        loadItems();
    }

    if (!filesFilter || filesFilter.length < 1) {
        if (inputContent) {
            return (<>
                <Filter
                    files={files}
                    filesFilter={filesFilter}
                    globalSize={globalSize}
                    inputContent={inputContent}
                    setInputContent={setInputContent}
                    setFilesFilter={setFilesFilter}
                    loadItems={loadItems}
                />
                <div className={styles['no-files']}>
                    <p>Aucune correspondance pour "<b>{inputContent}</b>"</p>
                </div>
            </>);
        } else {
            return (<>
                <div className={styles['no-files']}>
                    <p>Aucun fichier</p>
                </div>
            </>);
        }
    } else {
        return (<>
            <Filter
                files={files}
                filesFilter={filesFilter}
                globalSize={globalSize}
                inputContent={inputContent}
                setInputContent={setInputContent}
                setFilesFilter={setFilesFilter}
                loadItems={loadItems}
            />
            <ul className={styles['filelist']}>
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
            <footer>
                <ReactPaginate
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={2}
                    marginPagesDisplayed={2}
                    pageCount={pageCount}
                    breakLabel='...'
                    nextLabel={'Suiv.'}
                    previousLabel={'Préc.'}
                    renderOnZeroPageCount={null}
                    containerClassName={styles['controls-page']}
                    nextClassName={`${styles['reset']} ${styles['next']}`}
                    previousClassName={`${styles['reset']} ${styles['prev']}`}
                    activeClassName={`${styles['reset']} ${styles['active']}`}
                />
            </footer>
        </>);
    }
}