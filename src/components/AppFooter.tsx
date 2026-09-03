import type { AppRoute } from '../hooks/useAppRoute'

const SOURCE_URL = "https://github.com/bakesia/gifcam";

type AppFooterProps = {
  onNavigate: (route: AppRoute) => void
}

export function AppFooter({ onNavigate }: AppFooterProps) {
  const handleNavigation = (route: AppRoute) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    onNavigate(route)
  }

  return (
    <footer className="border-t border-zinc-300 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-5 text-sm text-zinc-600 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p className="font-machine text-[11px] tracking-wide text-zinc-500">
          GIFCAM · LOCAL IMAGE TO GIF
        </p>
        <nav
          className="flex flex-wrap items-center gap-x-4 gap-y-2"
          aria-label="GIFCAM 정보"
        >
          <a
            className="cursor-pointer font-bold text-zinc-800 underline-offset-4 transition hover:text-zinc-500 hover:underline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#a64132]"
            href={SOURCE_URL}
            target="_blank"
            rel="noreferrer"
          >
            Source
          </a>
          <a
            className="cursor-pointer font-bold text-zinc-800 underline-offset-4 transition hover:text-zinc-500 hover:underline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#a64132]"
            href="/privacy"
            onClick={handleNavigation('/privacy')}
          >
            Privacy
          </a>
          <a
            className="cursor-pointer font-bold text-zinc-800 underline-offset-4 transition hover:text-zinc-500 hover:underline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#a64132]"
            href="/licenses"
            onClick={handleNavigation('/licenses')}
          >
            Licenses
          </a>
        </nav>
      </div>
    </footer>
  );
}
