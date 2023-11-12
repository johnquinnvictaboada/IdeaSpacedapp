import Head from 'next/head'
import '../styles/global.css'
import WalletConnectProvider from '../components/WalletConnectProvider'
import '@solana/wallet-adapter-react-ui/styles.css'

function MyApp({ Component, pageProps }) {
    
    return (
        <>
            
            
            <Head>
                <title>IdeaSpace</title>
                
            </Head>
            <div className="area h-full w-full ">
			<ul className="circles">
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
			</ul>
		</div>
            <main>
                
                <WalletConnectProvider>
                    <Component {...pageProps} />
                </WalletConnectProvider>
            </main>
        </>
    )
}

export default MyApp
