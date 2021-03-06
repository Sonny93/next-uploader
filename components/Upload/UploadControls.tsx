import { useEffect, useRef, useState } from 'react';
import { AiFillFileAdd } from 'react-icons/ai';

import { extname } from 'path';

import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from '@reduxjs/toolkit';

import { FileUpload } from '../../front';
import { addFile, clearFiles } from '../redux';
import { Pluralize, UploadFiles } from '../../utils';

import styles from '../../styles/upload.module.scss';

export default function UploadControls(): JSX.Element {
    const [uploadInProgress, setInProgress] = useState<boolean>(false);
    const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
    const [filesSelected, setFilesSelected] = useState<boolean>(false);

    const files = useSelector(({ fileUpload }: { fileUpload: FileUpload[] }) => fileUpload);
    const refInput = useRef<HTMLInputElement>(null);
    const dispatch = useDispatch();

    useEffect(() => {
        refInput.current?.value ? setFilesSelected(true) : setFilesSelected(false)
    }, [refInput.current?.value]);

    const handleFiles = ({ target }) =>
        (Array.from(target.files)).forEach((file: FileUpload) => FileFormHandle(file, dispatch));

    const handleStartUpload = () => {
        setInProgress(true);
        UploadFiles(files, dispatch)
            .then(() => setUploadSuccess(true))
            .catch(() => setUploadSuccess(false))
            .finally(() => setInProgress(false));

    }

    const handleSelectFiles = () => refInput.current.click();
    const handleClearFiles = () => {
        setInProgress(false);
        setUploadSuccess(false);
        dispatch(clearFiles({}));

        if (refInput.current?.value) {
            refInput.current.value = null;
        }
    }

    if (uploadInProgress) {
        const filesUploaded = files.filter((file) => file.uploaded);
        const percentProgress = Math.ceil((filesUploaded.length / files.length) * 100) || 0;

        return (
            <div className={styles['controls']}>
                En cours d'upload {filesUploaded.length} / {files.length} ({percentProgress} %)
            </div>
        )
    }

    if (uploadSuccess) {
        return (<div className={styles['controls']}>
            <span>
                {files.length} {Pluralize('fichier', files.length)} upload?? avec succ??s
            </span>
            <button className={`${styles['icon-btn']} btn`} onClick={handleClearFiles}>
                Clear
            </button>
        </div>)
    }

    return (
        <div className={styles['controls']}>
            <input // ?? changer avec <Input />
                type='file'
                id='file-upload'
                onChange={handleFiles}
                multiple={true}
                ref={refInput}
                className={`nostyle ${styles['input-upload']}`}
            />
            <button onClick={handleStartUpload} disabled={uploadInProgress || !filesSelected}>
                Envoyer {files.length} {Pluralize('fichier', files.length)}
            </button>
            {!filesSelected ? (
                <button className={`${styles['icon-btn']} btn`} onClick={handleSelectFiles}>
                    <AiFillFileAdd />
                </button>
            ) : (
                <button className={`${styles['icon-btn']} btn`} onClick={handleClearFiles}>
                    Clear
                </button>
            )}
        </div>
    )
}

function FileFormHandle(file: FileUpload, dispatch: Dispatch) {
    const extension = extname(file.name);

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