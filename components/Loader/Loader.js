import { AiOutlineLoading } from 'react-icons/ai';

export default function Loader({ label = 'Chargement en cours', top = true, backdrop = false }) {
    return <div className={`loader${top ? ' top' : ''}${backdrop ? ' backdrop' : ''}`}>
        <AiOutlineLoading />
        <div className='label'>
            {label}
        </div>
    </div>
}