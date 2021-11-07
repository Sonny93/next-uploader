import Link from 'next/link';
import dayjs from 'dayjs';

import { AiOutlineFileImage, AiOutlineVideoCamera } from 'react-icons/ai';
import { BiFile } from 'react-icons/bi';
import { FaRegFileAudio } from 'react-icons/fa';
import { DiJavascript1, DiCss3, DiHtml5 } from 'react-icons/di';

import { Transition } from 'react-transition-group';
import { useEffect, useState } from 'react';

const transitionStyles = {
    entering: { opacity: 0 },
    entered: { opacity: 1 },
    exiting: { opacity: 1 },
    exited: { opacity: 0 }
};

export default function File({ file, index }) {
    const { file_id, name, size, fileMimeType, createdAt } = file;
    const mime = fileMimeType.split('/');

    const [icon, setIcon] = useState(null);

    useEffect(() => {
        if (mime[0] === 'image') {
            setIcon(<AiOutlineFileImage />);
        } else if (mime[0] === 'video') {
            setIcon(<AiOutlineVideoCamera />);
        } else if (mime[0] === 'audio') {
            setIcon(<FaRegFileAudio />);
        } else {
            if (mime[1] === 'javascript') {
                setIcon(<DiJavascript1 />);
            } else if (mime[1] === 'html') {
                setIcon(<DiHtml5 />);
            } else if (mime[1] === 'css') {
                setIcon(<DiCss3 />);
            } else {
                setIcon(<BiFile />);
            }
        }
    }, [setIcon]);

    return (
        <Transition in={!!icon} timeout={0}>
            {state => (<>
                <li className='file' style={{ 
                    opacity: 0,
                    transition: `${index * 75}ms, transform .05s, box-shadow .05s`,
                    ...transitionStyles[state]
                 }}>
                    <Link href={`/file/${file_id}`}>
                        <a>
                            <div className='icon-btn'>
                                {icon}
                            </div>
                            <div className='meta'>
                                <span className='name'>
                                    {name}
                                </span>
                                <span className='details'>
                                    <span style={{ color: '#3f88c5', fontWeight: '600' }}>{size}</span> - <span style={{ color: 'grey' }}>{dayjs(createdAt).format('D MMMM YYYY à HH:mm')}</span>
                                </span>
                            </div>
                        </a>
                    </Link>
                </li>
            </>)}

        </Transition>
    )
}