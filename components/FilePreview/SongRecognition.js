export default function SongRecognition({ music_recognition }) {
    const { artist, release_date, spotify, title } = music_recognition;
    if (!music_recognition)
        return <div>y'a r</div>;

    return <ul className='song-details'>
        <h4 style={{ border: 0 }}>Musique détectée</h4>
        <li className='field'>
            <span style={{ color: '#3f88c5' }}>Artiste: </span>
            <span>{artist}</span>
        </li>
        <li className='field'>
            <span style={{ color: '#3f88c5' }}>Titre: </span>
            <span>{title}</span>
        </li>
        <li className='field'>
            <span style={{ color: '#3f88c5' }}>Date de publication: </span>
            <span>{release_date}</span>
        </li>
        {spotify && <>
            <li className='field'>
                <span>Lien : </span>
                <span>
                    <a href={spotify.external_urls?.['spotify']}>Spotify</a>
                </span>
            </li>
            <li style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ color: '#3f88c5' }}>Preview Spotify</span>
                <span>
                    <audio src={spotify.preview_url} controls></audio>    
                </span>
            </li>
        </>}
    </ul>;
}