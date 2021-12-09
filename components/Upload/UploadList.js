import FileItem from './FileItem';

import styles from '../../styles/upload.module.scss';

export default function UploadList({ files, setFiles }) {
    function onChange(event, name, value) {
        event.preventDefault();
        setFiles((prevFiles) => {
            const type = event.target.dataset.id;
            console.group(name, type, value);
            console.log('name', name);
            console.log('type', type);
            console.log('value', value);
            const newFiles = prevFiles.map((file) => {
                if (file.name !== name) {
                    console.log('no edit')
                    return file;
                } else {
                    console.log('edit', file);
                    file[type] = value;
                    console.log('edited', file);
                    return file;
                }
            });
            console.groupEnd();
            return newFiles;
        });
    }

    return (
        <ul className={styles['upload-list']}>
            {files.map((file, key) => file ? <FileItem file={file} key={key} onChange={onChange} /> : null )}
        </ul>
    );
}