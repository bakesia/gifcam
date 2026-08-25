import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Images, Upload } from 'lucide-react'
import type { GifFrame } from '../types/gif'

type ViewfinderProps = {
  selectedFrame: GifFrame | null
  onAddFiles: (files: FileList) => void
  onOpenFilePicker: () => void
}

export function Viewfinder({ selectedFrame, onAddFiles, onOpenFilePicker }: ViewfinderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const canDropInitialImage = selectedFrame === null

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)
    onAddFiles(event.dataTransfer.files)
  }

  return (
    <section className="min-w-0" aria-label="선택된 이미지 미리보기">
      <div className="mb-2 flex items-center gap-2 font-machine text-[12px] font-bold tracking-[0.16em] text-zinc-600"><span className="size-2 bg-[#a64132]" /> VIEWFINDER</div>
      <div className={`relative grid min-h-80 place-items-center overflow-hidden border-[3px] bg-zinc-900 transition-colors sm:min-h-105 ${canDropInitialImage && isDragging ? 'border-[#a64132] bg-zinc-800' : 'border-zinc-700'}`} onDragEnter={canDropInitialImage ? (event) => { event.preventDefault(); setIsDragging(true) } : undefined} onDragOver={canDropInitialImage ? (event) => event.preventDefault() : undefined} onDragLeave={canDropInitialImage ? (event) => { if (event.currentTarget === event.target) setIsDragging(false) } : undefined} onDrop={canDropInitialImage ? handleDrop : undefined}>
        <AnimatePresence mode="wait">
          {selectedFrame ? <motion.img key={selectedFrame.id} className="block size-full max-h-140 object-contain" src={selectedFrame.previewUrl} alt={`${selectedFrame.file.name} 미리보기`} draggable={false} onDragStart={(event) => event.preventDefault()} initial={{ opacity: 0.35, scale: 0.985 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0.35 }} transition={{ duration: 0.18 }} /> : (
            <motion.div className="grid justify-items-center gap-3 p-8 text-center text-stone-100" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><Images size={34} strokeWidth={1.4} /><strong className="text-base">첫 사진을 넣어주세요</strong><span className="text-sm text-zinc-400">혹은, 사진을 이 영역으로 끌어다 놓으세요.</span><button type="button" className="mt-1 inline-flex items-center gap-2 bg-[#a64132] px-4 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#8c382b] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#d06b58]" onClick={onOpenFilePicker}><Upload size={16} /> 이미지 추가</button></motion.div>
          )}
        </AnimatePresence>
        {canDropInitialImage && isDragging && <div className="absolute inset-3 z-10 grid place-items-center border-2 border-dashed border-[#d06b58] bg-zinc-900/90 font-bold text-stone-100">여기에 이미지를 놓으세요</div>}
      </div>
    </section>
  )
}

