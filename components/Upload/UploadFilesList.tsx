import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import FileUploadItem from './UploadFileItem';

import { FileUpload } from '../../front';
import { clearFiles } from '../redux';

import styles from '../../styles/upload.module.scss';
import { BsUpload } from 'react-icons/bs';

export default function FilesUpload() {
	const files = useSelector(({ fileUpload }: { fileUpload: FileUpload[] }) => fileUpload);
	const dispatch = useDispatch();

	useEffect(() => { dispatch(clearFiles(null)) }, [dispatch]);

	if (files.length > 0) {
		return (<>
			<ul className={styles['upload-list']}>
				{files.map((file) => (
					<FileUploadItem file={file} key={file.fileId} />
				))}
			</ul>
		</>);
	}

	return (<NoFile />);
}

function NoFile() {
	return (<>
		<div className={styles['no-file']}>
			<div className={styles['icon']}>
				<BsUpload />
			</div>
			<div className={styles['details']}>
				Faites glisser vos documents ou cliquez sur le bouton "Parcourir les fichiers"
			</div>
		</div>
	</>)
}