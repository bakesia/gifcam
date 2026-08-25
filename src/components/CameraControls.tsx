import { Plus } from 'lucide-react'
import type { LoopMode, OutputSettings, OutputSizePreset } from '../types/gif'
import { CameraLcd } from './CameraLcd'

type CameraControlsProps = {
  frameCount: number
  totalDurationMs: number
  dimensionsLabel: string
  defaultDelayMs: number
  outputSettings: OutputSettings
  onOpenFilePicker: () => void
  onDefaultDelayChange: (delayMs: number) => void
  onApplyDelayToAll: () => void
  onLoopModeChange: (loopMode: LoopMode) => void
  onSizePresetChange: (sizePreset: OutputSizePreset) => void
}

const parseSeconds = (event: React.ChangeEvent<HTMLInputElement>, onChange: (value: number) => void) => {
  const seconds = event.target.valueAsNumber
  if (Number.isFinite(seconds) && seconds > 0) onChange(Math.round(seconds * 1000))
}

export function CameraControls({ frameCount, totalDurationMs, dimensionsLabel, defaultDelayMs, outputSettings, onOpenFilePicker, onDefaultDelayChange, onApplyDelayToAll, onLoopModeChange, onSizePresetChange }: CameraControlsProps) {
  return (
    <aside className="mt-4 grid gap-4 lg:mt-0 lg:flex lg:flex-col lg:justify-center" aria-label="출력 설정">
      <CameraLcd frameCount={frameCount} totalDurationMs={totalDurationMs} dimensionsLabel={dimensionsLabel} />
      {frameCount > 0 && <button type="button" className="inline-flex min-h-12 items-center justify-center gap-2 border-2 border-[#455a4a] bg-white px-3 text-sm font-bold text-zinc-900 transition hover:-translate-y-0.5 hover:bg-stone-50 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#a64132]" onClick={onOpenFilePicker}><Plus size={18} /> 이미지 추가</button>}
      <div className="grid gap-3 border-t border-[#b7b3a6] pt-4">
        <label className="grid gap-1.5"><span className="font-machine text-[10px] font-bold tracking-[0.09em] text-zinc-600">기본 프레임 시간</span><span className="flex items-center border-2 border-[#9c9a90] bg-white px-2"><input className="min-w-0 flex-1 py-2 font-machine text-sm font-bold outline-none" type="number" min="0.1" step="0.1" value={defaultDelayMs / 1000} onChange={(event) => parseSeconds(event, onDefaultDelayChange)} /><span className="font-machine text-[10px] text-zinc-500">초</span></span></label>
        <button type="button" className="border-2 border-[#455a4a] bg-[#526556] px-3 py-2 font-machine text-[12px] font-bold tracking-[0.05em] text-white transition hover:bg-[#384a3d] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#a64132]" onClick={onApplyDelayToAll}>모든 프레임에 적용</button>
        <label className="grid gap-1.5"><span className="font-machine text-[10px] font-bold tracking-[0.09em] text-zinc-600">반복 설정</span><select className="border-2 border-[#9c9a90] bg-white px-2 py-2 text-sm font-bold outline-none focus:border-[#a64132]" value={outputSettings.loopMode} onChange={(event) => onLoopModeChange(event.target.value as LoopMode)}><option value="forever">무한 반복</option><option value="once">한 번</option></select></label>
        <label className="grid gap-1.5"><span className="font-machine text-[10px] font-bold tracking-[0.09em] text-zinc-600">출력 크기</span><select className="border-2 border-[#9c9a90] bg-white px-2 py-2 text-sm font-bold outline-none focus:border-[#a64132]" value={outputSettings.sizePreset} onChange={(event) => { const value = event.target.value; onSizePresetChange(value === 'first-image' ? value : Number(value) as 1920 | 1280 | 720) }}><option value="first-image">첫 번째 이미지 기준</option><option value="1920">1920 px</option><option value="1280">1280 px</option><option value="720">720 px</option></select><span className="font-machine text-[10px] text-zinc-500">{dimensionsLabel}</span></label>
      </div>
    </aside>
  )
}

