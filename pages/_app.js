import { useCreateStore, Provider } from '../lib/store'
import useSWR, { SWRConfig } from 'swr'
import SSRProvider from 'react-bootstrap/SSRProvider'

export default function App({ Component, pageProps }) {
  const createStore = useCreateStore(pageProps.initialZustandState)
  return (
    <SWRConfig
      value={{
        fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
      }}
    >
      <Provider createStore={createStore}>
        <SSRProvider>
          <Component {...pageProps} />
        </SSRProvider>
      </Provider>
    </SWRConfig>
  )
}
