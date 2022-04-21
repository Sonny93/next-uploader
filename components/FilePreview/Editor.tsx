import { useEffect, useState } from 'react';

import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('typescript', typescript);

import 'highlight.js/styles/tokyo-night-dark.css';

import Loader from '../Loader/Loader';
import styles from '../../styles/file-preview/file-preview.module.scss';
import { FileFront } from '../../front';

interface EditorPreviewProps {
    file: FileFront;
    blob: string;
}

export default function EditorPreview({ file, blob }: EditorPreviewProps) {
    const { url } = file;
    const [content, setContent] = useState(null);

    useEffect(() => {
        (async () => {
            const contentRequest = await fetch(blob || url).then(response => response.text());
            setContent(contentRequest);
        })();
        return () => setContent(null);
    }, [url, blob]);

    const className = `${styles['preview-wrapper']} ${styles['code-editor']}`;
    if (content) {
        return (
            <div className={className}>
                <pre>
                    <code dangerouslySetInnerHTML={{ __html: hljs.highlight('typescript', content).value }} />
                </pre>
            </div>
        );
    } else {
        return (
            <div className={className}>
                <Loader top={true} backdrop={true} />
            </div>
        );
    }
}