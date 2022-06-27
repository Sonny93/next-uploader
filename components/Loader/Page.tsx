import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import Loader from './Loader';

export default function PageLoader({ setTransitioning }) {
    const router = useRouter();
    const [pageLoading, setPageLoading] = useState<boolean>(false);

    useEffect(() => { // Chargement pages
        let timeout;

        const handleStart = (url: string) => {
            if (url !== router.asPath) {
                timeout = setTimeout(() => {
                    setPageLoading(true);
                    setTransitioning(true);
                }, 200);
            }
        }

        const handleComplete = () => {
            setPageLoading(false);
            setTransitioning(false);
        }

        router.events.on('routeChangeStart', handleStart);
        router.events.on('routeChangeComplete', handleComplete);
        router.events.on('routeChangeError', handleComplete);

        return () => {
            clearTimeout(timeout);
            router.events.off('routeChangeStart', handleStart);
            router.events.off('routeChangeComplete', handleComplete);
            router.events.off('routeChangeError', handleComplete);
        }
    });

    if (pageLoading) {
        return (<Loader label={'Chargement de la page en cours'} top={true} backdrop={true} />);
    } else {
        return (<></>);
    }
}