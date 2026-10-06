import { createBrowserRouter } from 'react-router'
import { AppLayout } from '../components/layout/AppLayout.tsx'
import { AboutPage } from '../pages/AboutPage.tsx'
import { ContactPage } from '../pages/ContactPage.tsx'
import { HomePage } from '../pages/HomePage.tsx'
import { LegacyDemoPage } from '../pages/demos/LegacyDemoPage.tsx'
import { LogisticsDemoPage } from '../pages/demos/LogisticsDemoPage.tsx'
import { NotificationsDemoPage } from '../pages/demos/NotificationsDemoPage.tsx'
import { SupportDemoPage } from '../pages/demos/SupportDemoPage.tsx'
import { TrackingDemoPage } from '../pages/demos/TrackingDemoPage.tsx'
import { WorkDetailPage } from '../pages/WorkDetailPage.tsx'
import { WorkPage } from '../pages/WorkPage.tsx'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'work', element: <WorkPage /> },
      { path: 'work/:slug', element: <WorkDetailPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'demo/logistics', element: <LogisticsDemoPage /> },
      { path: 'demo/notifications', element: <NotificationsDemoPage /> },
      { path: 'demo/tracking', element: <TrackingDemoPage /> },
      { path: 'demo/support', element: <SupportDemoPage /> },
      { path: 'demo/legacy', element: <LegacyDemoPage /> },
    ],
  },
])
