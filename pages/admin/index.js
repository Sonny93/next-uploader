import { getSession } from 'next-auth/client';

import { prisma, userSafeProps } from '../../utils';

import Meta from '../../components/Meta/Meta';
import MenuNavigation from '../../components/MenuNavigation/MenuNavigation';

import styles from '../../styles/admin/admin.module.scss';

BigInt.prototype.toJSON = function () { return this.toString() }

export default function Admin({ users, session, transitionClass }) {
    return (<>
        <Meta description='Dashboard admin' />
        <div className={`${transitionClass} ${styles['admin']}`}>
            <MenuNavigation session={session} />
            <div className={styles['wrapper']}>
                <h1>Users</h1>
                {users && users?.length > 0 ? <>
                    <ul>
                        {users?.map((user, key) => <li key={key}>
                            {Object.entries(user).map((values, key2) => <p key={key2}>{values.join(' : ')}</p>)}
                        </li>)}
                    </ul>
                </> : <p>Aucun utilisateur</p>}
            </div>
        </div>
    </>);
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