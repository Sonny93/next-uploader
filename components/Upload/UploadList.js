import FileItem from './FileItem';

import styles from '../../styles/upload.module.scss';

export default function UploadList({ files, setFiles }) {
    return (
        <ul className={styles['upload-list']}>
            {files.map((file, key) => {
                function onChange(event) {
                    setFiles((prevFiles, file_id) => {
                        const newFiles = prevFiles.map((file) => {
                            if (file.id !== file_id) return file;
                            file[event.target.id] = event.target.value;
                            
                            return file;
                        });
                        return newFiles;
                    });
                }
            
                if (file)
                    return <FileItem file={file} key={key} onChange={onChange} />
            })}
        </ul>
    );
}