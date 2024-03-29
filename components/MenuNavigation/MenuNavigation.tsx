import { useEffect, useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

import {
    AiOutlineFileAdd, AiOutlineLogout, AiOutlineUnorderedList, AiOutlineUpload,
    AiOutlineUser
} from 'react-icons/ai';
import { MdOutlineAdminPanelSettings } from 'react-icons/md';

import styles from '../../styles/menu.module.scss';

interface NavigationMenuProps {
    children?: JSX.Element[];
}
export default function NavigationMenu({ children }: NavigationMenuProps) {
    const { data: session } = useSession();

    const [isOpen, setOpen] = useState(null);
    const [isMobile, setMobile] = useState(false);

    const mediaQuery = '(max-width: 800px)';

    useEffect(() => {
        if (typeof window === 'undefined') return;
        setMobile(window.matchMedia(mediaQuery).matches);
        window.matchMedia(mediaQuery).addEventListener('change', ({ matches }) => setMobile(matches));
    }, [setMobile]);

    const ButtonControl = () => isMobile && (
        isOpen ?
            <button className={styles['button-controls']} onClick={() => setOpen(false)}>Masquer le menu</button> :
            <button className={styles['button-controls']} onClick={() => setOpen(true)}>Afficher le menu</button>
    );

    const className = `${styles['menu-wrapper']} ${isOpen === null ? '' : (isOpen ? styles['menu-open'] : styles['menu-closed'])}`;
    if (session) {
        return (<>
            <ButtonControl />
            <aside className={className}>
                <ButtonControl />
                <ul className={styles['menu']}>
                    <div className={styles['avatar']}>
                        <Image
                            src={session?.user?.image?.replace('=s96', '=s180')}
                            alt='avatar'
                            height={180}
                            width={180}
                        />
                    </div>
                    <h2>{session?.user?.name}</h2>
                    <div className={`${styles['group']} ${styles['top']}`}>
                        <li className={styles['item']}>
                            <Link href='/'>
                                <a><AiOutlineUnorderedList /> Liste des fichiers</a>
                            </Link>
                        </li>
                        <li className={styles['item']}>
                            <Link href='/create'>
                                <a><AiOutlineFileAdd /> Créer un fichier</a>
                            </Link>
                        </li>
                        <li className={styles['item']}>
                            <Link href='/upload'>
                                <a><AiOutlineUpload /> Uploader un fichier</a>
                            </Link>
                        </li>
                        {children && <>
                            {children}
                        </>}
                    </div>
                    <div className={`${styles['group']} ${styles['bottom']}`}>
                        <li className={styles['item']}>
                            <Link href='/admin/'>
                                <a className={styles['blue']}>
                                    <MdOutlineAdminPanelSettings /> Administration
                                </a>
                            </Link>
                        </li>
                        <li className={styles['item']}>
                            <a href='#' onClick={() => signOut()} className={styles['red']}>
                                <AiOutlineLogout /> Se déconnecter
                            </a>
                        </li>
                    </div>
                </ul>
            </aside>
        </>);
    } else {
        return (<>
            <ButtonControl />
            <aside className={className}>
                <ButtonControl />
                <ul className={styles['menu']}>
                    <h3>Bonjour</h3>
                    <div className={`${styles['group']} ${styles['top']}`}>
                        <li className={styles['item']}>
                            <Link href='/'>
                                <a><AiOutlineUnorderedList /> Liste des fichiers</a>
                            </Link>
                        </li>
                    </div>
                    <div className={`${styles['group']} ${styles['bottom']}`}>
                        <li className={styles['item']}>
                            <Link href='/signin'>
                                <a className={styles['blue']}>
                                    <AiOutlineUser /> Se connecter
                                </a>
                            </Link>
                        </li>
                    </div>
                </ul>
            </aside>
        </>);
    }
}