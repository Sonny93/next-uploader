import { getSession, useSession } from 'next-auth/react';
import { Provider } from 'react-redux';

import Meta from '../../components/Meta/Meta';
import MenuNavigation from '../../components/MenuNavigation/MenuNavigation';
import FilesUpload from '../../components/Upload/UploadFilesList';
import UploadControls from '../../components/Upload/UploadControls';

import styles from '../../styles/upload.module.scss';

import { FrontPageProps } from '../../front';
import { store } from '../../components/redux';

export default function Upload({ transitionClass }: FrontPageProps): JSX.Element {
    const { data: session } = useSession();

    return (<>
        <Meta description='Uploder un nouveau fichier' />
        <div className={`${transitionClass} ${styles['upload']}`}>
            <MenuNavigation session={session} />
            <Provider store={store}>
                <div className={styles['wrapper']}>
                    <FilesUpload />
                    <UploadControls />
                </div>
            </Provider>
        </div>
    </>);
}

export async function getServerSideProps(context) {
    const session = await getSession(context);

    // Vérifie si l'utilisateur est connecté, si ce n'est pas le cas, on le redirige vers l'accueil
    if (!session) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    // On retourne un objet qui servira de contexte pour la page
    return {
        props: { session }
    }
}