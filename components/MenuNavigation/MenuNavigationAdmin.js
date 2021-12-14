import { useSession } from 'next-auth/client';
import Link from 'next/link';

import MenuNavigation from './MenuNavigation';
import styles from '../../styles/menu.module.scss';

export default function MenuNavigationAdmin() {
    const session = useSession();
    console.log(session);
    return (
        <MenuNavigation session={session}>
            <li className={styles['item']}>
                <Link href='/admin/logs_admin/http'>
                    <a>Logs HTTP</a>
                </Link>
            </li>
            <li className={styles['item']}>
                <Link href='/admin/logs_admin/auth'>
                    <a>Logs Auth</a>
                </Link>
            </li>
        </MenuNavigation>
    );
}