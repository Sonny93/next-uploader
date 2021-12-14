import SongRecognition from './SongRecognition';
import styles from '../../styles/file-preview/file-preview.module.scss';

export default function Video({ src, music_recognition }) {
    return (<>
        <div className={styles['preview-wrapper']}>
            <video src={src} controls autoPlay={false} loop />
        </div>
        {music_recognition ? 
            <SongRecognition music_recognition={music_recognition} /> :
            <p>Aucune musique n'a été détectée</p>}
    </>);
}