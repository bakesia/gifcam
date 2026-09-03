import { useEffect, useRef } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
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
  const reduceMotion = useReducedMotion()
  const shortDuration = reduceMotion ? 0.01 : 0.16

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
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: shortDuration }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose()
          }}
        >
          <motion.section
            className="w-full max-w-2xl overflow-hidden border-2 border-zinc-950 bg-stone-100 shadow-[0_18px_45px_rgba(0,0,0,0.38)]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="gif-result-title"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.985 }}
            transition={{ duration: reduceMotion ? 0.01 : 0.26, ease: 'easeOut' }}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="film-sprockets h-3" aria-hidden="true" />

            <header className="flex items-center justify-between border-b-2 border-zinc-950 bg-zinc-900 px-4 py-3 text-stone-100">
              <div className="flex items-center gap-4">
                <div>
                  <p className="font-machine text-[10px] font-bold tracking-[0.16em] text-zinc-400">FILM 01 / RESULT</p>
                  <h2 id="gif-result-title" className="mt-1 text-sm font-bold">생성된 GIF</h2>
                </div>
                <span className="hidden items-center gap-1.5 font-machine text-[9px] tracking-[0.14em] text-zinc-500 sm:inline-flex"><span className="size-1.5 bg-[#a64132]" /> REC COMPLETE</span>
              </div>
              <button ref={closeButtonRef} type="button" className="grid size-9 cursor-pointer place-items-center border border-zinc-600 transition hover:border-stone-100 hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#d06b58]" onClick={onClose} aria-label="결과 닫기"><X size={18} /></button>
            </header>

            <motion.div
              className="relative grid min-h-64 max-h-[58vh] place-items-center overflow-hidden bg-zinc-950 p-4 sm:p-6"
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
              animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
              transition={{ duration: reduceMotion ? 0.01 : 0.24, delay: reduceMotion ? 0 : 0.12, ease: 'easeOut' }}
            >
              <span className="absolute left-3 top-3 size-4 border-l border-t border-zinc-600" aria-hidden="true" />
              <span className="absolute right-3 top-3 size-4 border-r border-t border-zinc-600" aria-hidden="true" />
              <span className="absolute bottom-3 left-3 size-4 border-b border-l border-zinc-600" aria-hidden="true" />
              <span className="absolute bottom-3 right-3 size-4 border-b border-r border-zinc-600" aria-hidden="true" />
              <img className="max-h-[50vh] max-w-full object-contain" src={result.previewUrl} alt="생성된 GIF 미리보기" draggable={false} />
            </motion.div>

            <motion.div
              className="border-t-2 border-zinc-950 bg-stone-100 p-4"
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0.01 : 0.18, delay: reduceMotion ? 0 : 0.3 }}
            >
              <dl className="grid grid-cols-2 gap-x-4 gap-y-3 font-machine text-[11px] text-zinc-600 sm:grid-cols-4">
                <div><dt className="font-bold tracking-[0.08em]">FRAMES</dt><dd className="mt-0.5 text-zinc-900">{result.frameCount}</dd></div>
                <div><dt className="font-bold tracking-[0.08em]">DURATION</dt><dd className="mt-0.5 text-zinc-900">{(result.durationMs / 1000).toFixed(1)} SEC</dd></div>
                <div><dt className="font-bold tracking-[0.08em]">OUTPUT</dt><dd className="mt-0.5 text-zinc-900">{result.width}×{result.height}</dd></div>
                <div><dt className="font-bold tracking-[0.08em]">SIZE</dt><dd className="mt-0.5 text-zinc-900">{formatFileSize(result.fileSize)}</dd></div>
              </dl>
              <button type="button" className="mt-4 inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 border-2 border-[#33483a] bg-[#526556] px-4 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:border-[#25342a] hover:bg-[#384a3d] hover:shadow-[0_2px_0_#25342a] active:translate-y-0 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#a64132]" onClick={onDownload}><Download size={17} /> GIF 다운로드</button>
            </motion.div>

            <div className="film-sprockets h-3" aria-hidden="true" />
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
