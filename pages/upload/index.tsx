import { useRef, useState } from 'react';
import { getSession, useSession } from 'next-auth/react';
import { AiFillFileAdd } from 'react-icons/ai';

import { extname } from 'path';
import axios from 'axios';
import toastr from 'toastr';

import Meta from '../../components/Meta/Meta';
import MenuNavigation from '../../components/MenuNavigation/MenuNavigation';
import FilesUpload from '../../components/Upload/UploadFilesList';

import styles from '../../styles/upload.module.scss';

import { FileUpload, FrontPageProps } from '../../front';
import UploadControls from '../../components/Upload/UploadControls';
import { Provider } from 'react-redux';
import { store } from '../../components/redux';

export default function Upload({ transitionClass }: FrontPageProps): JSX.Element {
    const { data: session } = useSession();

    return (<>
        <Meta description='Uploder un nouveau fichier' />
        <div className={`${transitionClass} ${styles['upload']}`}>
            <MenuNavigation session={session} />
            <Provider store={store}>
                <div className={styles['wrapper']}>
                    <FilesUpload />
                    <UploadControls />
                </div>
            </Provider>
        </div>
    </>);
}

/**
 * Fonction permettant de gérer l'upload des fichiers
 * @param {Array} files Liste des fichiers à upload 
 * @param {Function} setFiles Fonction callback useState
 * @param {*} refInput Référence à l'input files
 * @returns {null} Ne retourne rien
 */
async function UploadFiles(files, setFiles, refInput) {
    // On vérifie si l'utilisateur a bien sélectionné des fichiers
    if (!files || files?.length < 1) return;
    for await (const file of files) {
        const fileIndex = files.findIndex(f => f.name === file.name);
        if (fileIndex === -1) return;

        // On créer un objet qui sera envoyé et traité par l'api
        const formData = new FormData();
        console.log(file);
        formData.append('file', file);
        formData.append('customName', file?.customName);
        formData.append('password', file?.password);

        try {
            // On traite l'upload d'un fichier
            const { data } = await axios.request({
                method: 'post',
                url: '/api/upload',
                data: formData,
                onUploadProgress: (progress) => {
                    // On récupère la progression de chaque upload
                    setFiles((filesPrev) => {
                        const files = [...filesPrev];
                        files[fileIndex].progress = progress;
                        files[fileIndex].error = null;

                        return files;
                    });
                }
            });

            // On vérifie si le serveur un fichier
            if (!data?.file)
                toastr.warning(`Veuillez rafraîchir la page pour avoir le fichier uploadé`);

            // Tout s'est bien passé pour le fichier courant
            setFiles((filesPrev) => {
                const files = [...filesPrev];
                files[fileIndex].uploaded = true;

                return files;
            });
        } catch (error) {
            // Une erreur est survenue
            setFiles((filesPrev) => {
                const files = [...filesPrev];
                files[fileIndex].progress = null;
                files[fileIndex].uploaded = false;

                // On affiche le message d'erreur 
                if (error.response) {
                    const dataError = error.response.data?.error;
                    if (dataError) {
                        toastr.error(dataError, 'Upload error');
                        files[fileIndex].error = dataError;
                    } else {
                        toastr.error('Upload error');
                        files[fileIndex].error = 'Une erreur est survenue lors de l\'upload du fichier';
                    }
                } else if (error.request) { // Aucune erreur n'a été retournée par l'api
                    toastr.error('Aucune réponse envoyée par le serveur', 'Upload error');
                    files[fileIndex].error = 'Aucune réponse envoyée par le serveur';
                    console.error(error.request);
                } else {
                    console.error('Error', error.message);
                    files[fileIndex].error = error.message;
                }

                return files;
            });

            // On arrête l'upload des fichiers suivants (utile notamment si l'utilisateur n'est pas connecté et qu'il essaye d'upload)
            break;
        }
    }

    // On supprime les fichiers de l'input files
    refInput.current.value = null;
}

export async function getServerSideProps(context) {
    const session = await getSession(context);

    // Vérifie si l'utilisateur est connecté, si ce n'est pas le cas, on le redirige vers l'accueil
    if (!session) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    // On retourne un objet qui servira de contexte pour la page
    return {
        props: { session }
    }
}