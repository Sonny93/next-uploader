import { useEffect, useRef, useState } from 'react';

import { BsUpload } from 'react-icons/bs';

import { useDispatch, useSelector } from 'react-redux';

import { FileUpload } from '../../front';
import { Pluralize, UploadFiles } from '../../utils';
import { clearFiles } from '../redux';

import styles from '../../styles/upload.module.scss';
import { Dispatch } from '@reduxjs/toolkit';

interface UploadControlsProps {
	filesSelected: boolean;
	setFilesSelected: (value: boolean) => void;
	handleFiles: (files: FileList, dispatch: Dispatch) => void;
}
export default function UploadControls({ filesSelected, setFilesSelected, handleFiles }: UploadControlsProps): JSX.Element {
	const [uploadInProgress, setInProgress] = useState<boolean>(false);
	const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);

	const files = useSelector(({ fileUpload }: { fileUpload: FileUpload[] }) => fileUpload);
	const refInput = useRef<HTMLInputElement>(null);
	const dispatch = useDispatch();

	useEffect(() => {
		if (files.length > 0) {
			setFilesSelected(true);
		} else {
			setFilesSelected(false);
		}
	})

	const handleStartUpload = () => {
		setInProgress(true);
		UploadFiles(files, dispatch)
			.then(() => setUploadSuccess(true))
			.catch(() => setUploadSuccess(false))
			.finally(() => setInProgress(false));

	}

	const handleSelectFiles = () => refInput.current.click();
	const handleClearFiles = () => {
		setInProgress(false);
		setUploadSuccess(false);
		setFilesSelected(false);
		dispatch(clearFiles({}));

		if (refInput.current?.value) {
			refInput.current.value = null;
		}
	}

	if (uploadInProgress) {
		const filesUploaded = files.filter((file) => file.uploaded);
		const percentProgress = Math.ceil((filesUploaded.length / files.length) * 100) || 0;

		return (<>
			<div className={styles['controls']}>
				En cours d'upload {filesUploaded.length} / {files.length} ({percentProgress} %)
			</div>
		</>);
	}

	return (<>
		<div className={styles['controls']}>
			<input
				type='file'
				id='file-upload'
				onChange={({ target }) => handleFiles(target.files, dispatch)}
				multiple={true}
				ref={refInput}
				className={styles['input-upload']}
			/>
			<button className={`${styles['icon-btn']} btn`} onClick={handleSelectFiles} disabled={uploadInProgress || uploadSuccess}>
				<BsUpload /> Parcourir les fichiers
			</button>
			<button className={`${styles['icon-btn']} btn`} onClick={handleClearFiles} disabled={uploadInProgress || !filesSelected}>
				Effacer la sélection
			</button>
			<button onClick={handleStartUpload} disabled={uploadInProgress || !filesSelected || uploadSuccess}>
				Envoyer {files.length} {Pluralize('fichier', files.length)}
			</button>
		</div>
	</>);
}