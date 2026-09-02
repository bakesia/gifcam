import { useEffect, useMemo, useRef, useState } from 'react'
import { AppHeader } from './components/AppHeader'
import { CameraShell } from './components/CameraShell'
import { FilmStrip } from './components/FilmStrip'
import { formatDimensions, getOutputDimensions } from './lib/outputSize'
import { useGifFrames } from './hooks/useGifFrames'
import type { OutputSettings } from './types/gif'
import './App.css'

const ACCEPTED_IMAGES = 'image/jpeg,image/png,image/webp'
const INITIAL_OUTPUT_SETTINGS: OutputSettings = {
  sizePreset: 'first-image',
  customWidth: 640,
  customHeight: 480,
  fitMode: 'contain',
  backgroundColor: 'black',
  loop: { type: 'infinite' },
}

function App() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [outputSettings, setOutputSettings] = useState(INITIAL_OUTPUT_SETTINGS)
  const [hasAdjustedOutputSettings, setHasAdjustedOutputSettings] = useState(false)
  const {
    frames,
    selectedFrame,
    selectedFrameId,
    defaultDelayMs,
    uploadMessage,
    addFiles,
    removeFrame,
    reorderFrames,
    updateFrameDelay,
    applyDelayToAll,
    setDefaultDelayMs,
    selectFrame,
  } = useGifFrames()
  const totalDurationMs = frames.reduce((total, frame) => total + frame.delayMs, 0)
  const outputDimensions = useMemo(
    () => getOutputDimensions(frames[0], outputSettings),
    [frames, outputSettings],
  )
  const dimensionsLabel = formatDimensions(outputDimensions)
  const openFilePicker = () => inputRef.current?.click()
  const updateVisualOutputSettings = (settings: OutputSettings) => {
    setHasAdjustedOutputSettings(true)
    setOutputSettings(settings)
  }

  useEffect(() => {
    if (frames.length === 0) setHasAdjustedOutputSettings(false)
  }, [frames.length])

  return (
    <div className="min-h-screen bg-stone-100 text-zinc-900">
      <AppHeader />
      <main className="px-4 py-7 sm:px-8 sm:py-10">
        <section className="mx-auto max-w-6xl" id="workspace" aria-label="GIFCAM 이미지 작업 영역">
          <CameraShell frames={frames} selectedFrame={selectedFrame} totalDurationMs={totalDurationMs} dimensionsLabel={dimensionsLabel} outputDimensions={outputDimensions} defaultDelayMs={defaultDelayMs} outputSettings={outputSettings} useCanvasPreview={hasAdjustedOutputSettings} onAddFiles={addFiles} onOpenFilePicker={openFilePicker} onDefaultDelayChange={setDefaultDelayMs} onApplyDelayToAll={() => applyDelayToAll(defaultDelayMs)} onOutputSettingsChange={setOutputSettings} onVisualOutputSettingsChange={updateVisualOutputSettings} />
          <FilmStrip frames={frames} selectedFrameId={selectedFrameId} onReorder={reorderFrames} onSelect={selectFrame} onDelete={removeFrame} onDelayChange={updateFrameDelay} />
        </section>
        <p className={`mx-auto mt-3 max-w-6xl text-center font-machine text-[11px] tracking-wide text-zinc-500 sm:text-right ${uploadMessage ? 'text-[#a64132]' : ''}`} role="status">{uploadMessage ?? 'JPEG · PNG · WebP · 파일은 기기 밖으로 전송되지 않습니다.'}</p>
      </main>
      <input ref={inputRef} className="sr-only" type="file" accept={ACCEPTED_IMAGES} multiple onChange={(event) => { if (event.target.files) addFiles(event.target.files); event.target.value = '' }} />
    </div>
  )
}

export default App
