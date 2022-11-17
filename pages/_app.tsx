import '../src/styles/globals.css'
import type { AppProps } from 'next/app'
import { lightTheme } from '../src/themes'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { SWRConfig } from 'swr';
import { AuthProvider, UIProvider } from '../src/context/';
import { CartProvider } from '../src/context';


export default function App({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig value={{ fetcher: (resource, init) => fetch(resource, init).then(res => res.json()) }}>
      <AuthProvider>
        <CartProvider>
          <UIProvider>
            <ThemeProvider theme={lightTheme}>
              <CssBaseline />
              <Component {...pageProps} />
            </ThemeProvider>
          </UIProvider>
        </CartProvider>
      </AuthProvider>
    </SWRConfig>
  )
}
