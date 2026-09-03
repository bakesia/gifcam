import type { AppRoute } from '../hooks/useAppRoute'

type AppHeaderProps = {
  onNavigate: (route: AppRoute) => void
}

export function AppHeader({ onNavigate }: AppHeaderProps) {
  const handleNavigateHome = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    onNavigate('/')
  }

  return (
    <header className="border-b border-zinc-500 bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center px-5 sm:px-8">
        <a className="flex items-center gap-2.5 text-xl font-bold tracking-[0.12em]" href="/" onClick={handleNavigateHome} aria-label="GIFCAM 작업 영역">
          <span className="grid size-8 place-items-center bg-zinc-900 text-white"><img className="size-[18px]" src="/favicon.svg" alt="" aria-hidden="true" /></span>
          GIFCAM
        </a>
      </div>
    </header>
  )
}

