import { AiFillFileAdd } from 'react-icons/ai';
import Link from 'next/link';

export default function Navbar({ signOut, signIn, session }) {
    return <div className='navbar'>
        {session ? <>
            <button onClick={() => signOut()}>Se déconnecter</button>
            <Link href='/upload'>
                <a className='icon-btn btn'>
                    <AiFillFileAdd />
                </a>
            </Link>
        </> : <>
            Vous n'êtes pas connecté
            <button onClick={() => signIn()}>Se connecter</button>
        </>}
    </div>;
}