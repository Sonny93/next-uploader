import styles from '../../styles/file-preview/file-preview.module.scss';

export default function Audio({ src, blob }: { src: string; blob?: string; }) {
    const className = `${styles['preview-wrapper']} ${styles['audio']}`;
    return (<>
        <div className={className}>
            <audio src={blob || src} controls autoPlay={true} loop />
        </div>
    </>);
}