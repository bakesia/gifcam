import type { AppRoute } from "../hooks/useAppRoute";

const SOURCE_URL = "https://github.com/bakesia/gifcam";
const CONTACT_URL = "https://github.com/bakesia/gifcam/issues";

type AppFooterProps = {
  onNavigate: (route: AppRoute) => void;
};

export function AppFooter({ onNavigate }: AppFooterProps) {
  const handleNavigation =
    (route: AppRoute) => (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      event.preventDefault();
      onNavigate(route);
    };

  return (
    <footer className="border-t border-zinc-300 bg-white">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        {/* 메인 푸터 */}
        <div className="flex flex-col gap-3 py-5 text-sm text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-machine text-[11px] tracking-wide text-zinc-500">
            GIFCAM · LOCAL IMAGE TO GIF
          </p>

          <nav
            className="flex flex-wrap items-center gap-x-4 gap-y-2"
            aria-label="GIFCAM 정보"
          >
            <a
              className="cursor-pointer font-bold text-zinc-800 underline-offset-4 transition hover:text-zinc-500 hover:underline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#a64132]"
              href="/about"
              onClick={handleNavigation("/about")}
            >
              About
            </a>

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
              onClick={handleNavigation("/privacy")}
            >
              Privacy
            </a>

            <a
              className="cursor-pointer font-bold text-zinc-800 underline-offset-4 transition hover:text-zinc-500 hover:underline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#a64132]"
              href="/licenses"
              onClick={handleNavigation("/licenses")}
            >
              Licenses
            </a>
          </nav>
        </div>

        {/* 하단 부가 정보 */}
        <div className="flex flex-col gap-2 border-t border-zinc-200 py-3 font-machine text-[10px] tracking-wide text-zinc-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026</p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>OPEN SOURCE</span>

            <a
              className="cursor-pointer transition hover:text-zinc-700 hover:underline hover:underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a64132]"
              href={CONTACT_URL}
              target="_blank"
              rel="noreferrer"
            >
              REPORT AN ISSUE
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
