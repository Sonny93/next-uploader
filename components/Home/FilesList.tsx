import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import toastr from 'toastr';

import File from './File';
import Filter from './Filter';

import styles from '../../styles/home/filelist.module.scss';
import { FileFront } from '../../front';

export default function FilesList({ files, globalSize }: { files: FileFront[], globalSize: number; }) {
    const itemsPerPage = 20;
    const [inputContent, setInputContent] = useState<string>('');
    const [filesFilter, setFilesFilter] = useState<FileFront[] | []>(files);

    const [currentItems, setCurrentItems] = useState<FileFront[] | []>(filesFilter);
    const [pageCount, setPageCount] = useState<number>(0);
    const [itemOffset, setItemOffset] = useState<number>(0);

    const [contextMenu, setContextMenu] = useState<null | string>(null);

    function loadItems(): void {
        const endOffset = itemOffset + itemsPerPage;

        setCurrentItems(filesFilter.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(filesFilter.length / itemsPerPage));
    }

    useEffect(loadItems, [itemOffset, itemsPerPage, filesFilter]);

    const handlePageClick = ({ selected }: { selected: number; }) => {
        const newOffset = (selected * itemsPerPage) % filesFilter.length;
        setItemOffset(newOffset);
    }

    function handleRemoveFile(file: FileFront) {
        if (!file) {
            console.warn(`Unable to find "${file.name}" (${file.file_id})`, file);
            toastr.warning('Fichier supprimé avec succès mais impossible d\'actualiser la liste des fichiers', 'Attention');
            setContextMenu(null);
        } else {
            const newFiles = files.filter(({ file_id }) => file_id !== file.file_id ? file : null);
            setFilesFilter(newFiles);
            loadItems();
        }
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
            {pageCount > 1 && (
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
            )}
        </>);
    }
}