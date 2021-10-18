import { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';

export default function EditorFile({ file, beforeMount }) {
    const { url, extension } = file;
    const [content, setContent] = useState(null);

    useEffect(() => {
        (async () => {
            const contentRequest = await fetch(url).then(response => response.text());
            setContent(contentRequest);
        })();
    }, []);

    let language;
    switch (extension) {
        case 'js':
            language = 'javascript';
            break;

        case 'html':
            language = 'html';
            break;

        case 'css':
            language = 'css';
            break;

        case 'txt':
            language = '';
            break;

        case 'csharp' || 'cs':
            language = 'csharp';
            break;
    
        default:
            break;
    }

    if (content) {
        return <Editor beforeMount={beforeMount} defaultLanguage={language} theme='vs-dark' defaultValue={content} className='code-editor' />
    } else {
        return <>
            Chargement du fichier en cours
        </>;
    }
}