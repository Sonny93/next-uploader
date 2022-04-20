import { useEffect, useRef, useState } from 'react';
import { AiFillFileAdd } from 'react-icons/ai';

import axios from 'axios';
import toastr from 'toastr';
import { extname } from 'path';

import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from '@reduxjs/toolkit';

import { FileUpload } from '../../front';

import { addFile, clearFiles, setError, setUploaded, updateProgress } from '../redux';
import styles from '../../styles/upload.module.scss';
import { Pluralize } from '../../utils';

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
                {files.length} {Pluralize('fichier', files.length)} uploadé avec succès
            </span>
            <button className={`${styles['icon-btn']} btn`} onClick={handleClearFiles}>
                Clear
            </button>
        </div>)
    }

    return (
        <div className={styles['controls']}>
            <input // à changer avec <Input />
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

async function UploadFiles(files: FileUpload[], dispatch) {
    for await (const file of files) {
        const formData = new FormData(); // Payload
        formData.append('file', file);
        formData.append('customName', file?.customName);
        formData.append('password', file?.password);

        try {
            const { data } = await axios.request({
                method: 'post',
                url: '/api/upload',
                data: formData,
                onUploadProgress: ({ loaded, total }) => dispatch(updateProgress({ file, loaded, total }))
            });

            const fileUploaded = data?.file as FileUpload;
            if (!fileUploaded) {
                console.warn('Aucun fichier retourné par le serveur', data);
            }

            dispatch(setUploaded({ file, uploaded: true }));
        } catch (error) {
            const txtError = HandleCatchError(error);
            toastr.error(txtError, 'Erreur!');
            console.error(txtError);

            dispatch(setError(txtError));
            break;
        }
    }
}

function HandleCatchError(error): string {
    let txtError: string;

    if (error.response) {
        const dataError = error.response.data?.error as string;
        if (dataError) {
            txtError = dataError;
        } else {
            txtError = 'Une erreur est survenue lors de l\'upload du fichier';
        }
    } else if (error.request) { // Aucune erreur n'a été retournée par l'api
        txtError = 'Aucune réponse envoyée par le serveur';
    } else {
        txtError = error.message;
    }

    return txtError;
}