import { signIn, signOut } from 'next-auth/client';
import { 
    AiFillFileAdd, 
    AiOutlineUnorderedList, 
    AiOutlineFileAdd, 
    AiOutlineUser, 
    AiOutlineLogout 
} from 'react-icons/ai';
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
                        <Link href='/'>
                            <a><AiOutlineUnorderedList /> Liste des fichiers</a>
                        </Link>
                    </li>
                    <li className={styles['item']}>
                        <Link href='/#'>
                            <a><AiOutlineFileAdd /> Créer un fichier</a>
                        </Link>
                    </li>
                    <li className={styles['item']}>
                        <Link href='/upload'>
                            <a><AiFillFileAdd /> Uploader un fichier</a>
                        </Link>
                    </li>
                    <li className={styles['item']}>
                        <Link href='/admin/'>
                            <a className={styles['blue']}>
                                <MdOutlineAdminPanelSettings /> Administration
                            </a>
                        </Link>
                    </li>
                    <li className={styles['item']}>
                        <Link href='#'>
                            <a onClick={() => signOut()} className={styles['red']}>
                                <AiOutlineLogout /> Se déconnecter
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
                <ul className={styles['menu']}>
                    <li className={styles['item']}>
                        <Link href='/'>
                            <a><AiOutlineUnorderedList /> Liste des fichiers</a>
                        </Link>
                    </li>
                    <li className={styles['item']}>
                        <Link href='#'>
                            <a onClick={() => signIn()} className={styles['blue']}>
                                <AiOutlineUser /> Se connecter
                            </a>
                        </Link>
                    </li>
                </ul>
            </aside>
        );
    }
}