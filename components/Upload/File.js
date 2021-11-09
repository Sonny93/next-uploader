import { LineProgressBar } from '@frogress/line';
import { calculSize } from '../../utils';

export default function File({ file, onChange }) {
    console.log('file props', file);
    const { customName, name, password, size, progress, error } = file;
    const percent = progress ? ((progress?.loaded / progress?.total) * 100).toFixed(2) : 0;

    return (
        <li className='file-upload'>
            <div className='name'>
                <label htmlFor='name'>
                    Nom du fichier • <span style={{ color: 'gray' }}>{name}</span>
                    {error && <span style={{ color: 'crimson' }}> • {error}</span>}
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
            {percent > 0 && <div className='progression'>
                <LineProgressBar
                    progressColor={percent < 100 ? 'linear-gradient(to right, #78abe9, #74dad8, #ec7cac)' : 'lightgreen'}
                    percent={percent}
                    className='progression-bar'
                />
                <div className='div-center'>
                    <span style={{ color: '#3f88c5' }}>{calculSize(progress?.loaded || 0)}</span> sur <span style={{ color: '#3f88c5' }}>{calculSize(progress?.total || size)}</span> ({percent}%)
                </div>
            </div>}
        </li>
    );
}