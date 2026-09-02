import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Download, X } from 'lucide-react'
import type { GeneratedGif } from '../types/gif'

type GifResultModalProps = {
  isOpen: boolean
  result: GeneratedGif | null
  onClose: () => void
  onDownload: () => void
}

const formatFileSize = (bytes: number) => {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function GifResultModal({ isOpen, result, onClose, onDownload }: GifResultModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!isOpen) return
    closeButtonRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && result && (
        <motion.div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
          <motion.section className="w-full max-w-2xl overflow-hidden border-2 border-zinc-950 bg-stone-100 shadow-[0_18px_45px_rgba(0,0,0,0.38)]" role="dialog" aria-modal="true" aria-labelledby="gif-result-title" initial={{ opacity: 0, y: 10, scale: 0.985 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.985 }} transition={{ duration: 0.16 }} onMouseDown={(event) => event.stopPropagation()}>
            <div className="film-sprockets h-3" aria-hidden="true" />
            <header className="flex items-center justify-between border-b-2 border-zinc-950 bg-zinc-900 px-4 py-3 text-stone-100"><div><p className="font-machine text-[10px] font-bold tracking-[0.16em] text-zinc-400">FILM / RESULT</p><h2 id="gif-result-title" className="mt-1 text-sm font-bold">생성된 GIF</h2></div><button ref={closeButtonRef} type="button" className="grid size-9 place-items-center border border-zinc-600 transition hover:border-stone-100 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#d06b58]" onClick={onClose} aria-label="결과 닫기"><X size={18} /></button></header>
            <div className="grid min-h-64 max-h-[58vh] place-items-center bg-zinc-950 p-4 sm:p-6"><img className="max-h-[50vh] max-w-full object-contain" src={result.previewUrl} alt="생성된 GIF 미리보기" draggable={false} /></div>
            <div className="border-t-2 border-zinc-950 bg-stone-100 p-4"><dl className="grid grid-cols-2 gap-x-4 gap-y-3 font-machine text-[11px] text-zinc-600 sm:grid-cols-4"><div><dt className="font-bold tracking-[0.08em]">FRAMES</dt><dd className="mt-0.5 text-zinc-900">{result.frameCount}</dd></div><div><dt className="font-bold tracking-[0.08em]">DURATION</dt><dd className="mt-0.5 text-zinc-900">{(result.durationMs / 1000).toFixed(1)} SEC</dd></div><div><dt className="font-bold tracking-[0.08em]">OUTPUT</dt><dd className="mt-0.5 text-zinc-900">{result.width}×{result.height}</dd></div><div><dt className="font-bold tracking-[0.08em]">SIZE</dt><dd className="mt-0.5 text-zinc-900">{formatFileSize(result.fileSize)}</dd></div></dl><button type="button" className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 border-2 border-[#33483a] bg-[#526556] px-4 text-sm font-bold text-white transition hover:bg-[#384a3d] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#a64132]" onClick={onDownload}><Download size={17} /> GIF 다운로드</button></div>
            <div className="film-sprockets h-3" aria-hidden="true" />
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
