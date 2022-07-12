import { NextSeo } from 'next-seo';
import MenuNavigation from '../components/MenuNavigation/MenuNavigation';
import Meta from '../components/Meta/Meta';

import { FrontPageProps } from '../front';

function CreatePage({ transitionClass }: FrontPageProps) {
	return (<>
		<NextSeo
			title={'Créer un fichier'}
			description={'Création et mise en ligne automatique de fichiers'}
		/>
		<div className={`${transitionClass}`}>
			<Meta />
			<MenuNavigation />
			<p>Page de création</p>
		</div>
	</>);
}

CreatePage.authRequired = true;
export default CreatePage;