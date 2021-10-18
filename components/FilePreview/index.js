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
            switch (type) {
                case 'image':
                    setContent(<img ref={contentRef} src={url} alt={`${name} image`} />);
                    break;

                case 'video':
                    setContent(<video ref={contentRef} src={url} autoPlay controls />);
                    break;

                case 'audio':
                    setContent(<audio ref={contentRef} src={url} controls />);
                    break;
                default:
                    if (extension === 'js' || extension === 'cs') {
                        setContent(<EditorFile beforeMount={handleEditorWillMount} file={file} />);
                    } else {
                        setContent(<BiFile style={{ fontSize: '8em' }} />);
                    }
                    break;
            }

            console.log(contentRef);
            if (!contentRef.current) return;
            // contentRef.current.addEventListener('load', () => { });
        })();
    }, [setLoading, contentRef]);

    function handleEditorWillMount(monaco) {
        // here is the monaco instance
        // do something before editor is mounted
        console.log('monaco.languages', monaco.languages);
    }

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