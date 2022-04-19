import Link from 'next/link';
import axios from 'axios';

import { calculSize } from '../../utils';

import Input from '../Inputs/input';
import ProgressBar from '../Inputs/ProgressBar';

import styles from '../../styles/upload.module.scss';

import { FileUpload } from '../../front';
import { useDispatch } from 'react-redux';
import { setName, setPassword } from '../redux';

export default function FileItemUpload({ file }: { file: FileUpload }) {
    const { name, customName, password, progress, error } = file;
    const dispatch = useDispatch();

    console.log(file.progress)

    return (
        <li className={styles['file-upload']}>
            <Input
                name='customName'
                label='Nom du fichier'
                placeholder={name}
                fieldClass={styles['field']}
                value={customName}
                onChangeCallback={({ target }) => dispatch(setName({ file, name: target.value }))}
            />
            <Input
                name='password'
                label='Mot de passe (optionnel)'
                type='password'
                placeholder='********'
                fieldClass={styles['field']}
                value={password}
                onChangeCallback={({ target }) => dispatch(setPassword({ file, password: target.value }))}
            />
            {progress !== null && (
                <ProgressBar name={'upload-progress'} progress={progress}>
                    {calculSize(progress.loaded)} sur {calculSize(progress.total)} ({progress.percent} %)
                </ProgressBar>
            )}
            {error && (<span style={{ color: 'red' }}>{error}</span>)}
        </li>
    );
}