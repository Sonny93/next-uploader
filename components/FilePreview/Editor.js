import { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';

import Loader from '../Loader/Loader';
import styles from '../../styles/file-preview/file-preview.module.scss';

export default function EditorFile({ file, language }) {
    const { url } = file;
    const [content, setContent] = useState(null);

    useEffect(() => {
        (async () => {
            const contentRequest = await fetch(url).then(response => response.text());
            setContent(contentRequest);
        })();
        return () => setContent(null);
    }, [url]);

    if (content) {
        return (
            <div className={styles['preview-wrapper']}>
                <Editor defaultLanguage={language} theme='vs-dark' defaultValue={content} className='code-editor' />
            </div>
        );
    } else {
        return (
            <div className={styles['preview-wrapper']}>
                <Loader top={true} backdrop={true} />
            </div>
        );
    }
}