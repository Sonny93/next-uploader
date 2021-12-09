import styles from '../../styles/file-preview/file-preview.module.scss';

export default function SongRecognition({ music_recognition }) {
    const { artist, release_date, spotify, title } = music_recognition;
    if (!music_recognition)
        return <div>y'a r</div>;

    return <ul className={styles['song-details']}>
        <h4 style={{ border: 0 }}>Musique détectée</h4>
        <li className={styles['field']}>
            <span style={{ color: '#3f88c5' }}>Artiste: </span>
            <span>{artist}</span>
        </li>
        <li className={styles['field']}>
            <span style={{ color: '#3f88c5' }}>Titre: </span>
            <span>{title}</span>
        </li>
        <li className={styles['field']}>
            <span style={{ color: '#3f88c5' }}>Date de publication: </span>
            <span>{release_date}</span>
        </li>
        {spotify && <>
            <li className={styles['field']}>
                <span style={{ color: 'white' }}>Lien vers </span>
                <span>
                    <a href={spotify.external_urls?.['spotify']}>Spotify</a>
                </span>
            </li>
            <li style={{ display: 'flex', flexDirection: 'column' }}>
                <span>
                    <audio src={spotify.preview_url} controls></audio>    
                </span>
            </li>
        </>}
    </ul>;
}