import { NextSeo } from 'next-seo';

import MenuNavigation from '../../components/MenuNavigation/MenuNavigation';
import { FrontPageProps } from '../../front';
import styles from '../../styles/admin/admin.module.scss';

function AdminPage({ transitionClass }: FrontPageProps) {
    return (<>
        <NextSeo
            title={'Admin'}
            description={'Dashboard admin'}
        />
        <div className={`${transitionClass} ${styles['admin']}`}>
            <MenuNavigation />
            <div className={styles['wrapper']}>
                Mon super dashboard administrateur
            </div>
        </div>
    </>);
}

AdminPage.authRequired = true;
export default AdminPage;