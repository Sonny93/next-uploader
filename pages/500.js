import Link from 'next/link';

export default function Custom500() {
    return (<>
        <div className='App error-page'>
            <p>
                <span>500</span> Une erreur est survenue sur le serveur
            </p>
            <Link href='/'>
                <a>Revenir à l'accueil</a>
            </Link>
        </div>
    </>)
}