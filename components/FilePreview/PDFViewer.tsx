import styles from '../../styles/file-preview/file-preview.module.scss';

export default function PDFViewer({ src, blob }: { src: string; blob?: string; }) {
    const className = `${styles['preview-wrapper']} ${styles['pdf']}`;
    return (<>
        <div className={className}>
            <iframe src={blob || src} frameBorder='0' title={`PDF : ${src}`} />
        </div>
    </>);
}