import { AiFillFileAdd } from 'react-icons/ai';
import Link from 'next/link';

export default function Navbar({ signOut, signIn, session, setShowFilter }) {
    return <div className='navbar'>
        {session ? <>
            <button onClick={() => signOut()}>Se déconnecter</button>
            <Link href='/upload'>
                <a className='icon-btn btn'>
                    <AiFillFileAdd />
                </a>
            </Link>
            <button onClick={() => setShowFilter((prev) => !prev)}>
                Filtre
            </button>
        </> : <>
            <button onClick={() => signIn()}>Se connecter</button>
            <button onClick={() => setShowFilter((prev) => !prev)}>
                Filtre
            </button>
        </>}
    </div>;
}