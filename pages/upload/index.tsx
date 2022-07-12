import { NextSeo } from 'next-seo';
import { Provider } from 'react-redux';

import MenuNavigation from '../../components/MenuNavigation/MenuNavigation';
import UploadControls from '../../components/Upload/UploadControls';
import FilesUpload from '../../components/Upload/UploadFilesList';

import styles from '../../styles/upload.module.scss';

import { store } from '../../components/redux';
import { FrontPageProps } from '../../front';

function UploadPage({ transitionClass }: FrontPageProps): JSX.Element {
    return (<>
        <NextSeo
            title={'Upload'}
            description={'Mettre en ligne un fichier'}
        />
        <div className={`${transitionClass} ${styles['upload']}`}>
            <MenuNavigation />
            <Provider store={store}>
                <div className={styles['wrapper']}>
                    <FilesUpload />
                    <UploadControls />
                </div>
            </Provider>
        </div>
    </>);
}

UploadPage.authRequired = true;
export default UploadPage;