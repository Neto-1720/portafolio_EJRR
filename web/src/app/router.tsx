import { createBrowserRouter } from 'react-router'
import { AppLayout } from '../components/layout/AppLayout.tsx'
import { AdminLayout } from '../features/admin/AdminLayout.tsx'
import { AuthProvider } from '../features/admin/AuthProvider.tsx'
import { RequireAuth } from '../features/admin/RequireAuth.tsx'
import { AboutPage } from '../pages/AboutPage.tsx'
import { CertificationsPage } from '../pages/admin/CertificationsPage.tsx'
import { DashboardPage } from '../pages/admin/DashboardPage.tsx'
import { LoginPage } from '../pages/admin/LoginPage.tsx'
import { MessagesPage } from '../pages/admin/MessagesPage.tsx'
import { ProjectEditorPage } from '../pages/admin/ProjectEditorPage.tsx'
import { ProjectsPage } from '../pages/admin/ProjectsPage.tsx'
import { ContactPage } from '../pages/ContactPage.tsx'
import { LegacyDemoPage } from '../pages/demos/LegacyDemoPage.tsx'
import { LogisticsDemoPage } from '../pages/demos/LogisticsDemoPage.tsx'
import { NotificationsDemoPage } from '../pages/demos/NotificationsDemoPage.tsx'
import { SupportDemoPage } from '../pages/demos/SupportDemoPage.tsx'
import { TrackingDemoPage } from '../pages/demos/TrackingDemoPage.tsx'
import { HomePage } from '../pages/HomePage.tsx'
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
  {
    path: 'admin',
    element: <AuthProvider />,
    children: [
      { path: 'login', element: <LoginPage /> },
      {
        element: <RequireAuth />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              { index: true, element: <DashboardPage /> },
              { path: 'projects', element: <ProjectsPage /> },
              { path: 'projects/:id', element: <ProjectEditorPage /> },
              { path: 'certifications', element: <CertificationsPage /> },
              { path: 'messages', element: <MessagesPage /> },
            ],
          },
        ],
      },
    ],
  },
])
