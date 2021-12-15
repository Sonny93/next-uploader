import styles from '../../styles/file-preview/file-preview.module.scss';

export default function Audio({ src }) {
    return (<>
        <div className={styles['preview-wrapper']}>
            <audio src={src} controls />
        </div>
    </>);
}