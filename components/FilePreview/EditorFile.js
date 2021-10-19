import { useEffect, useState } from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';

export default function EditorFile({ file, language }) {
    const { url } = file;
    const [content, setContent] = useState(null);
    const monaco = useMonaco();

    useEffect(() => {
        (async () => {
            const contentRequest = await fetch(url).then(response => response.text());
            setContent(contentRequest);
        })();
    }, []);
    
    useEffect(() => {
        if (monaco) {
            console.log('here is the monaco isntance:', monaco);
        }
    }, [monaco]);

    console.log('language', language);
    if (content) {
        return <Editor defaultLanguage={language} theme='vs-dark' defaultValue={content} className='code-editor' />
    } else {
        return <>
            Chargement du fichier en cours
        </>;
    }
}