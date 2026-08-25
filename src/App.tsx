import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Aperture, Images, Plus, Trash2, Upload } from "lucide-react";
import { useImageFrames } from "./hooks/useImageFrames";
import "./App.css";

const ACCEPTED_IMAGES = "image/jpeg,image/png,image/webp";
const mono = 'font-["IBM_Plex_Mono"]';

function App() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const {
    frames,
    selectedFrame,
    selectedFrameId,
    uploadMessage,
    addFiles,
    removeFrame,
    selectFrame,
  } = useImageFrames();
  const canDropInitialImage = frames.length === 0;
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

  return (
    <div className="min-h-screen bg-stone-100 text-zinc-900">
      <header className="border-b border-zinc-500 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
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
                className={`${mono} mb-2 flex items-center gap-2 text-[12px] tracking-[0.16em] font-bold text-zinc-600`}
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
                  <div className="absolute inset-3 z-10 grid place-items-center border-2 border-dashed border-[#d06b58] bg-zinc-900/90 font-semibold text-stone-100">
                    여기에 이미지를 놓으세요
                  </div>
                )}
              </div>
            </section>

            <aside
              className="mt-4 grid grid-cols-2 gap-3 lg:mt-0 lg:flex lg:flex-col lg:justify-center lg:gap-5"
              aria-label="현재 작업 상태"
            >
              <div className="hidden items-start gap-2 lg:flex">
                <span className="mt-1 size-3 rounded-full bg-red-800 animate-[recBlink_1s_steps(2,end)_infinite]" />

                <p
                  className={`${mono} mt-0.5 text-[12px] leading-4 text-zinc-600 animate-[recordingFade_1.8s_ease-in-out_infinite]`}
                >
                  RECORDING...
                </p>
              </div>
              <div
                className={`${mono} grid min-h-24 gap-1 border-[3px] border-[#526556] bg-[#b6c7ac] p-3 text-[#233428] shadow-[inset_0_0_0_2px_#dce8d3]`}
              >
                <span className="text-[12px] font-bold tracking-widest">
                  FRAMES
                </span>
                <strong className="text-3xl leading-none">
                  {String(frames.length).padStart(2, "0")}
                </strong>
                <em className="text-[11px] not-italic tracking-wide">
                  {selectedFrame
                    ? `SELECTED ${String(frames.findIndex((frame) => frame.id === selectedFrame.id) + 1).padStart(2, "0")}`
                    : "READY"}
                </em>
              </div>

              {frames.length > 0 && (
                <button
                  type="button"
                  className="inline-flex min-h-12 items-center justify-center gap-2 border-2 border-[#455a4a] bg-white px-3 text-sm font-semibold text-zinc-900 transition hover:-translate-y-0.5 hover:bg-stone-50 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#a64132]"
                  onClick={openFilePicker}
                >
                  <Plus size={18} /> 이미지 추가
                </button>
              )}
            </aside>
          </div>

          <section
            className="border-x-[3px] border-b-[3px] border-zinc-950 bg-zinc-900 p-3 text-stone-100"
            aria-label="필름 스트립"
          >
            <div
              className={`${mono} mb-2 flex justify-between px-1 text-[10px] tracking-[0.11em] text-zinc-400`}
            >
              <span>
                <i className="mr-1.5 inline-block size-2 bg-[#a64132]" />
                FILM ROLL
              </span>
              <span>{frames.length ? `${frames.length} FRAMES` : "EMPTY"}</span>
            </div>
            <div className="film-sprockets flex min-h-36 gap-2 overflow-x-auto p-2 scrollbar-thin">
              {frames.length === 0 ? (
                <div className="flex min-h-32 w-full items-center justify-center border border-dashed border-zinc-600 px-4 text-center text-sm text-zinc-500">
                  업로드한 사진이 이곳에 프레임으로 표시됩니다
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {frames.map((frame, index) => (
                    <motion.article
                      className={`group relative h-32 shrink-0 basis-29.5 border bg-stone-300 p-1.5 ${frame.id === selectedFrameId ? "border-[#d06b58] ring-2 ring-[#d06b58]" : "border-zinc-800"}`}
                      key={frame.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.92 }}
                      transition={{ duration: 0.18 }}
                    >
                      <button
                        type="button"
                        className="grid size-full overflow-hidden bg-zinc-700 text-left focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#d06b58]"
                        onClick={() => selectFrame(frame.id)}
                        aria-pressed={frame.id === selectedFrameId}
                      >
                        <img
                          className="h-22.75 w-full object-cover"
                          src={frame.previewUrl}
                          alt={`${String(index + 1).padStart(2, "0")}번 ${frame.file.name}`}
                        />
                        <span
                          className={`${mono} px-1.5 py-1 text-[10px] tracking-[0.08em] text-stone-100`}
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </button>
                      <button
                        type="button"
                        className="absolute right-2 top-2 grid size-6 place-items-center bg-zinc-900 text-white opacity-0 transition hover:bg-[#a64132] focus:opacity-100 group-hover:opacity-100 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#d06b58]"
                        onClick={() => removeFrame(frame.id)}
                        aria-label={`${String(index + 1).padStart(2, "0")}번 프레임 삭제`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </motion.article>
                  ))}
                </AnimatePresence>
              )}
            </div>
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
