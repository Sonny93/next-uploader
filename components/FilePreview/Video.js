import styles from '../../styles/file-preview/file-preview.module.scss';

export default function Video({ src }) {
    return (<>
        <div className={styles['preview-wrapper']}>
            <video src={src} controls autoPlay={false} loop />
        </div>
    </>);
}