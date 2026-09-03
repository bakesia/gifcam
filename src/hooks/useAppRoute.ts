import { useCallback, useEffect, useState } from 'react'

export type AppRoute = '/' | '/about' | '/privacy' | '/licenses'

const supportedRoutes: AppRoute[] = ['/', '/about', '/privacy', '/licenses']

const getRoute = (pathname: string): AppRoute => (
  supportedRoutes.includes(pathname as AppRoute) ? pathname as AppRoute : '/'
)

const isSupportedRoute = (pathname: string): pathname is AppRoute => (
  supportedRoutes.includes(pathname as AppRoute)
)

export function useAppRoute() {
  const [route, setRoute] = useState<AppRoute>(() => getRoute(window.location.pathname))

  const navigate = useCallback((nextRoute: AppRoute) => {
    if (window.location.pathname === nextRoute) return
    window.history.pushState(null, '', nextRoute)
    setRoute(nextRoute)
  }, [])

  useEffect(() => {
    const normalizeRoute = () => {
      const { pathname } = window.location
      if (isSupportedRoute(pathname)) {
        setRoute(pathname)
        return
      }

      window.history.replaceState(null, '', '/')
      setRoute('/')
    }

    normalizeRoute()
    window.addEventListener('popstate', normalizeRoute)
    return () => window.removeEventListener('popstate', normalizeRoute)
  }, [])

  return { route, navigate }
}
