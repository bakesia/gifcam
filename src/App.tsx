import { useEffect, useMemo, useRef, useState } from "react";
import { AppHeader } from "./components/AppHeader";
import { CameraShell } from "./components/CameraShell";
import { FilmStrip } from "./components/FilmStrip";
import { GifResultModal } from "./components/GifResultModal";
import { formatDimensions, getOutputDimensions } from "./lib/outputSize";
import { useGifGeneration } from "./hooks/useGifGeneration";
import { useGifFrames } from "./hooks/useGifFrames";
import type { OutputSettings } from "./types/gif";
import "./App.css";

const ACCEPTED_IMAGES = "image/jpeg,image/png,image/webp";

const INITIAL_OUTPUT_SETTINGS: OutputSettings = {
  sizePreset: "first-image",
  customWidth: 640,
  customHeight: 480,
  fitMode: "contain",
  backgroundColor: "black",
  loop: { type: "infinite" },
};

function hasVisualOutputSettingsChange(
  current: OutputSettings,
  next: OutputSettings,
) {
  return (
    current.sizePreset !== next.sizePreset ||
    current.customWidth !== next.customWidth ||
    current.customHeight !== next.customHeight ||
    current.fitMode !== next.fitMode ||
    current.backgroundColor !== next.backgroundColor
  );
}

function App() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [outputSettings, setOutputSettings] = useState(INITIAL_OUTPUT_SETTINGS);
  const [hasAdjustedOutputSettings, setHasAdjustedOutputSettings] =
    useState(false);
  const [outputSettingsVersion, setOutputSettingsVersion] = useState(0);
  const [uploadSettingsVersion, setUploadSettingsVersion] = useState<
    number | null
  >(null);
  const [dismissedResultSignature, setDismissedResultSignature] =
    useState<string | null>(null);

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
  } = useGifFrames();
  const {
    status: generationStatus,
    result: generatedResult,
    errorMessage: generationError,
    createGif,
    downloadResult,
    invalidateResult,
  } = useGifGeneration();

  const totalDurationMs = frames.reduce(
    (total, frame) => total + frame.delayMs,
    0,
  );

  const outputDimensions = useMemo(
    () => getOutputDimensions(frames[0], outputSettings),
    [frames, outputSettings],
  );

  const dimensionsLabel = formatDimensions(outputDimensions);

  const generationSignature = useMemo(
    () =>
      JSON.stringify({
        frames: frames.map((frame) => ({ id: frame.id, delayMs: frame.delayMs })),
        outputSettings,
      }),
    [frames, outputSettings],
  );

  const hasCurrentResult =
    generatedResult?.sourceSignature === generationSignature;
  const isResultModalOpen =
    hasCurrentResult && dismissedResultSignature !== generationSignature;
  const useCanvasPreview =
    frames.length > 0 &&
    hasAdjustedOutputSettings &&
    uploadSettingsVersion !== null &&
    outputSettingsVersion > uploadSettingsVersion;

  const openFilePicker = () => inputRef.current?.click();

  const updateVisualOutputSettings = (settings: OutputSettings) => {
    if (hasVisualOutputSettingsChange(outputSettings, settings)) {
      setHasAdjustedOutputSettings(true);
      setOutputSettingsVersion((version) => version + 1);
    }

    setOutputSettings(settings);
  };

  const handleAddFiles = (files: FileList | File[]) => {
    // 업로드 시점의 설정 버전을 기준값으로 잡아, 업로드 이전의 설정 선택만으로
    // Canvas 미리보기가 켜지지 않게 한다.
    if (frames.length === 0) {
      setHasAdjustedOutputSettings(false);
      setUploadSettingsVersion(outputSettingsVersion);
    }

    addFiles(files);
  };

  const handleRemoveFrame = (frameId: string) => {
    // 마지막 이미지를 삭제하면 다음 업로드는 다시
    // 원본 미리보기부터 시작할 수 있도록 상태를 초기화한다.
    if (frames.length === 1) {
      setHasAdjustedOutputSettings(false);
      setUploadSettingsVersion(null);
    }

    removeFrame(frameId);
  };

  const handleGenerationAction = () => {
    if (hasCurrentResult) {
      setDismissedResultSignature(null);
      return;
    }

    setDismissedResultSignature(null);
    void createGif({
      frames,
      dimensions: outputDimensions,
      settings: outputSettings,
      sourceSignature: generationSignature,
    });
  };

  useEffect(() => {
    invalidateResult();
  }, [generationSignature, invalidateResult]);

  return (
    <div className="min-h-screen bg-stone-100 text-zinc-900">
      <AppHeader />

      <main className="px-4 py-7 sm:px-8 sm:py-10">
        <section
          className="mx-auto max-w-6xl"
          id="workspace"
          aria-label="GIFCAM 이미지 작업 영역"
        >
          <CameraShell
            frames={frames}
            selectedFrame={selectedFrame}
            totalDurationMs={totalDurationMs}
            dimensionsLabel={dimensionsLabel}
            outputDimensions={outputDimensions}
            defaultDelayMs={defaultDelayMs}
            outputSettings={outputSettings}
            useCanvasPreview={useCanvasPreview}
            generationStatus={generationStatus}
            hasCurrentResult={hasCurrentResult}
            onAddFiles={handleAddFiles}
            onOpenFilePicker={openFilePicker}
            onDefaultDelayChange={setDefaultDelayMs}
            onApplyDelayToAll={() => applyDelayToAll(defaultDelayMs)}
            onOutputSettingsChange={setOutputSettings}
            onVisualOutputSettingsChange={updateVisualOutputSettings}
            onGenerationAction={handleGenerationAction}
          />

          <FilmStrip
            frames={frames}
            selectedFrameId={selectedFrameId}
            onReorder={reorderFrames}
            onSelect={selectFrame}
            onDelete={handleRemoveFrame}
            onDelayChange={updateFrameDelay}
          />

          {generationError && <p className="mt-3 text-sm font-bold text-[#a64132]" role="alert">{generationError}</p>}
        </section>

        <p
          className={`mx-auto mt-3 max-w-6xl text-center font-machine text-[11px] tracking-wide text-zinc-500 sm:text-right ${
            uploadMessage ? "text-[#a64132]" : ""
          }`}
          role="status"
        >
          {uploadMessage ??
            "JPEG · PNG · WebP · 파일은 기기 밖으로 전송되지 않습니다."}
        </p>
      </main>

      <input
        ref={inputRef}
        className="sr-only"
        type="file"
        accept={ACCEPTED_IMAGES}
        multiple
        onChange={(event) => {
          if (event.target.files) {
            handleAddFiles(event.target.files);
          }

          event.target.value = "";
        }}
      />

      <GifResultModal
        isOpen={isResultModalOpen && hasCurrentResult}
        result={hasCurrentResult ? generatedResult : null}
        onClose={() => setDismissedResultSignature(generationSignature)}
        onDownload={downloadResult}
      />
    </div>
  );
}

export default App;
