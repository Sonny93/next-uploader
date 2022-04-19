import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import toastr from 'toastr';
import dayjs from 'dayjs';

import { FileFront, FileType } from '../../front.d';
import { GetIcon } from '../../utils';

import styles from '../../styles/home/filelist.module.scss';

interface FileProps {
    file: FileFront;
    index: number;
    contextMenu: boolean;
    setContextMenu: (value: any) => void;
    removeFile: (file: FileFront) => void;
}

export default function File({ file, contextMenu = false, setContextMenu, removeFile }: FileProps): JSX.Element {
    const { file_id, name, meta, createdAt } = file;

    function handleContextMenu(event) {
        event.preventDefault();
        setContextMenu((prev) => prev === file_id ? null : file_id);
    }

    async function handleRemove() {
        if (!confirm(`Confirmer la suppression du fichier \`${name}\` ?`)) return;

        const request = await fetch(`/api/file/${file_id}`, { method: 'DELETE' });
        if (!request.ok) {
            toastr.error(`Une erreur est survenue lors de la suppresion du fichier \`${name}\``, 'Erreur');
            console.error('Request failed', request.status, request);
            return;
        }

        const data = await request.json();
        if (!data?.ok) {
            toastr.error(data?.error, 'Erreur');
            console.error(data);
            return;
        }

        toastr.success(data?.message);
        removeFile(file);
    }

    return (
        <li className={styles['file']} onContextMenu={handleContextMenu}>
            <Link href={`/file/${file_id}`}>
                <a className={contextMenu ? styles['controls-open'] : ''}>
                    <div className={styles['icon-btn']}>
                        <Image
                            src={GetIcon(file.meta.type)}
                            height={40}
                            width={40}
                            alt={`${meta.type}\'s icon`}
                        />
                    </div>
                    <div className={styles['name']}>
                        {name}
                    </div>
                    <div className={styles['size']}>
                        {file.passwordSet ? (
                            <Image
                                src={GetIcon(FileType.PROTECTED)}
                                height={24}
                                width={24}
                                alt={`${meta.type}\'s icon`}
                                title='Fichier protégé par un mot de passe'
                            />
                        ) : file?.size.pretty}
                    </div>
                    <div className={styles['date']}>
                        {dayjs(createdAt).fromNow()}
                    </div>
                </a>
            </Link>
            {contextMenu && (
                <div className={styles['controls']}>
                    <button className={styles['btn-remove']} onClick={handleRemove}>Supprimer</button>
                </div>
            )}
        </li>
    )
}