import { useState } from 'react';
import { useDispatch } from 'react-redux';
import Link from 'next/link';

import Input from '../Inputs/Input';
import ProgressBar from '../Inputs/ProgressBar';
import Switch from '../Inputs/Switch';
import MessageManager from '../MessageManager';

import { FileUpload } from '../../front';
import { deleteFile, setName, setPassword } from '../redux';

import styles from '../../styles/upload.module.scss';

export default function FileItemUpload({ file }: { file: FileUpload }) {
	const [isPasswordEnabled, setPasswordEnabled] = useState<boolean>(false);

	const { fileId, name, customName, password, progress, uploaded, error } = file;
	const dispatch = useDispatch();

	const handleChangeName = ({ target }) => dispatch(setName({ file, name: target.value }));
	const handleChangePassword = ({ target }) => dispatch(setPassword({ file, password: target.value }));
	const handleSwitchChange = (isChecked: boolean) => {
		dispatch(setPassword({ file, password: '' }));
		setPasswordEnabled(isChecked);
	}

	return (<>
		<li className={styles['file-upload']}>
			<Input
				name={'customName' + fileId}
				label='Nom du fichier'
				placeholder={name}
				fieldClass={styles['field']}
				value={customName}
				onChangeCallback={handleChangeName}
				disabled={uploaded || progress.inProgress}
			/>
			<label>
				Mot de passe
				<Switch
					checked={isPasswordEnabled}
					onChange={handleSwitchChange}
					disabled={uploaded || progress.inProgress}
				/>
			</label>
			{isPasswordEnabled && (<>
				<Input
					name={'password' + fileId}
					type='password'
					placeholder='********'
					fieldClass={styles['field']}
					value={password}
					onChangeCallback={handleChangePassword}
					disabled={uploaded || progress.inProgress}
				/>
			</>)}
			{progress.percent !== 0 && progress.percent !== 100 && (
				<ProgressBar name={'upload-progress'} progress={progress} />
			)}
			{uploaded && (<>
				<div style={{ display: 'flex', flexDirection: 'column' }}>
					<Link href={'/file/' + fileId}>
						<a style={{ width: 'fit-content' }}>Lien vers le fichier</a>
					</Link>
				</div>
			</>)}
			{!uploaded && (<>
				<button
					type='button'
					className={styles['remove-file']}
					disabled={progress.inProgress}
					onClick={() => dispatch(deleteFile(file))}
				>
					Retirer
				</button>
			</>)}
			<MessageManager error={error} />
		</li>
	</>);
}