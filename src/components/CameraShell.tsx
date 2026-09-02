import type { Dimensions, GifFrame, GifGenerationStatus, OutputSettings } from '../types/gif'
import { CameraControls } from './CameraControls'
import { ShutterControl } from './ShutterControl'
import { Viewfinder } from './Viewfinder'

type CameraShellProps = {
  frames: GifFrame[]
  selectedFrame: GifFrame | null
  totalDurationMs: number
  dimensionsLabel: string
  outputDimensions: Dimensions | null
  defaultDelayMs: number
  outputSettings: OutputSettings
  useCanvasPreview: boolean
  generationStatus: GifGenerationStatus
  hasCurrentResult: boolean
  onAddFiles: (files: FileList) => void
  onOpenFilePicker: () => void
  onDefaultDelayChange: (delayMs: number) => void
  onApplyDelayToAll: () => void
  onOutputSettingsChange: (settings: OutputSettings) => void
  onVisualOutputSettingsChange: (settings: OutputSettings) => void
  onGenerationAction: () => void
}

export function CameraShell({ frames, selectedFrame, totalDurationMs, dimensionsLabel, outputDimensions, defaultDelayMs, outputSettings, useCanvasPreview, generationStatus, hasCurrentResult, onAddFiles, onOpenFilePicker, onDefaultDelayChange, onApplyDelayToAll, onOutputSettingsChange, onVisualOutputSettingsChange, onGenerationAction }: CameraShellProps) {
  return (
    <>
      <div className="mx-auto flex min-h-11 w-[88%] items-end justify-between gap-3"><div className="flex items-end gap-3" aria-hidden="true"><span className="h-4 w-28 border-x-3 border-t-3 border-[#384a3d] bg-[#526556]" /><span className="h-3 w-14 border-x-3 border-t-3 border-zinc-500 bg-stone-100" /></div><ShutterControl status={generationStatus} hasCurrentResult={hasCurrentResult} onAction={onGenerationAction} /></div>
      <div className="border-[3px] border-[#33483a] bg-[#e7e5dc] p-4 shadow-[0_20px_35px_rgba(24,24,23,0.16)] sm:p-7 lg:grid lg:grid-cols-[minmax(0,1fr)_214px] lg:items-stretch lg:gap-7">
        <Viewfinder selectedFrame={selectedFrame} outputDimensions={outputDimensions} fitMode={outputSettings.fitMode} backgroundColor={outputSettings.backgroundColor} useCanvasPreview={useCanvasPreview} onAddFiles={onAddFiles} onOpenFilePicker={onOpenFilePicker} />
        <CameraControls frameCount={frames.length} totalDurationMs={totalDurationMs} dimensionsLabel={dimensionsLabel} defaultDelayMs={defaultDelayMs} outputSettings={outputSettings} onOpenFilePicker={onOpenFilePicker} onDefaultDelayChange={onDefaultDelayChange} onApplyDelayToAll={onApplyDelayToAll} onOutputSettingsChange={onOutputSettingsChange} onVisualOutputSettingsChange={onVisualOutputSettingsChange} />
      </div>
    </>
  )
}

