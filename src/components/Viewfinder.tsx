import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { Images, Upload } from 'lucide-react'
import { renderFrameToCanvas } from '../lib/image/renderFrame'
import type { BackgroundColor, Dimensions, FitMode, GifFrame } from '../types/gif'

type ViewfinderProps = {
  selectedFrame: GifFrame | null
  outputDimensions: Dimensions | null
  fitMode: FitMode
  backgroundColor: BackgroundColor
  useCanvasPreview: boolean
  onAddFiles: (files: FileList) => void
  onOpenFilePicker: () => void
}

export function Viewfinder({ selectedFrame, outputDimensions, fitMode, backgroundColor, useCanvasPreview, onAddFiles, onOpenFilePicker }: ViewfinderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [readyCanvasKey, setReadyCanvasKey] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<{ frameId: string; image: HTMLImageElement } | null>(null)
  const drawPreviewRef = useRef<() => void>(() => undefined)
  const canDropInitialImage = selectedFrame === null
  const selectedPreviewUrl = selectedFrame?.previewUrl
  const selectedFrameId = selectedFrame?.id ?? null
  const canvasKey = selectedFrameId && outputDimensions
    ? `${selectedFrameId}:${outputDimensions.width}x${outputDimensions.height}:${fitMode}:${backgroundColor}`
    : null
  const latestCanvasKeyRef = useRef<string | null>(canvasKey)
  const shouldShowCanvasPreview = useCanvasPreview && readyCanvasKey === canvasKey

  useLayoutEffect(() => {
    latestCanvasKeyRef.current = canvasKey
  }, [canvasKey])

  const drawPreview = useCallback(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    const source = imageRef.current
    if (!container || !canvas || !source || !outputDimensions || !canvasKey || source.frameId !== selectedFrameId) return

    const scale = Math.min(
      container.clientWidth / outputDimensions.width,
      container.clientHeight / outputDimensions.height,
    )
    const displayWidth = Math.max(1, Math.round(outputDimensions.width * scale))
    const displayHeight = Math.max(1, Math.round(outputDimensions.height * scale))
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)

    canvas.style.width = `${displayWidth}px`
    canvas.style.height = `${displayHeight}px`
    renderFrameToCanvas(canvas, source.image, {
      dimensions: {
        width: Math.round(displayWidth * pixelRatio),
        height: Math.round(displayHeight * pixelRatio),
      },
      fitMode,
      backgroundColor,
    })
    if (latestCanvasKeyRef.current === canvasKey) setReadyCanvasKey(canvasKey)
  }, [backgroundColor, canvasKey, fitMode, outputDimensions, selectedFrameId])

  useEffect(() => {
    drawPreviewRef.current = drawPreview
  }, [drawPreview])

  useEffect(() => {
    if (!selectedPreviewUrl || !selectedFrameId || !useCanvasPreview) {
      imageRef.current = null
      return
    }

    let cancelled = false
    const image = new Image()
    image.onload = () => {
      if (cancelled) return
      imageRef.current = { frameId: selectedFrameId, image }
      drawPreviewRef.current()
    }
    image.src = selectedPreviewUrl

    // 선택이 빠르게 바뀌어도 이전 프레임의 늦은 디코딩 결과가 현재 Canvas를 덮지 않게 한다.
    return () => {
      cancelled = true
      if (imageRef.current?.frameId === selectedFrameId) imageRef.current = null
      image.src = ''
    }
  }, [selectedFrameId, selectedPreviewUrl, useCanvasPreview])

  useEffect(() => {
    const container = containerRef.current
    if (!container || !useCanvasPreview) return

    const observer = new ResizeObserver(drawPreview)
    observer.observe(container)
    drawPreview()
    return () => observer.disconnect()
  }, [drawPreview, useCanvasPreview])

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)
    onAddFiles(event.dataTransfer.files)
  }

  return (
    <section className="min-w-0 lg:flex lg:h-full lg:flex-col" aria-label="선택된 이미지 미리보기">
      <div className="mb-2 flex items-center gap-2 font-machine text-[12px] font-bold tracking-[0.16em] text-zinc-600"><span className="size-2 bg-[#a64132]" /> VIEWFINDER</div>
      <div ref={containerRef} className={`relative grid min-h-80 place-items-center overflow-hidden border-[3px] bg-zinc-900 transition-colors sm:min-h-105 lg:flex-1 ${canDropInitialImage && isDragging ? 'border-[#a64132] bg-zinc-800' : 'border-zinc-700'}`} onDragEnter={canDropInitialImage ? (event) => { event.preventDefault(); setIsDragging(true) } : undefined} onDragOver={canDropInitialImage ? (event) => event.preventDefault() : undefined} onDragLeave={canDropInitialImage ? (event) => { if (event.currentTarget === event.target) setIsDragging(false) } : undefined} onDrop={canDropInitialImage ? handleDrop : undefined}>
        {selectedFrame ? <motion.div key={selectedFrame.id} className="absolute inset-0 grid place-items-center" initial={{ opacity: 0.35, scale: 0.985 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.18 }}><img className={`block size-full max-h-full max-w-full object-contain ${shouldShowCanvasPreview ? 'hidden' : ''}`} src={selectedFrame.previewUrl} alt={`${selectedFrame.file.name} 원본 미리보기`} draggable={false} onDragStart={(event) => event.preventDefault()} />{useCanvasPreview && <canvas ref={canvasRef} className={`max-h-full max-w-full ${shouldShowCanvasPreview ? 'block' : 'hidden'}`} aria-label={`${selectedFrame.file.name} 최종 프레임 미리보기`} />}</motion.div> : (
          <motion.div className="grid justify-items-center gap-3 p-8 text-center text-stone-100" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><Images size={34} strokeWidth={1.4} /><strong className="text-base">첫 사진을 넣어주세요</strong><span className="text-sm text-zinc-400">혹은, 사진을 이 영역으로 끌어다 놓으세요.</span><button type="button" className="mt-1 inline-flex items-center gap-2 bg-[#a64132] px-4 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#8c382b] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#d06b58]" onClick={onOpenFilePicker}><Upload size={16} /> 이미지 추가</button></motion.div>
        )}
        {canDropInitialImage && isDragging && <div className="absolute inset-3 z-10 grid place-items-center border-2 border-dashed border-[#d06b58] bg-zinc-900/90 font-bold text-stone-100">여기에 이미지를 놓으세요</div>}
      </div>
    </section>
  )
}
