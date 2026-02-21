import { useState } from 'react'
import { Layout, type Page } from './components/Layout'
import { ScanPage } from './pages/ScanPage'
import { ComparePage } from './pages/ComparePage'
import { FleetPage } from './pages/FleetPage'
import { SettingsPage } from './pages/SettingsPage'

const PAGES: Record<Page, () => JSX.Element> = {
  scan: ScanPage,
  compare: ComparePage,
  fleet: FleetPage,
  settings: SettingsPage,
}

export function App() {
  const [page, setPage] = useState<Page>('scan')
  const PageComponent = PAGES[page]

  return (
    <Layout currentPage={page} onNavigate={setPage}>
      <PageComponent />
    </Layout>
  )
}
