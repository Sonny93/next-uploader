import styles from '../../styles/file-preview/file-preview.module.scss';

export default function Image({ src, alt }) {
    return (<>
        <div className={styles['preview-wrapper']}>
            <img src={src} alt={alt} />
        </div>
    </>);
}