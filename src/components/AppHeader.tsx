import { Aperture } from 'lucide-react'

export function AppHeader() {
  return (
    <header className="border-b border-zinc-500 bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center px-5 sm:px-8">
        <a className="flex items-center gap-2.5 text-xl font-bold tracking-[0.12em]" href="/" aria-label="GIFCAM 작업 영역">
          <span className="grid size-8 place-items-center bg-zinc-900 text-white"><Aperture size={18} strokeWidth={2.25} /></span>
          GIFCAM
        </a>
      </div>
    </header>
  )
}

