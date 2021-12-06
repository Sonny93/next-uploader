import { signIn, signOut } from 'next-auth/client';
import { AiFillFileAdd } from 'react-icons/ai';
import { MdOutlineAdminPanelSettings } from 'react-icons/md';
import Link from 'next/link';

import styles from '../../styles/menu.module.scss';

export default function NavigationMenu({ session }) {
    if (session) {
        return (
            <aside className={styles['menu-wrapper']}>
                <h3>Bonjour {session?.user?.name}</h3>
                <ul className={styles['menu']}>
                    <li className={styles['item']}>
                        <Link href='/#'>
                            <a>Créer un fichier</a>
                        </Link>
                    </li>
                    <li className={styles['item']}>
                        <Link href='/upload'>
                            <a><AiFillFileAdd /> Uploader un fichier</a>
                        </Link>
                    </li>
                    <li className={styles['item']}>
                        <Link href='/admin/'>
                            <a><MdOutlineAdminPanelSettings /> Administration</a>
                        </Link>
                    </li>
                    <li className={styles['item']}>
                        <Link href='#'>
                            <a onClick={() => signOut()} style={{ background: 'crimson', textTransform: 'uppercase' }}>
                                Se déconnecter
                            </a>
                        </Link>
                    </li>
                </ul>
            </aside>
        );
    } else {
        return (
            <aside className={styles['menu-wrapper']}>
                <h3>Bonjour</h3>
                <ul className='menu'>
                    <li className={styles['item']}>
                        <Link href='#'>
                            <a onClick={() => {
                                signIn();
                                setMenuOpen(false);
                            }}>Se connecter</a>
                        </Link>
                    </li>
                </ul>
            </aside>
        );
    }
}