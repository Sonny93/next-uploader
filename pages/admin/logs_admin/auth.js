import { getSession } from 'next-auth/client';
import prisma from '../../../lib/prisma';

import dayjs from 'dayjs';
import 'dayjs/locale/fr';
dayjs.extend(require('dayjs/plugin/relativeTime'))
dayjs.locale('fr');

import Meta from '../../../components/Meta/Meta';
import MenuNavigationAdmin from '../../../components/MenuNavigation/MenuNavigationAdmin';

import styles from '../../../styles/admin/admin.module.scss';

BigInt.prototype.toJSON = function () { return this.toString() }

export default function auth({ logs }) {
    return (
        <div className={styles['admin']}>
            <Meta />
            <MenuNavigationAdmin />
            <div className={styles['wrapper']}>
                <ul className={styles['logs']}>
                    {logs.map(({ email_used, ip, success, message, createdAt }, key) => (
                        <li key={key} className={styles['log']}>
                            <div title={`Adresse mail utilisée : ${email_used}`}>
                                <div>Email</div>
                                <div>{email_used}</div>
                            </div>
                            <div title={`IP ${ip}`}>
                                <div>IP</div>
                                <div>{ip}</div>
                            </div>
                            <div title={success ? 'Succès' : 'Echec'}>
                                <div>Statut</div>
                                {success ? 
                                    <div className={styles['success']}>Succès</div> :
                                    <div className={styles['error']}>Echec</div>}
                            </div>
                            <div title={`Message obtenu : ${message}`}>
                                <div>Message</div>
                                <div>{message}</div>
                            </div>
                            <div>
                                <div>Date</div>
                                <div>{dayjs(createdAt).format('D MMMM YYYY à HH:mm')}</div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export async function getServerSideProps(context) {
    const session = await getSession(context);

    if (!session) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    const logs = await prisma.log_connection.findMany();
    const logsSafe = logs
        .map((log) => {
            delete log?.id;
            delete log?.updatedAt;
            return log;
        })
        .reverse();

        console.log(logsSafe);
    return {
        props: { 
            session,
            logs: JSON.parse(JSON.stringify(logsSafe))
        }
    }
}