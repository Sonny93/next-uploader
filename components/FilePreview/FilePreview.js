import React, { useEffect, useRef, useState } from 'react';

// import ReactPlayer from 'react-player/lazy';
// import 'ace-builds/src-noconflict/mode-javascript';

import { BiFile } from 'react-icons/bi';
import Loader from '../Loader';
import EditorFile from './EditorFile';
import SongRecognition from './SongRecognition';
import Details from './Details';

export default function FilePreview({ file, music_recognition }) {
    const { url, name, fileExtension, fileMimeType, createdAt } = file;
    const contentRef = useRef();
    const [content, setContent] = useState(null);
    const [loadingContent, setLoading] = useState(false);
    
    const mime = fileMimeType.split('/');
    useEffect(() => {
        (async () => {
            if (mime[0] === 'image') {
                setContent(<img ref={contentRef} src={url} alt={`${name} image`} />);
            } else if (mime[0] === 'video') {
                setContent(<video ref={contentRef} src={url} autoPlay controls />);
            } else if (mime[0] === 'audio') {
                setContent(<audio ref={contentRef} src={url} controls />);
            } else {
                const languageFinded = languages.find(lg => lg.key === fileExtension);
                if (languageFinded) {
                    setContent(<EditorFile language={languageFinded.value} file={file} />);
                } else {
                    setContent(<BiFile style={{ fontSize: '8em' }} />);
                }
            }

            if (!contentRef.current) return;
            // else contentRef.current.addEventListener('load', () => { });
        })();
    }, [setLoading, contentRef]);

    return <>
        <div className='preview-wrapper'>
            {loadingContent && <Loader top={true} backdrop={true} />}
            {content}
        </div>
        <Details file={file} mime={mime} />
        {music_recognition ? 
            <SongRecognition music_recognition={music_recognition} /> :
            <p>Aucune musique n'a été détectée</p>}
    </>;
}

const languages = [
    { key: 'cs', value: 'csharp' }, 
    { key: 'json', value: 'json' }, 
    { key: 'plain', value: 'plain' }, 
    { key: 'js', value: 'javascript' }, 
    { key: 'html', value: 'html' }, 
    { key: 'css', value: 'css' }, 
    { key: 'txt', value: 'plain' }, 
    { key: 'md', value: 'markdown' }, 
    { key: 'xml', value: 'xml'}
];