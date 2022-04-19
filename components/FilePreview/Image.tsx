import styles from '../../styles/file-preview/file-preview.module.scss';

export default function Image({ src, blob, alt }: { src: string; blob?: string; alt: string; }) {
    const className = `${styles['preview-wrapper']} ${styles['image']}`;
    return (<>
        <div className={className}>
            <img src={blob || src} alt={alt} />
        </div>
    </>);
}