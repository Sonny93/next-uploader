import { useRef, useState } from 'react';
import { getSession, useSession } from 'next-auth/client';
import { AiFillFileAdd } from 'react-icons/ai';

import axios from 'axios';
import toastr from 'toastr';

import UploadList from '../../components/Upload/UploadList';
import MenuNavigation from '../../components/MenuNavigation/MenuNavigation';

import styles from '../../styles/upload.module.scss';

export default function Upload() {
    const session = useSession();
    const refInput = useRef();
    const [files, setFiles] = useState([]);

    function handleFiles(event) {
        const filesInput = event.target.files;
        const files = (Array.from(filesInput)).map((file) => {
            file.customName = file.name;
            file.password = '';
            file.progress = null;
            file.uploaded = false;
            file.errorr = null;
            return file;
        });
        setFiles(files);
    }

    return (<>
        <div className={styles['upload']}>
            <MenuNavigation session={session} />
            <div className={styles['wrapper']}>
                {files && files.length > 0 ?
                    <UploadList files={files} setFiles={setFiles} /> :
                    <div className={styles['no-file']}>
                        <p>Aucun fichier</p>
                    </div>}
                <div className={styles['controls']}>
                    <input
                        type='file'
                        id='file-upload'
                        onChange={handleFiles}
                        multiple={true}
                        ref={refInput}
                        className={`nostyle ${styles['input-upload']}`}
                    />
                    <button
                        onClick={() => UploadFiles(files, setFiles, refInput)}
                        disabled={files.length < 1 || !refInput?.current ? true : false}
                    >
                        Envoyer {files.length > 0 ? `(${files.length} fichier${files.length > 1 ? 's' : ''})` : null}
                    </button>
                    <button className={`${styles['icon-btn']} btn`} onClick={() => refInput?.current?.click()}>
                        <AiFillFileAdd />
                    </button>
                </div>
            </div>
        </div>
    </>);
}

async function UploadFiles(files, setFiles, refInput) {
    // On vérifie si l'utilisateur a bien sélectionné des fichiers
    if (!files || files?.length < 1) return;
    for await (const file of files) {
        const fileIndex = files.findIndex(f => f.name === file.name);
        if (fileIndex === -1) return;

        const formData = new FormData();
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

                // On affiche un message d'erreur 
                if (error.response) {
                    const dataError = error.response.data?.error;
                    if (dataError) {
                        toastr.error(dataError, 'Upload error');
                        files[fileIndex].error = dataError;
                    } else {
                        toastr.error('Upload error');
                        files[fileIndex].error = 'Une erreur est survenue lors de l\'upload du fichier';
                    }
                } else if (error.request) {
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

    // On récupère la liste des fichiers uploadés avec succès
    const uploadedFiles = files.filter((file) => file?.uploaded);
    if (uploadedFiles.length < 1)
        toastr.info(`Aucun fichier n'a été uploadé`);
    else
        toastr.success(`${uploadedFiles.length} fichier(s) uploadés`);

    // Remove files uploaded
    setFiles((filesPrev) => {
        const files = [...filesPrev];
        return files.filter(file => file?.uploaded ? null : file);
    });

    // Clear input content
    refInput.current.value = null;
    console.log(refInput.current, refInput.current.files);
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

    return {
        props: { session }
    }
}