import { useEffect } from 'react';
import styles from '../../styles/file-preview/file-preview.module.scss';

interface ImagePreviewProps {
    src: string;
    blob?: string;
    alt: string;
}

export default function ImagePreview({ src, blob, alt }: ImagePreviewProps) {
    const className = `${styles['preview-wrapper']} ${styles['image']}`;

    return (<>
        <div className={className}>
            <img src={blob || src} alt={alt} />
        </div>
    </>);
}