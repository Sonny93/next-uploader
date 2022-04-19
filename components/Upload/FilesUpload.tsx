import { ImFileEmpty } from "react-icons/im";

import FileItem from './FileItem';

import styles from '../../styles/upload.module.scss';

import { FileUpload } from "../../front";

// changer type setFiles
export default function FilesUpload({ files, setFiles }: { files: FileUpload[], setFiles: any }) {
    const onChange = (target, name, value) => {
        setFiles((filesProps: FileUpload[]) => {
            const newFiles = [...filesProps];
            const fileIndex: number = newFiles.findIndex(f => f.name === name);
            const type = target.id;

            newFiles[fileIndex][type] = value;

            return newFiles;
        });
    }

    if (files && files.length > 0) {
        return (
            <ul className={styles['upload-list']}>
                {files.map((file, key) => (
                    <FileItem file={file} key={key} onChange={onChange} />
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