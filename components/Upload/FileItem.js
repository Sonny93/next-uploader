import { LineProgressBar } from '@frogress/line';
import { calculSize } from '../../utils';

import styles from '../../styles/upload.module.scss';

export default function File({ file, onChange }) {
    const { customName, name, password, size, progress, error } = file;
    const percent = progress ? ((progress?.loaded / progress?.total) * 100).toFixed(2) : 0;
    
    return (
        <li className={styles['file-upload']}>
            <div className={styles['name']}>
                <label htmlFor='customName'>
                    Nom du fichier
                </label>
                <input
                    onChange={(e) => onChange(e, name, customName)}
                    value={customName}
                    data-id='customName'
                    className={styles['input-name']}
                    placeholder={`Nom original "${name}"`}
                />
            </div>
            <div className={styles['password']}>
                <label htmlFor='password'>
                    Mot de passe (optionnel)
                </label>
                <input
                    onChange={(e) => onChange(e, name, password)}
                    value={password}
                    type='password'
                    data-id='password'
                    className={styles['input-password']}
                    placeholder='********'
                />
            </div>
            {error ? <div className={styles['progression']}>
                <LineProgressBar
                    progressColor={'crimson'}
                    percent={100}
                    className='progression-bar'
                />
                <div className={styles['div-center']}>
                    <span style={{ color: 'white' }}>{error}</span>
                </div>
            </div> : percent > 0 ? <div className={styles['progression']}>
                <LineProgressBar
                    progressColor={percent < 100 ? 'linear-gradient(to right, #78abe9, #74dad8, #ec7cac)' : '#00bd00'}
                    percent={percent}
                    className='progression-bar'
                />
                <div className={styles['div-center']}>
                    <span style={{ color: '#3f88c5' }}>{calculSize(progress?.loaded || 0)}</span> 
                    {' '}sur <span style={{ color: '#3f88c5' }}>{calculSize(progress?.total || size)}</span> ({percent}%)
                </div>
            </div> : null}
        </li>
    );
}