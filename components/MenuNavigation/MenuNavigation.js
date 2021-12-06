import { signIn, signOut } from 'next-auth/client';
import { AiFillFileAdd } from 'react-icons/ai';
import Link from 'next/link';

import styles from '../../styles/menu.module.scss';

function FilterControls({ showFilter, setShowFilter, setMenuOpen }) {
    if (showFilter) {
        return (
            <a onClick={() => setShowFilter(false)}>
                Masquer les filtres de recherche
            </a>
        );
    } else {
        return (
            <a onClick={() => setShowFilter(true)}>
                Afficher les filtres de recherche
            </a>
        );
    }
}

export default function NavigationMenu({ session, showFilter, setShowFilter }) {
    if (session) {
        return (
            <aside className={styles['menu-wrapper']}>
                <h3>Uploader</h3>
                <ul className={styles['menu']}>
                    <li className={styles['item']}>
                        <FilterControls 
                            showFilter={showFilter} 
                            setShowFilter={setShowFilter} />
                    </li>
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
                            <a
                                style={{ background: '#FFF', color: '#3F88C5' }}>
                                Administration
                            </a>
                        </Link>
                    </li>
                    <li className={styles['item']}>
                        <Link href='#'>
                            <a onClick={() => {
                                signOut();
                                setMenuOpen(false);
                            }} style={{ background: 'crimson', textTransform: 'uppercase' }}>Se déconnecter</a>
                        </Link>
                    </li>
                </ul>
            </aside>
        );
    } else {
        return (
            <aside className={styles['menu-wrapper']}>
                <h3>Uploader</h3>
                <ul className='menu'>
                    <li className={styles['item']}>
                        <FilterControls 
                            showFilter={showFilter} 
                            setShowFilter={setShowFilter} />
                    </li>
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