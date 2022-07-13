import { Html, Head, Main, NextScript } from 'next/document';

const Document = () => (
    <Html lang='fr'>
        <Head>
            <link rel='manifest' href='/manifest.json' />
            <link rel='apple-touch-icon' href='/nu/icons/icon-192x192.png' />
            <link rel='icon' href='/nu/icons/icon-192x192.png' />
        </Head>
        <body>
            <Main />
            <NextScript />
        </body>
    </Html>
)

export default Document;