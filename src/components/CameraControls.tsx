import { useRef } from 'react'
import { Plus } from 'lucide-react'
import { isValidOutputDimension } from '../lib/outputSize'
import type { BackgroundColor, FitMode, LoopSetting, OutputSettings } from '../types/gif'
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
  onOutputSettingsChange: (settings: OutputSettings) => void
  onVisualOutputSettingsChange: (settings: OutputSettings) => void
}

const parsePositiveInteger = (value: number, minimum: number) =>
  Number.isFinite(value) && value >= minimum ? Math.round(value) : null

export function CameraControls({ frameCount, totalDurationMs, dimensionsLabel, defaultDelayMs, outputSettings, onOpenFilePicker, onDefaultDelayChange, onApplyDelayToAll, onOutputSettingsChange, onVisualOutputSettingsChange }: CameraControlsProps) {
  const rememberedLoopCount = useRef(outputSettings.loop.type === 'count' ? outputSettings.loop.count : 3)
  const updateSettings = (partial: Partial<OutputSettings>) => onOutputSettingsChange({ ...outputSettings, ...partial })
  const updateVisualSettings = (partial: Partial<OutputSettings>) => onVisualOutputSettingsChange({ ...outputSettings, ...partial })

  const handleDefaultDelay = (event: React.ChangeEvent<HTMLInputElement>) => {
    const seconds = event.target.valueAsNumber
    if (Number.isFinite(seconds) && seconds > 0) onDefaultDelayChange(Math.round(seconds * 1000))
  }

  const handleLoopType = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const loop: LoopSetting = event.target.value === 'infinite'
      ? { type: 'infinite' }
      : { type: 'count', count: rememberedLoopCount.current }
    updateSettings({ loop })
  }

  const handleLoopCount = (event: React.ChangeEvent<HTMLInputElement>) => {
    const count = parsePositiveInteger(event.target.valueAsNumber, 1)
    if (count === null) return
    rememberedLoopCount.current = count
    updateSettings({ loop: { type: 'count', count } })
  }

  const handleCustomDimension = (key: 'customWidth' | 'customHeight', value: string) => {
    if (value === '') {
      updateVisualSettings({ [key]: null })
      return
    }

    const dimension = Number(value)
    if (!Number.isFinite(dimension)) return
    updateVisualSettings({ [key]: Math.max(0, Math.round(dimension)) })
  }

  const hasInvalidCustomDimensions = outputSettings.sizePreset === 'custom'
    && (!isValidOutputDimension(outputSettings.customWidth) || !isValidOutputDimension(outputSettings.customHeight))

  return (
    <aside className="mt-4 grid gap-4 lg:mt-0 lg:flex lg:self-stretch lg:flex-col lg:justify-center" aria-label="출력 설정">
      <CameraLcd frameCount={frameCount} totalDurationMs={totalDurationMs} dimensionsLabel={dimensionsLabel} loop={outputSettings.loop} />
      {frameCount > 0 && <button type="button" className="inline-flex min-h-12 items-center justify-center gap-2 border-2 border-[#455a4a] bg-white px-3 text-sm font-bold text-zinc-900 transition hover:-translate-y-0.5 hover:bg-stone-50 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#a64132]" onClick={onOpenFilePicker}><Plus size={18} /> 이미지 추가</button>}
      <div className="grid gap-3 border-t border-[#b7b3a6] pt-4">
        <label className="grid gap-1.5"><span className="font-machine text-[10px] font-bold tracking-[0.09em] text-zinc-600">기본 프레임 시간</span><span className="flex items-center border-2 border-[#9c9a90] bg-white px-2"><input className="min-w-0 flex-1 py-2 font-machine text-sm font-bold outline-none" type="number" min="0.1" step="0.1" value={defaultDelayMs / 1000} onChange={handleDefaultDelay} /><span className="font-machine text-[10px] text-zinc-500">초</span></span></label>
        <button type="button" className="border-2 border-[#455a4a] bg-[#526556] px-3 py-2 font-machine text-[12px] font-bold tracking-[0.05em] text-white transition hover:bg-[#384a3d] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#a64132]" onClick={onApplyDelayToAll}>모든 프레임에 적용</button>

        <fieldset className="grid gap-1.5"><legend className="font-machine text-[10px] font-bold tracking-[0.09em] text-zinc-600">LOOP</legend><select className="border-2 border-[#9c9a90] bg-white px-2 py-2 text-sm font-bold outline-none focus:border-[#a64132]" value={outputSettings.loop.type} onChange={handleLoopType}><option value="infinite">무한 반복</option><option value="count">횟수 지정</option></select>{outputSettings.loop.type === 'count' && <label className="flex items-center gap-2"><input className="min-w-0 flex-1 border-2 border-[#9c9a90] bg-white px-2 py-2 font-machine text-sm font-bold outline-none focus:border-[#a64132]" type="number" min="1" step="1" value={outputSettings.loop.count} onChange={handleLoopCount} /><span className="text-sm font-bold">회</span></label>}</fieldset>

        <fieldset className="grid gap-1.5"><legend className="font-machine text-[10px] font-bold tracking-[0.09em] text-zinc-600">OUTPUT</legend><select className="border-2 border-[#9c9a90] bg-white px-2 py-2 text-sm font-bold outline-none focus:border-[#a64132]" value={outputSettings.sizePreset} onChange={(event) => { const value = event.target.value; updateVisualSettings({ sizePreset: value === 'first-image' || value === 'custom' ? value : Number(value) as 1920 | 1280 | 720 }) }}><option value="first-image">첫 번째 이미지 기준</option><option value="1920">최대 1920px</option><option value="1280">최대 1280px</option><option value="720">최대 720px</option><option value="custom">직접 입력</option></select>{outputSettings.sizePreset === 'custom' && <div className="grid gap-2"><div className="grid grid-cols-2 gap-2"><label className="grid gap-1 text-xs font-bold">가로<input className="min-w-0 border-2 border-[#9c9a90] bg-white px-2 py-2 font-machine text-sm font-bold outline-none focus:border-[#a64132]" type="number" min="0" step="1" value={outputSettings.customWidth ?? ''} onChange={(event) => handleCustomDimension('customWidth', event.target.value)} /></label><label className="grid gap-1 text-xs font-bold">세로<input className="min-w-0 border-2 border-[#9c9a90] bg-white px-2 py-2 font-machine text-sm font-bold outline-none focus:border-[#a64132]" type="number" min="0" step="1" value={outputSettings.customHeight ?? ''} onChange={(event) => handleCustomDimension('customHeight', event.target.value)} /></label></div>{hasInvalidCustomDimensions && <p className="text-xs font-bold text-[#a64132]" role="status">가로와 세로 크기를 1px 이상 입력해 주세요.</p>}</div>}<span className="text-xs font-bold text-zinc-500">결과: <span className="font-machine">{dimensionsLabel}</span></span></fieldset>

        <fieldset className="grid gap-1.5"><legend className="font-machine text-[10px] font-bold tracking-[0.09em] text-zinc-600">FIT</legend><select className="border-2 border-[#9c9a90] bg-white px-2 py-2 text-sm font-bold outline-none focus:border-[#a64132]" value={outputSettings.fitMode} onChange={(event) => updateVisualSettings({ fitMode: event.target.value as FitMode })}><option value="contain">전체 보기</option><option value="crop">채우기</option></select></fieldset>

        <fieldset className="grid gap-1.5"><legend className="font-machine text-[10px] font-bold tracking-[0.09em] text-zinc-600">BACKGROUND</legend><select className="border-2 border-[#9c9a90] bg-white px-2 py-2 text-sm font-bold outline-none focus:border-[#a64132]" value={outputSettings.backgroundColor} onChange={(event) => updateVisualSettings({ backgroundColor: event.target.value as BackgroundColor })}><option value="black">검정</option><option value="white">흰색</option></select></fieldset>
      </div>
    </aside>
  )
}
