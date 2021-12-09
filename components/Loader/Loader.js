import LoaderSVG from './Loader.svg';

export default function Loader({ label = 'Chargement en cours', top = true, backdrop = false }) {
    return <div className={`loader${top ? ' top' : ''}${backdrop ? ' backdrop' : ''}`}>
        <LoaderSVG />
        <div className='label'>
            {label}
        </div>
    </div>
}