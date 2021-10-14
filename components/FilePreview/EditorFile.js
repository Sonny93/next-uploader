import { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';

export default function EditorFile({ file }) {
    const { url } = file;
    const [content, setContent] = useState(null);

    useEffect(() => {
        (async () => {
            const contentRequest = await fetch(url).then(response => response.text());
            setContent(contentRequest);
        })();
    }, []);

    if (content) {
        return <Editor defaultLanguage='javascript' defaultValue={content} />
    } else {
        return <>
            Chargement du fichier en cours
        </>;
    }
}