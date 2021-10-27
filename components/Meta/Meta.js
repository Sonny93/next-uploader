import Head from 'next/head';

export default function Meta({ 
    title = 'Uploader', 
    description = 'Uploader sonnydata.fr créé & développé par Sonny#0005. Site privé.',
    pageUrl = null,
    children
}) {
    return (
        <Head>
            <meta charSet='UTF-8' />
            <title>{title}</title>
            <meta name='viewport' content='initial-scale=1.0, width=device-width' />
            
            {/* Open Graph */}
            <meta property='og:site_name' content='> Uploader.sonnydata.fr' />
            <meta property='og:author' content='Sonny#0005' />
            <meta property='og:type' content='website' />

            <meta property='og:title' content={title} />
            <meta property='og:description' content={description} />

            {pageUrl && <meta property='og:url' content={pageUrl} />}
            {children ? children : null}

            <meta name='theme-color' content='#fff' />
        </Head>
    )
}