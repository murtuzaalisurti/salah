import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
    return (
        <Html>
            <Head>
                <link rel="apple-touch-icon" sizes="180x180" href="favicon/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="favicon/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="favicon/favicon-16x16.png" />
                <link rel="icon" href="favicon/favicon.ico" />
                <link rel="manifest" href="/manifest.json" />
                <meta name="theme-color" content="#223843" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin={true} />
                <link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville&family=Merriweather&family=Bebas+Neue&family=Chivo:ital,wght@0,300;0,400;0,700;1,400&family=Fira+Code:wght@300;400;600;700&family=Inter:wght@300;400;500;700&family=Josefin+Sans:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,700&family=Lato:ital,wght@0,300;0,400;0,700;1,400;1,700&family=Noto+Sans:ital,wght@0,400;0,700;1,400;1,700&family=Nunito:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,700&family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&family=Ubuntu:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}