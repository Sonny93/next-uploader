import React, { useEffect, useRef, useState } from 'react';
// import ReactPlayer from 'react-player/lazy';
// import 'ace-builds/src-noconflict/mode-javascript';
import { BiFile } from 'react-icons/bi';
import Loader from '../Loader';
import EditorFile from './EditorFile';

export default function FilePreview({ file }) {
    const { type, url, name, extension, size } = file;
    const contentRef = useRef();
    const [content, setContent] = useState(null);
    const [loadingContent, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            if (type === 'image') {
                setContent(<img ref={contentRef} src={url} alt={`${name} image`} />);
            } else if (type === 'video') {
                setContent(<video ref={contentRef} src={url} autoPlay controls />);
            } else if (type === 'audio') {
                setContent(<audio ref={contentRef} src={url} controls />);
            } else {
                setContent(<EditorFile file={file} />);
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
            <li>
                {name}
            </li>
            <li>
                Type: {type}/{extension}
            </li>
            <li>
                Taille: {size}
            </li>
        </ul>
    </>;
}