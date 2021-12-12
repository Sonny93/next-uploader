import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import Loader from './Loader';

export default function PageLoader({ setTransitioning }) {
    const router = useRouter();
    const [pageLoading, setPageLoading] = useState(false);

    useEffect(() => { // Chargement pages
        const handleStart = (url) => {
            console.log('changement de page');
            if (url !== router.asPath) {
                setPageLoading(true);
                setTransitioning(true);
            }
        };
        const handleComplete = (url) => {
            console.log('changement de page terminé');
            setPageLoading(false);
            setTransitioning(false);
        };

        router.events.on('routeChangeStart', handleStart);
        router.events.on('routeChangeComplete', handleComplete);
        router.events.on('routeChangeError', handleComplete);

        return () => {
            router.events.off('routeChangeStart', handleStart);
            router.events.off('routeChangeComplete', handleComplete);
            router.events.off('routeChangeError', handleComplete);
        }
    });

    if (pageLoading) {
        return (
            <Loader label={'Chargement de la page en cours'} top={true} backdrop={true} />
        );
    } else {
        return (<span></span>);
    }
}