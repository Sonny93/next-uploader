import React, { useEffect, useRef, useState } from 'react';
// import ReactPlayer from 'react-player/lazy';
// import 'ace-builds/src-noconflict/mode-javascript';
import { BiFile } from 'react-icons/bi';
import Loader from '../Loader';
import EditorFile from './EditorFile';

export default function FilePreview({ file }) {
    const { url, name, size, fileExtension, fileMimeType } = file;
    const contentRef = useRef();
    const [content, setContent] = useState(null);
    const [loadingContent, setLoading] = useState(false);
    
    const mime = fileMimeType.split('/');
    console.log('file preview', file, mime);
    useEffect(() => {
        (async () => {
            if (mime[0] === 'image') {
                setContent(<img ref={contentRef} src={url} alt={`${name} image`} />);
            } else if (mime[0] === 'video') {
                setContent(<video ref={contentRef} src={url} autoPlay controls />);
            } else if (mime[0] === 'audio') {
                setContent(<audio ref={contentRef} src={url} controls />);
            } else {
                const languageFinded = languages.find(l => l.key === fileExtension);
                if (languageFinded) {
                    setContent(<EditorFile language={languageFinded.value} file={file} />);
                } else {
                    setContent(<BiFile style={{ fontSize: '8em' }} />);
                }
            }

            console.log(contentRef);
            if (!contentRef.current) return;
            // contentRef.current.addEventListener('load', () => { });
        })();
    }, [setLoading, contentRef]);

    console.log(content);
    return <>
        <div className='preview-wrapper'>
            {loadingContent && <Loader top={true} backdrop={true} />}
            {content}
        </div>
        <ul>
            <li style={{ marginBottom: '2px' }}>Nom: {name}</li>
            <li style={{ marginBottom: '2px' }}>Type: {mime.join(' - ')} ({fileExtension})</li>
            <li style={{ marginBottom: '2px' }}>Taille: {size}</li>
        </ul>
    </>;
}

const languages = [{
    key: 'cs',
    value: 'csharp'
}, {
    key: 'json',
    value: 'json'
}, {
    key: 'plain',
    value: 'plain'
}, {
    key: 'js',
    value: 'javascript'
}, {
    key: 'html',
    value: 'html'
}, {
    key: 'css',
    value: 'css'
}, {
    key: 'txt',
    value: 'plain'
}, {
    key: 'md',
    value: 'markdown'
}, {
    key: 'xml',
    value: 'xml'
}];