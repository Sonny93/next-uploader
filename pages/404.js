import Link from 'next/link';

export default function Custom404() {
    return (<>
        <div className='App error-page'>
            <p>
                <span>404</span> Page introuvable
            </p>
            <Link href='/'>
                <a>Revenir à l'accueil</a>
            </Link>
        </div>
    </>)
}