import React from 'react';

import styles from '../../styles/file-preview/file-preview.module.scss';

export default function PDFViewer({ src }) {
    return (<>
        <div className={styles['preview-wrapper']}>
            <iframe style={{ flex: '1', width: '100%' }} src={src} frameborder='0' title={`PDF : ${src}`} />
        </div>
    </>);
}