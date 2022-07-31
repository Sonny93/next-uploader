import { Dispatch } from '@reduxjs/toolkit';
import { NextSeo } from 'next-seo';
import { extname } from 'path';
import { DragEvent, useState } from 'react';
import { Provider, useDispatch } from 'react-redux';

import MenuNavigation from '../../components/MenuNavigation/MenuNavigation';
import UploadControls from '../../components/Upload/UploadControls';
import FilesUpload from '../../components/Upload/UploadFilesList';

import { addFile, store } from '../../components/redux';
import { FrontPageProps } from '../../front';

import styles from '../../styles/upload.module.scss';

function UploadPage({ transitionClass }: FrontPageProps): JSX.Element {
    const [isDragging, setDragging] = useState<boolean>(false);
    const [filesSelected, setFilesSelected] = useState<boolean>(false);

    const handleFiles = (files: FileList, dispatch: Dispatch) => {
        if (!files) {
            setFilesSelected(false);
        } else {
            (Array.from(files)).forEach((file) => FileFormHandle(file, dispatch));
            setFilesSelected(true);
        }
    }

    return (<>
        <NextSeo
            title={'Upload'}
            description={'Mettre en ligne un fichier'}
        />
        <div className={`${transitionClass} ${styles['page-upload']}`}>
            <MenuNavigation />
            <Provider store={store}>
                <DropZone setDragging={setDragging} handleFiles={handleFiles}>
                    <UploadControls
                        filesSelected={filesSelected}
                        setFilesSelected={setFilesSelected}
                        handleFiles={handleFiles}
                    />
                    <FilesUpload />
                </DropZone>
            </Provider>
        </div>
    </>);
}

interface DropZoneProps {
    children: JSX.Element[];
    setDragging: (value: boolean) => void;
    handleFiles: (files: FileList, dispatch: Dispatch) => void;
}
function DropZone({ children, setDragging, handleFiles }: DropZoneProps) {
    const dispatch = useDispatch();

    const handleDrag = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();

        if (event.type === 'dragenter' || event.type === 'dragover') {
            setDragging(true);
        } else {
            setDragging(false);
        }
    }

    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();

        setDragging(false);

        const files = event.dataTransfer.files;
        handleFiles(files, dispatch);
    }

    return (<>
        <div
            className={styles['wrapper-upload']}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
        >
            {children}
        </div>
    </>);
}

function FileFormHandle(file: any, dispatch: Dispatch) {
    const extension = extname(file.name);

    file.fileId = file.lastModified + Date.now()
    file.customName = extension
        ? file.name.replace(extension, '')
        : file.name;

    file.password = '';
    file.progress = {
        loaded: 0,
        total: file.size,
        percent: 0,
        inProgress: false
    };
    file.uploaded = false;
    file.error = null;

    dispatch(addFile(file));
}

UploadPage.authRequired = true;
export default UploadPage;