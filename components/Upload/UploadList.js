import { LineProgressBar } from '@frogress/line';
import { calculSize } from '../../utils';

export default function UploadList({ files, setFiles }) {
    return (
        <ul className='upload-list'>
            {files.map((file, key) => {
                const { id, customName, name, password, size, progress } = file;
                const percent = progress ? ((progress?.loaded / progress?.total) * 100).toFixed(2) : 0;

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

                if (parseInt(percent, 10) === 100) return;

                return (
                    <li className='file-upload' key={key}>
                        <div className='name'>
                            <label htmlFor='name'>
                                Nom du fichier • <span style={{ color: 'gray' }}>{name}</span>
                            </label>
                            <input 
                                onChange={(e) => onChange(e)} 
                                value={customName} 
                                style={{ width: '100%' }} 
                                id='customName' 
                                className='input-name' 
                                placeholder={`Nom original "${name}""`}
                                />
                        </div>
                        <div className='password'>
                            <label htmlFor='password'>
                                Mot de passe (optionel)
                            </label>
                            <input 
                                onChange={(e) => onChange(e)} 
                                value={password} 
                                style={{ width: '100%' }} 
                                id='password' 
                                className='input-password' 
                                placeholder='********'
                            />
                        </div>
                        <div className='progression'>
                            <LineProgressBar
                                progressColor={percent < 100 ? 'linear-gradient(to right, #78abe9, #74dad8, #ec7cac)' : 'lightgreen'}
                                percent={percent}
                                className='progression-bar'
                            />
                            <div className='div-center'>
                                <span style={{ color: '#3f88c5' }}>{calculSize(progress?.loaded || 0)}</span> sur <span style={{ color: '#3f88c5' }}>{calculSize(progress?.total || size)}</span> ({percent}%)
                            </div>
                        </div>
                    </li>
                );
            })}
        </ul>
    );
}