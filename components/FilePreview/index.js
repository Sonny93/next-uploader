import React, { useEffect, useRef, useState } from 'react';
// import ReactPlayer from 'react-player/lazy';
// import 'ace-builds/src-noconflict/mode-javascript';
import { BiFile } from 'react-icons/bi';
import Loader from '../Loader';
import EditorFile from './EditorFile';

export default function FilePreview({ file }) {
    const { url, name, size, fileMimeType } = file;
    const contentRef = useRef();
    const [content, setContent] = useState(null);
    const [loadingContent, setLoading] = useState(false);
    
    const mime = fileMimeType.split('/');
    console.log('file preview', file, mime);
    useEffect(() => {
        (async () => {
            switch (mime[0]) {
                case 'image':
                    setContent(<img ref={contentRef} src={url} alt={`${name} image`} />);
                    break;

                case 'video':
                    setContent(<video ref={contentRef} src={url} autoPlay controls />);
                    break;

                case 'audio':
                    setContent(<audio ref={contentRef} src={url} controls />);
                    break;

                case 'text':
                    setContent(<EditorFile language={mime[1]} file={file} />);
                    break;

                default:
                    setContent(<BiFile style={{ fontSize: '8em' }} />);
                    break;
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
            <li style={{ marginBottom: '2px' }}>Type: {mime.join(' - ')}</li>
            <li style={{ marginBottom: '2px' }}>Taille: {size}</li>
        </ul>
    </>;
}