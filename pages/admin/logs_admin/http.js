import { getSession } from 'next-auth/client';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';

import Meta from '../../../components/Meta/Meta';
import MenuNavigationAdmin from '../../../components/MenuNavigation/MenuNavigationAdmin';

import styles from '../../../styles/admin/admin.module.scss';

import { prisma } from '../../../utils/index';

dayjs.extend(require('dayjs/plugin/relativeTime'))
dayjs.locale('fr');

BigInt.prototype.toJSON = function () { return this.toString() }

export default function http({ logs }) {
    return (
        <div className={styles['admin']}>
            <Meta />
            <MenuNavigationAdmin />
            <ul className={styles['logs']}>
                {logs.map(({ url, method, ip, createdAt }, key) => (
                    <li key={key} className={styles['log']}>
                        <div>
                            <div>{method}</div>
                            <div>{url}</div>
                        </div>
                        <div>
                            <div>IP</div>
                            <div>{ip}</div>
                        </div>
                        <div>
                            <div>Date</div>
                            <div>{dayjs(createdAt).format('D MMMM YYYY à HH:mm')}</div>
                        </div>
                    </li>
                ))}
            </ul>
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

    const logs = await prisma.log_http.findMany();
    const logsSafe = logs
        .map((log) => {
            delete log?.id;
            delete log?.updatedAt;
            return log;
        })
        .reverse();

    return {
        props: {
            session,
            logs: JSON.parse(JSON.stringify(logsSafe))
        }
    }
}