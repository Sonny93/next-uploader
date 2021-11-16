import { getSession } from 'next-auth/client';
import { PrismaClient } from '@prisma/client';

import dayjs from 'dayjs';
import 'dayjs/locale/fr';
dayjs.extend(require('dayjs/plugin/relativeTime'))
dayjs.locale('fr');

import Link from 'next/link';
import Meta from '../../../components/Meta/Meta';

BigInt.prototype.toJSON = function () { return this.toString() }
const prisma = new PrismaClient();

export default function http({ logs }) {
    return (
        <div className='App admin'>
            <Meta />
            <header style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                <Link href='/'>
                    <a className='home-link'>Accueil</a>
                </Link>
                <Link href='/admin'>
                    <a>Admin</a>
                </Link>
                <Link href='/admin/logs_admin/http'>
                    <a>Logs HTTP</a>
                </Link>
                <Link href='/admin/logs_admin/auth'>
                    <a>Logs Auth</a>
                </Link>
            </header>
            <ul className='logs'>
                {logs.map(({ url, method, ip, createdAt }, key) => (
                    <li key={key} className='log'>
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