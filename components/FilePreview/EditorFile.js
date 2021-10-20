import { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';

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

    console.log('language', language);
    if (content) {
        return <Editor defaultLanguage={language} theme='vs-dark' defaultValue={content} className='code-editor' />
    } else {
        return <p>Chargement du fichier en cours</p>;
    }
}