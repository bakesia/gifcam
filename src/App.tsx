import { useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  Reorder,
  useDragControls,
} from "motion/react";
import {
  Aperture,
  Images,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import { useImageFrames } from "./hooks/useImageFrames";
import type { LocalImageFrame } from "./types/frame";
import type {
  LoopMode,
  OutputSettings,
  OutputSizePreset,
} from "./types/settings";
import "./App.css";

const ACCEPTED_IMAGES = "image/jpeg,image/png,image/webp";
const DEFAULT_DELAY_MS = 500;
const mono = 'font-["IBM_Plex_Mono"]';

const formatSeconds = (milliseconds: number) =>
  `${(milliseconds / 1000).toFixed(1)} SEC`;

const getOutputDimensions = (
  frame: LocalImageFrame | undefined,
  preset: OutputSizePreset,
) => {
  if (!frame?.width || !frame.height) return null;
  if (preset === "first-image")
    return { width: frame.width, height: frame.height };

  const scale = preset / Math.max(frame.width, frame.height);
  return {
    width: Math.round(frame.width * scale),
    height: Math.round(frame.height * scale),
  };
};

type FilmFrameProps = {
  frame: LocalImageFrame;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onDelayChange: (delayMs: number) => void;
};

function FilmFrame({
  frame,
  index,
  isSelected,
  onSelect,
  onDelete,
  onDelayChange,
}: FilmFrameProps) {
  const dragControls = useDragControls();

  const handleDelayChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const seconds = event.target.valueAsNumber;
    if (Number.isFinite(seconds) && seconds > 0)
      onDelayChange(Math.round(seconds * 1000));
  };

  return (
    <Reorder.Item
      value={frame}
      drag="x"
      dragListener={false}
      dragControls={dragControls}
      style={{ touchAction: "pan-y" }}
      className={`group relative h-[198px] shrink-0 basis-36 border bg-stone-300 p-1.5 ${isSelected ? "border-[#d06b58] ring-2 ring-[#d06b58]" : "border-zinc-800"}`}
    >
      <button
        type="button"
        className="grid h-[132px] w-full cursor-grab overflow-hidden bg-zinc-700 text-left active:cursor-grabbing focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#d06b58]"
        onPointerDown={(event) => dragControls.start(event)}
        onClick={onSelect}
        aria-pressed={isSelected}
      >
        <img
          className="h-[104px] w-full object-cover"
          src={frame.previewUrl}
          alt={`${String(index + 1).padStart(2, "0")}번 ${frame.file.name}`}
          draggable={false}
        />
        <span
          className={`${mono} px-1.5 py-1 text-[10px] font-bold tracking-[0.08em] text-stone-100`}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      </button>
      <label
        className={`${mono} mt-1 flex h-11 items-center gap-1 border border-zinc-500 bg-stone-100 px-2 text-[11px] text-zinc-700`}
      >
        <span className="sr-only">
          {String(index + 1).padStart(2, "0")}번 프레임 지연 시간
        </span>
        <input
          className="h-9 min-w-0 flex-1 bg-transparent text-right text-sm font-bold outline-none focus:text-[#a64132]"
          type="number"
          min="0.1"
          step="0.1"
          value={frame.delayMs / 1000}
          onChange={handleDelayChange}
        />
        <span className="font-bold">초</span>
      </label>
      <button
        type="button"
        className="absolute right-2 top-2 grid size-6 place-items-center bg-zinc-900 text-white opacity-0 transition hover:bg-[#a64132] focus:opacity-100 group-hover:opacity-100 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#d06b58]"
        onClick={onDelete}
        aria-label={`${String(index + 1).padStart(2, "0")}번 프레임 삭제`}
      >
        <Trash2 size={14} />
      </button>
    </Reorder.Item>
  );
}

function App() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [defaultDelayMs, setDefaultDelayMs] = useState(DEFAULT_DELAY_MS);
  const [outputSettings, setOutputSettings] = useState<OutputSettings>({
    sizePreset: "first-image",
    fitMode: "contain",
    loopMode: "forever",
  });
  const {
    frames,
    selectedFrame,
    selectedFrameId,
    uploadMessage,
    addFiles,
    removeFrame,
    reorderFrames,
    updateFrameDelay,
    applyDelayToAll,
    selectFrame,
  } = useImageFrames(defaultDelayMs);
  const canDropInitialImage = frames.length === 0;
  const totalDurationMs = frames.reduce(
    (total, frame) => total + frame.delayMs,
    0,
  );
  const outputDimensions = useMemo(
    () => getOutputDimensions(frames[0], outputSettings.sizePreset),
    [frames, outputSettings.sizePreset],
  );
  const openFilePicker = () => inputRef.current?.click();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) addFiles(event.target.files);
    event.target.value = "";
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    addFiles(event.dataTransfer.files);
  };

  const updateDefaultDelay = (event: React.ChangeEvent<HTMLInputElement>) => {
    const seconds = event.target.valueAsNumber;
    if (Number.isFinite(seconds) && seconds > 0)
      setDefaultDelayMs(Math.round(seconds * 1000));
  };

  const updateLoopMode = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setOutputSettings((current) => ({
      ...current,
      loopMode: event.target.value as LoopMode,
    }));
  };

  const updateSizePreset = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    const sizePreset: OutputSizePreset =
      value === "first-image" ? value : (Number(value) as 1920 | 1280 | 720);
    setOutputSettings((current) => ({ ...current, sizePreset }));
  };

  const dimensionsLabel = outputDimensions
    ? `${outputDimensions.width} × ${outputDimensions.height}`
    : "— × —";

  return (
    <div className="min-h-screen bg-stone-100 text-zinc-900">
      <header className="border-b border-zinc-500 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center px-5 sm:px-8">
          <a
            className="flex items-center gap-2.5 text-xl font-bold tracking-[0.12em]"
            href="/"
            aria-label="GIFCAM 작업 영역"
          >
            <span className="grid size-8 place-items-center bg-zinc-900 text-white">
              <Aperture size={18} strokeWidth={2.25} />
            </span>
            GIFCAM
          </a>
        </div>
      </header>

      <main className="px-4 py-7 sm:px-8 sm:py-10">
        <section
          className="mx-auto max-w-6xl"
          id="workspace"
          aria-label="GIFCAM 이미지 작업 영역"
        >
          <div
            className="mx-auto flex h-7 w-[88%] items-end gap-3"
            aria-hidden="true"
          >
            <span className="h-4 w-28 border-x-3 border-t-3 border-[#384a3d] bg-[#526556]" />
            <span className="h-3 w-14 border-x-3 border-t-3 border-zinc-500 bg-stone-100" />
          </div>
          <div className="border-[3px] border-[#33483a] bg-[#e7e5dc] p-4 shadow-[0_20px_35px_rgba(24,24,23,0.16)] sm:p-7 lg:grid lg:grid-cols-[minmax(0,1fr)_214px] lg:gap-7">
            <section className="min-w-0" aria-label="선택된 이미지 미리보기">
              <div
                className={`${mono} mb-2 flex items-center gap-2 text-[12px] font-bold tracking-[0.16em] text-zinc-600`}
              >
                <span className="size-2 bg-[#a64132]" /> VIEWFINDER
              </div>
              <div
                className={`relative grid min-h-80 place-items-center overflow-hidden border-[3px] bg-zinc-900 transition-colors sm:min-h-105 ${canDropInitialImage && isDragging ? "border-[#a64132] bg-zinc-800" : "border-zinc-700"}`}
                onDragEnter={
                  canDropInitialImage
                    ? (event) => {
                        event.preventDefault();
                        setIsDragging(true);
                      }
                    : undefined
                }
                onDragOver={
                  canDropInitialImage
                    ? (event) => event.preventDefault()
                    : undefined
                }
                onDragLeave={
                  canDropInitialImage
                    ? (event) => {
                        if (event.currentTarget === event.target)
                          setIsDragging(false);
                      }
                    : undefined
                }
                onDrop={canDropInitialImage ? handleDrop : undefined}
              >
                <AnimatePresence mode="wait">
                  {selectedFrame ? (
                    <motion.img
                      key={selectedFrame.id}
                      className="block size-full max-h-140 object-contain"
                      src={selectedFrame.previewUrl}
                      alt={`${selectedFrame.file.name} 미리보기`}
                      draggable={false}
                      onDragStart={(event) => event.preventDefault()}
                      initial={{ opacity: 0.35, scale: 0.985 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0.35 }}
                      transition={{ duration: 0.18 }}
                    />
                  ) : (
                    <motion.div
                      className="grid justify-items-center gap-3 p-8 text-center text-stone-100"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <Images size={34} strokeWidth={1.4} />
                      <strong className="text-base">
                        첫 사진을 넣어주세요
                      </strong>
                      <span className="text-sm text-zinc-400">
                        혹은, 사진을 이 영역으로 끌어다 놓으세요.
                      </span>
                      <button
                        type="button"
                        className="mt-1 inline-flex items-center gap-2 bg-[#a64132] px-4 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#8c382b] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#d06b58]"
                        onClick={openFilePicker}
                      >
                        <Upload size={16} /> 이미지 추가
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
                {canDropInitialImage && isDragging && (
                  <div className="absolute inset-3 z-10 grid place-items-center border-2 border-dashed border-[#d06b58] bg-zinc-900/90 font-bold text-stone-100">
                    여기에 이미지를 놓으세요
                  </div>
                )}
              </div>
            </section>

            <aside
              className="mt-4 grid gap-4 lg:mt-0 lg:flex lg:flex-col lg:justify-center"
              aria-label="출력 설정"
            >
              <div className="hidden items-start gap-2 lg:flex">
                <span className="mt-1 size-3 animate-[recBlink_1s_steps(2,end)_infinite] rounded-full bg-red-800" />
                <p
                  className={`${mono} mt-0.5 animate-[recordingFade_1.8s_ease-in-out_infinite] text-[12px] leading-4 text-zinc-600`}
                >
                  RECORDING...
                </p>
              </div>
              <div
                className={`${mono} grid gap-1 border-[3px] border-[#526556] bg-[#b6c7ac] p-3 text-[#233428] shadow-[inset_0_0_0_2px_#dce8d3]`}
              >
                <div className="flex justify-between text-[10px] font-bold tracking-widest">
                  <span>{String(frames.length).padStart(2, "0")} FRM</span>
                  <span>{formatSeconds(totalDurationMs)}</span>
                </div>
                <strong className="text-lg leading-none">
                  {dimensionsLabel}
                </strong>
              </div>
              {frames.length > 0 && (
                <button
                  type="button"
                  className="inline-flex min-h-12 items-center justify-center gap-2 border-2 border-[#455a4a] bg-white px-3 text-sm font-bold text-zinc-900 transition hover:-translate-y-0.5 hover:bg-stone-50 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#a64132]"
                  onClick={openFilePicker}
                >
                  <Plus size={18} /> 이미지 추가
                </button>
              )}
              <div className="grid gap-3 border-t border-[#b7b3a6] pt-4">
                <label className="grid gap-1.5">
                  <span
                    className={`${mono} text-[10px] font-bold tracking-[0.09em] text-zinc-600`}
                  >
                    기본 프레임 시간
                  </span>
                  <span className="flex items-center border-2 border-[#9c9a90] bg-white px-2">
                    <input
                      className={`${mono} min-w-0 flex-1 py-2 text-sm font-bold outline-none`}
                      type="number"
                      min="0.1"
                      step="0.1"
                      value={defaultDelayMs / 1000}
                      onChange={updateDefaultDelay}
                    />
                    <span className={`${mono} text-[10px] text-zinc-500`}>
                      초
                    </span>
                  </span>
                </label>
                <button
                  type="button"
                  className={`${mono} border-2 border-[#455a4a] bg-[#526556] px-3 py-2 text-[12px] font-bold tracking-[0.05em] text-white transition hover:bg-[#384a3d] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#a64132]`}
                  onClick={() => applyDelayToAll(defaultDelayMs)}
                >
                  모든 프레임에 적용
                </button>
                <label className="grid gap-1.5">
                  <span
                    className={`${mono} text-[10px] font-bold tracking-[0.09em] text-zinc-600`}
                  >
                    반복 설정
                  </span>
                  <select
                    className="border-2 border-[#9c9a90] bg-white px-2 py-2 text-sm font-bold outline-none focus:border-[#a64132]"
                    value={outputSettings.loopMode}
                    onChange={updateLoopMode}
                  >
                    <option value="forever">무한 반복</option>
                    <option value="once">한 번</option>
                  </select>
                </label>
                <label className="grid gap-1.5">
                  <span
                    className={`${mono} text-[10px] font-bold tracking-[0.09em] text-zinc-600`}
                  >
                    출력 크기
                  </span>
                  <select
                    className="border-2 border-[#9c9a90] bg-white px-2 py-2 text-sm font-bold outline-none focus:border-[#a64132]"
                    value={outputSettings.sizePreset}
                    onChange={updateSizePreset}
                  >
                    <option value="first-image">첫 번째 이미지 기준</option>
                    <option value="1920">1920 px</option>
                    <option value="1280">1280 px</option>
                    <option value="720">720 px</option>
                  </select>
                  <span className={`${mono} text-[10px] text-zinc-500`}>
                    {dimensionsLabel}
                  </span>
                </label>
              </div>
            </aside>
          </div>

          <section
            className="border-x-[3px] border-b-[3px] border-zinc-950 bg-zinc-900 p-3 text-stone-100"
            aria-label="필름 스트립"
          >
            <div
              className={`${mono} mb-2 flex justify-between px-1 text-[10px] font-bold tracking-[0.11em] text-zinc-400`}
            >
              <span>
                <i className="mr-1.5 inline-block size-2 bg-[#a64132]" />
                FILM
              </span>
              <span>{frames.length ? `${frames.length} FRAMES` : "EMPTY"}</span>
            </div>
            {frames.length > 1 && <p className="mb-2 px-1 text-xs font-bold text-zinc-400">사진을 드래그해 순서를 바꿀 수 있어요.</p>}
            {frames.length === 0 ? (
              <div className="film-sprockets flex min-h-36 items-center justify-center border border-dashed border-zinc-600 px-4 text-center text-sm text-zinc-500">
                업로드한 사진이 이곳에 프레임으로 표시됩니다
              </div>
            ) : (
              <Reorder.Group
                axis="x"
                values={frames}
                onReorder={reorderFrames}
                layoutScroll
                className="film-sprockets flex min-h-[214px] gap-2 overflow-x-auto p-2"
              >
                {frames.map((frame, index) => (
                  <FilmFrame
                    key={frame.id}
                    frame={frame}
                    index={index}
                    isSelected={frame.id === selectedFrameId}
                    onSelect={() => selectFrame(frame.id)}
                    onDelete={() => removeFrame(frame.id)}
                    onDelayChange={(delayMs) =>
                      updateFrameDelay(frame.id, delayMs)
                    }
                  />
                ))}
              </Reorder.Group>
            )}
          </section>
        </section>
        <p
          className={`${mono} mx-auto mt-3 max-w-6xl text-center text-[11px] tracking-wide text-zinc-500 sm:text-right ${uploadMessage ? "text-[#a64132]" : ""}`}
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
        onChange={handleFileChange}
      />
    </div>
  );
}

export default App;
