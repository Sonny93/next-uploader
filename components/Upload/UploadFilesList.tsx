import { ImFileEmpty } from "react-icons/im";

import FileUploadItem from './UploadFileItem';

import styles from '../../styles/upload.module.scss';

import { FileUpload } from "../../front";
import { useSelector } from "react-redux";
;
export default function FilesUpload() {
    const files = useSelector(({ fileUpload }: { fileUpload: FileUpload[] }) => fileUpload);

    console.log('files là', files)
    if (files && files.length > 0) {
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