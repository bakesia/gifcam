import { Reorder } from 'motion/react'
import type { GifFrame } from '../types/gif'
import { FilmFrame } from './FilmFrame'

type FilmStripProps = {
  frames: GifFrame[]
  selectedFrameId: string | null
  onReorder: (frames: GifFrame[]) => void
  onSelect: (frameId: string) => void
  onDelete: (frameId: string) => void
  onDelayChange: (frameId: string, delayMs: number) => void
}

export function FilmStrip({ frames, selectedFrameId, onReorder, onSelect, onDelete, onDelayChange }: FilmStripProps) {
  return (
    <section className="border-x-[3px] border-b-[3px] border-zinc-950 bg-zinc-900 p-3 text-stone-100" aria-label="필름 스트립">
      <div className="mb-2 flex justify-between px-1 font-machine text-[10px] font-bold tracking-[0.11em] text-zinc-400"><span><i className="mr-1.5 inline-block size-2 bg-[#a64132]" />FILM</span><span>{frames.length ? `${frames.length} FRAMES` : 'EMPTY'}</span></div>
      {frames.length > 1 && <p className="mb-2 px-1 text-xs font-bold text-zinc-400">사진을 드래그해 순서를 바꿀 수 있어요.</p>}
      {frames.length === 0 ? <div className="film-sprockets flex min-h-36 items-center justify-center border border-dashed border-zinc-600 px-4 text-center text-sm text-zinc-500">업로드한 사진이 이곳에 프레임으로 표시됩니다</div> : (
        <Reorder.Group axis="x" values={frames} onReorder={onReorder} layoutScroll className="film-sprockets flex min-h-[214px] gap-2 overflow-x-auto p-2">
          {frames.map((frame, index) => <FilmFrame key={frame.id} frame={frame} index={index} isSelected={frame.id === selectedFrameId} onSelect={() => onSelect(frame.id)} onDelete={() => onDelete(frame.id)} onDelayChange={(delayMs) => onDelayChange(frame.id, delayMs)} />)}
        </Reorder.Group>
      )}
    </section>
  )
}

