import { useSession } from 'next-auth/client';

import MenuNavigation from '../components/MenuNavigation/MenuNavigation';
import Loader from '../components/Loader/Loader';
import Meta from '../components/Meta/Meta';

import { FrontPageProps } from '../front';

export default function Create({ transitionClass }: FrontPageProps) {
	const [session, isLoadingSession] = useSession();

	if (isLoadingSession && !session) { // Chargement session
		return (
			<div className={`${transitionClass}`}>
				<Meta />
				<Loader label={'Chargement de la session'} top={true} backdrop={true} />
			</div>
		);
	}

	return (
		<div className={`${transitionClass}`}>
			<Meta />
			<MenuNavigation session={session} />
			<p>Page de création</p>
		</div>
	);
}