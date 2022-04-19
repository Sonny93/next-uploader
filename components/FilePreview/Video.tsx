import styles from '../../styles/file-preview/file-preview.module.scss';

export default function Video({ src, blob }: { src: string; blob?: string; }) {
    const className = `${styles['preview-wrapper']} ${styles['video']}`;
    return (<>
        <div className={className}>
            <video src={blob || src} controls autoPlay={true} loop />
        </div>
    </>);
}