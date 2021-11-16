import { getSession } from 'next-auth/client';
import { PrismaClient } from '@prisma/client';

import Link from 'next/link';

import { userSafeProps } from '../../utils';
import Meta from '../../components/Meta/Meta';

BigInt.prototype.toJSON = function () { return this.toString() }
const prisma = new PrismaClient();

export default function Admin({ users }) {
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
            <div>
                <h3>Users</h3>
                <ul>
                    {users?.map((user, key) => <li key={key}>
                        {Object.entries(user).map((values, key2) => <p key={key2}>{values.join(' : ')}</p>)}    
                    </li>)}
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

    const users = await prisma.user.findMany() || [];
    users.map((user) => userSafeProps(user));

    return {
        props: { 
            session,
            users: JSON.parse(JSON.stringify(users))
        }
    }
}