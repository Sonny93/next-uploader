import Head from 'next/head';

export default function Meta(props) {
    const title = props?.title || process.env.META_DEFAULT_TITLE;
    const description = props?.description || process.env.META_DEFAULT_DESCRIPTION;
    const site_name = process.env.META_DEFAULT_SITE_NAME;

    const children = props?.children || null;
    const pageUrl = props?.pageUrl || null;

    return (
        <Head>
            <meta charSet='UTF-8' />
            <title>{title}</title>
            <meta name='viewport' content='initial-scale=1.0, width=device-width' />
            <meta name='description' content={description} />
            
            {/* Open Graph */}
            <meta property='og:site_name' content={site_name} />
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