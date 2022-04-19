import { getSession, useSession } from 'next-auth/client';

import { prisma, userSafeProps } from '../../utils';

import Meta from '../../components/Meta/Meta';
import MenuNavigation from '../../components/MenuNavigation/MenuNavigation';

import styles from '../../styles/admin/admin.module.scss';

// @ts-ignore
BigInt.prototype.toJSON = function () { return this.toString() }

import { FrontPageProps } from '../../front';

export default function Admin({ transitionClass }: FrontPageProps) {
    const [session, isLoadingSession] = useSession();

    return (<>
        <Meta description='Dashboard admin' />
        <div className={`${transitionClass} ${styles['admin']}`}>
            <MenuNavigation session={session} />
            <div className={styles['wrapper']}>
                Mon super dashboard administrateur
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
    } else {
        return { props: {} }
    }
}