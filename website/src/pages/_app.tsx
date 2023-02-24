import '@/styles/globals.css'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { PackageManagerPreferenceProvider } from '@/components/PackageManagerPreference'
import { NextSeo } from 'next-seo'
import Head from 'next/head'

import type { AppProps } from 'next/app'

const title = 'Selection Popover'
const description = 'Easy-to-use, composable react selection popover'
const siteUrl = 'https://selection-popover.vercel.app'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <NextSeo
        title={`${description} - ${title}`}
        description={description}
        openGraph={{
          type: 'website',
          url: siteUrl,
          title,
          description: description + '.',
          images: [
            {
              url: `${siteUrl}/og.png`,
              alt: title
            },
          ],
        }}
      />
      <PackageManagerPreferenceProvider>
        <TooltipPrimitive.Provider>
          <Component {...pageProps} />
        </TooltipPrimitive.Provider>
      </PackageManagerPreferenceProvider>
    </>
  )
}
