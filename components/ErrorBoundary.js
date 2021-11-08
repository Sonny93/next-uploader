import React from 'react';
import Head from 'next/head';

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { error: false, errorInfo: null };
    }

    componentDidCatch(error, errorInfo) {
        // Catch errors in any components below and re-render with error message  
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
    }

    render() {
        if (!this.state.errorInfo)
            return this.props.children;

        return (
            <div className='App error-page'>
                <Head>
                    <title>
                        Une erreur est survenue
                    </title>
                </Head>
                <h2>Une erreur est survenue</h2>
                <details>
                    <summary>{this.state.error && this.state.error.toString()}</summary>
                    <code>
                        {this.state.errorInfo.componentStack}
                    </code>
                </details>
            </div>
        );
    }
}