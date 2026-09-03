import type { GifGenerationProgress, GifGenerationStatus } from '../types/gif'

type ShutterControlProps = {
  status: GifGenerationStatus
  progress: GifGenerationProgress | null
  hasCurrentResult: boolean
  onAction: () => void
}

const getEncodingLabel = (progress: GifGenerationProgress | null) => {
  if (progress?.stage === 'rendering') {
    return `프레임 ${progress.currentFrame} / ${progress.totalFrames}`
  }
  if (progress?.stage === 'encoding') return 'GIF 인코딩 중'
  if (progress?.stage === 'finalizing') return '마무리 중...'
  return '이미지 준비 중'
}

export function ShutterControl({ status, progress, hasCurrentResult, onAction }: ShutterControlProps) {
  const isEncoding = status === 'encoding'
  const label = isEncoding ? getEncodingLabel(progress) : hasCurrentResult ? '결과 보기' : 'GIF 만들기'

  return (
    <button type="button" className="inline-flex min-h-10 min-w-0 max-w-full flex-1 cursor-pointer items-center justify-center gap-1 whitespace-nowrap border-2 border-[#33483a] bg-[#526556] px-1.5 text-[11px] font-bold text-white shadow-[inset_0_2px_0_rgba(255,255,255,0.16),0_2px_0_#25342a] transition-[transform,box-shadow,background-color,border-color] duration-100 sm:w-44 sm:flex-none sm:gap-2 sm:px-5 sm:text-sm enabled:hover:-translate-y-0.5 enabled:hover:border-[#25342a] enabled:hover:bg-[#5d705f] enabled:hover:shadow-[inset_0_2px_0_rgba(255,255,255,0.16),0_4px_0_#25342a] enabled:active:translate-y-0.5 enabled:active:shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_0_0_#25342a] disabled:cursor-not-allowed disabled:opacity-65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2" onClick={onAction} disabled={isEncoding} aria-label={label} aria-busy={isEncoding}>
      <span className="size-2 border border-[#25342a] bg-[#e7e5dc]" aria-hidden="true" />
      {label}
    </button>
  )
}
