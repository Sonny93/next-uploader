import { calculSize } from '../../utils';

import Input from '../Inputs/input';
import ProgressBar from '../Inputs/ProgressBar';

import styles from '../../styles/upload.module.scss';

import { FileUpload } from '../../front';

export default function File({ file, onChange }: { file: FileUpload; onChange: (target, name, customName) => void }) {
    const { name, password, size, progress, error } = file;
    const percent = +(progress ? ((progress?.loaded / progress?.total) * 100).toFixed(2) : 0);

    const handleInputChange = ({ target }, value) => onChange(target, name, value);

    return (
        <li className={styles['file-upload']}>
            <Input
                name={'customName'}
                label={'Nom du fichier'}
                placeholder={name}
                fieldClass={styles['field']}
                value={name}
                onChangeCallback={handleInputChange}
            />
            <Input
                name={'password'}
                label={'Mot de passe (optionnel)'}
                placeholder={'********'}
                fieldClass={styles['field']}
                value={password}
                onChangeCallback={handleInputChange}
            />
            <ProgressBar name={'upload-progress'} progress={percent}>
                {calculSize(progress?.loaded || 0)} sur {calculSize(progress?.total || size)} ({percent}%)
            </ProgressBar>
            {error && (<span style={{ color: 'red' }}>{error}</span>)}
        </li>
    );
}