import type { GifFrame, LoopMode, OutputSettings, OutputSizePreset } from '../types/gif'
import { CameraControls } from './CameraControls'
import { Viewfinder } from './Viewfinder'

type CameraShellProps = {
  frames: GifFrame[]
  selectedFrame: GifFrame | null
  totalDurationMs: number
  dimensionsLabel: string
  defaultDelayMs: number
  outputSettings: OutputSettings
  onAddFiles: (files: FileList) => void
  onOpenFilePicker: () => void
  onDefaultDelayChange: (delayMs: number) => void
  onApplyDelayToAll: () => void
  onLoopModeChange: (loopMode: LoopMode) => void
  onSizePresetChange: (sizePreset: OutputSizePreset) => void
}

export function CameraShell({ frames, selectedFrame, totalDurationMs, dimensionsLabel, defaultDelayMs, outputSettings, onAddFiles, onOpenFilePicker, onDefaultDelayChange, onApplyDelayToAll, onLoopModeChange, onSizePresetChange }: CameraShellProps) {
  return (
    <>
      <div className="mx-auto flex h-7 w-[88%] items-end gap-3" aria-hidden="true"><span className="h-4 w-28 border-x-3 border-t-3 border-[#384a3d] bg-[#526556]" /><span className="h-3 w-14 border-x-3 border-t-3 border-zinc-500 bg-stone-100" /></div>
      <div className="border-[3px] border-[#33483a] bg-[#e7e5dc] p-4 shadow-[0_20px_35px_rgba(24,24,23,0.16)] sm:p-7 lg:grid lg:grid-cols-[minmax(0,1fr)_214px] lg:gap-7">
        <Viewfinder selectedFrame={selectedFrame} onAddFiles={onAddFiles} onOpenFilePicker={onOpenFilePicker} />
        <CameraControls frameCount={frames.length} totalDurationMs={totalDurationMs} dimensionsLabel={dimensionsLabel} defaultDelayMs={defaultDelayMs} outputSettings={outputSettings} onOpenFilePicker={onOpenFilePicker} onDefaultDelayChange={onDefaultDelayChange} onApplyDelayToAll={onApplyDelayToAll} onLoopModeChange={onLoopModeChange} onSizePresetChange={onSizePresetChange} />
      </div>
    </>
  )
}

