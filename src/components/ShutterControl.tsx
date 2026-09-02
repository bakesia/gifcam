import { motion } from 'motion/react'
import type { GifGenerationStatus } from '../types/gif'

type ShutterControlProps = {
  status: GifGenerationStatus
  hasCurrentResult: boolean
  onAction: () => void
}

export function ShutterControl({ status, hasCurrentResult, onAction }: ShutterControlProps) {
  const isEncoding = status === 'encoding'
  const label = isEncoding ? '만드는 중...' : hasCurrentResult ? '결과 보기' : 'GIF 만들기'

  return (
    <motion.button type="button" className="inline-flex min-h-10 w-44 shrink-0 items-center justify-center gap-2 border-2 border-[#33483a] bg-[#526556] px-5 font-bold text-white shadow-[inset_0_2px_0_rgba(255,255,255,0.16),0_2px_0_#25342a] disabled:cursor-wait disabled:opacity-65" onClick={onAction} disabled={isEncoding} aria-label={label} aria-busy={isEncoding} whileTap={isEncoding ? undefined : { y: 1 }}>
      <span className="size-2 border border-[#25342a] bg-[#e7e5dc]" aria-hidden="true" />
      {label}
    </motion.button>
  )
}
