import styles from '../styles/message-manager.module.scss';

interface MessageManagerProps {
    info?: string;
    error?: string;
    success?: string;
}

export default function MessageManager({ info, error, success }: MessageManagerProps) {
    if (!info && !error && !success) {
        return (<></>);
    }

    return (<>
        <div className={styles['message-manager']}>
            {info && (<p className={styles['info']}>{info}</p>)}
            {error && (<p className={styles['error']}>{error}</p>)}
            {success && (<p className={styles['success']}>{success}</p>)}
        </div>
    </>);
}