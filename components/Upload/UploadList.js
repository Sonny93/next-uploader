import File from './File';

export default function UploadList({ files, setFiles }) {
    return (
        <ul className='upload-list'>
            {files.map((file, key) => {
                function onChange(event) {
                    setFiles((prevFiles) => {
                        const newFiles = prevFiles.map((file) => {
                            if (file.id !== id) return file;
                            file[event.target.id] = event.target.value;
                            
                            return file;
                        });
                        return newFiles;
                    });
                }
            
                if (file)
                    return <File file={file} key={key} onChange={onChange} />
            })}
        </ul>
    );
}