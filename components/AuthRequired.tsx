import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router';
import Loader from './Loader/Loader';

export default function Auth({ children }) {
    const router = useRouter();
    const { status } = useSession({
        required: true,
        onUnauthenticated: () => router.push(`/signin?info=${encodeURI('Vous devez être connecté pour accéder à cette page')}`)
    });

    if (status === 'loading') {
        return (
            <div className='App' style={{ alignItems: 'center' }}>
                <Loader backdrop={true} label='Chargement de la session' />
            </div>
        );
    }

    return children;
}