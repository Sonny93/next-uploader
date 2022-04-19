import { useRef } from 'react';
import { AiFillFileAdd } from 'react-icons/ai';

import { extname } from 'path';

import styles from '../../styles/upload.module.scss';
import { FileUpload } from '../../front';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from '@reduxjs/toolkit';
import Input from '../Inputs/input';
import { addFile, setError, setUploaded, updateProgress } from '../redux';
import axios from 'axios';
import toastr from 'toastr';

export default function UploadControls(): JSX.Element {
    const files = useSelector(({ fileUpload }: { fileUpload: FileUpload[] }) => fileUpload);
    const refInput = useRef();
    const dispatch = useDispatch();

    const handleFiles = ({ target }) =>
        (Array.from(target.files)).forEach((file: FileUpload) => FileFormHandle(file, dispatch));

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
            <button onClick={async () => {
                await UploadFiles(files, dispatch)
                // @ts-ignore
                refInput?.current.value = null;
            }}>
                Envoyer {files.length} fichier
            </button>
            {/* @ts-ignore */}
            <button className={`${styles['icon-btn']} btn`} onClick={() => refInput?.current?.click()}>
                <AiFillFileAdd />
            </button>
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
                onUploadProgress: ({ loaded }: { loaded: number; }) => {
                    console.log(loaded);
                    dispatch(updateProgress({ file, loaded }))
                }
            });

            const fileUploaded = data?.file as FileUpload;
            if (!fileUploaded) {
                toastr.warning('Veuillez rafraîchir la page pour avoir le fichier uploadé', 'Avertissement');
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