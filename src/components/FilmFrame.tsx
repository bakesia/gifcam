import { useDragControls, Reorder } from 'motion/react'
import { Trash2 } from 'lucide-react'
import type { GifFrame } from '../types/gif'

type FilmFrameProps = {
  frame: GifFrame
  index: number
  isSelected: boolean
  onSelect: () => void
  onDelete: () => void
  onDelayChange: (delayMs: number) => void
}

export function FilmFrame({ frame, index, isSelected, onSelect, onDelete, onDelayChange }: FilmFrameProps) {
  const dragControls = useDragControls()

  const handleDelayChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const seconds = event.target.valueAsNumber
    if (Number.isFinite(seconds) && seconds > 0) onDelayChange(Math.round(seconds * 1000))
  }

  return (
    <Reorder.Item value={frame} drag="x" dragListener={false} dragControls={dragControls} style={{ touchAction: 'pan-y' }} className={`group relative h-[198px] shrink-0 basis-36 border bg-stone-300 p-1.5 ${isSelected ? 'border-[#d06b58] ring-2 ring-[#d06b58]' : 'border-zinc-800'}`}>
      <button type="button" className="grid h-[132px] w-full cursor-grab overflow-hidden bg-zinc-700 text-left active:cursor-grabbing focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#d06b58]" onPointerDown={(event) => dragControls.start(event)} onClick={onSelect} aria-pressed={isSelected}>
        <img className="h-[104px] w-full object-cover" src={frame.previewUrl} alt={`${String(index + 1).padStart(2, '0')}번 ${frame.file.name}`} draggable={false} />
        <span className="px-1.5 py-1 font-machine text-[10px] font-bold tracking-[0.08em] text-stone-100">{String(index + 1).padStart(2, '0')}</span>
      </button>
      <label className="mt-1 flex h-11 items-center gap-1 border border-zinc-500 bg-stone-100 px-2 font-machine text-[11px] text-zinc-700"><span className="sr-only">{String(index + 1).padStart(2, '0')}번 프레임 지연 시간</span><input className="h-9 min-w-0 flex-1 bg-transparent text-right text-sm font-bold outline-none focus:text-[#a64132]" type="number" min="0.1" step="0.1" value={frame.delayMs / 1000} onChange={handleDelayChange} /><span className="font-bold">초</span></label>
      <button type="button" className="absolute right-2 top-2 grid size-6 cursor-pointer place-items-center bg-zinc-900 text-white opacity-0 transition hover:bg-[#a64132] focus:opacity-100 group-hover:opacity-100 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#d06b58]" onClick={onDelete} aria-label={`${String(index + 1).padStart(2, '0')}번 프레임 삭제`}><Trash2 size={14} /></button>
    </Reorder.Item>
  )
}

