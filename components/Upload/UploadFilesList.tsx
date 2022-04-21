import { ImFileEmpty } from "react-icons/im";

import FileUploadItem from './UploadFileItem';

import styles from '../../styles/upload.module.scss';

import { FileUpload } from "../../front";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { clearFiles } from "../redux";
;
export default function FilesUpload() {
    const files = useSelector(({ fileUpload }: { fileUpload: FileUpload[] }) => fileUpload);
    const dispatch = useDispatch();

    useEffect(() => { dispatch(clearFiles(null)) }, [dispatch]);

    if (files.length > 0) {
        return (
            <ul className={styles['upload-list']}>
                {files.map((file, key) => (
                    <FileUploadItem file={file} key={key} />
                ))}
            </ul>
        );
    } else {
        return (
            <div className={styles['no-file']}>
                <ImFileEmpty />
                <span>
                    Aucun fichier
                </span>
            </div>
        );
    }
}