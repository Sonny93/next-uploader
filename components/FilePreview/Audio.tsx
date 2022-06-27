import { useEffect } from 'react';
import styles from '../../styles/file-preview/file-preview.module.scss';

interface AudioPreviewProps {
    src: string;
    blob?: string;
}

export default function AudioPreview({ src, blob }: AudioPreviewProps) {
    const className = `${styles['preview-wrapper']} ${styles['audio']}`;

    return (<>
        <div className={className}>
            <audio src={blob || src} controls autoPlay={true} loop />
        </div>
    </>);
}