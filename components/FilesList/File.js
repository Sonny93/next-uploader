import Link from 'next/link';
import dayjs from 'dayjs';
import toastr from 'toastr';

import { AiOutlineFileImage, AiOutlineVideoCamera } from 'react-icons/ai';
import { BiFile } from 'react-icons/bi';
import { FaRegFileAudio } from 'react-icons/fa';
import { DiJavascript1, DiCss3, DiHtml5 } from 'react-icons/di';

import { useEffect, useState } from 'react';

import styles from '../../styles/home/filelist.module.scss';

export default function File({ file, index, contextMenu = false, setContextMenu, removeFile }) {
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

    function handleContextMenu(event) {
        event.preventDefault();
        console.log('context menu');
        setContextMenu((prev) => prev === file_id ? null : file_id);
    }

    async function handleRemove() {
        try {
            const req = await fetch(`/api/file/${file_id}`, { method: 'DELETE' });
            const data = await req.json();
            if (!data?.ok)
                toastr.error(data?.error);

            toastr.success(data?.message);
            removeFile(file);
        } catch (error) {
            toastr.error(error);
            console.error(error);
        }
    }

    return (
        <li className={styles['file']} onContextMenu={handleContextMenu}>
            {contextMenu ? 
                <div>
                    <button onClick={handleRemove}>Supprimer</button>
                </div> :
                <Link href={`/file/${file_id}`}>
                    <a>
                        <div className={styles['icon-btn']}>
                            {icon}
                        </div>
                        <div className={styles['meta']}>
                            <span className={styles['name']}>
                                {name}
                            </span>
                            <span className={styles['details']}>
                                <span style={{ color: '#3f88c5', fontWeight: '600' }}>{size}</span> - <span style={{ color: '#b3b3b3' }}>{dayjs(createdAt).format('D MMMM YYYY à HH:mm')}</span>
                            </span>
                        </div>
                    </a>
                </Link>}
        </li>
    )
}