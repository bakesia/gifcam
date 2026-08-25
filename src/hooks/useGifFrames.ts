import { useCallback, useEffect, useRef, useState } from 'react'
import type { GifFrame } from '../types/gif'

const acceptedTypes = new Set(['image/jpeg', 'image/png', 'image/webp'])

const isSupportedImage = (file: File) =>
  acceptedTypes.has(file.type) || /\.(jpe?g|png|webp)$/i.test(file.name)

const readImageDimensions = (previewUrl: string) => new Promise<{ width: number; height: number } | null>((resolve) => {
  const image = new Image()
  image.onload = () => resolve({ width: image.naturalWidth, height: image.naturalHeight })
  image.onerror = () => resolve(null)
  image.src = previewUrl
})

export function useGifFrames(initialDefaultDelayMs = 500) {
  const [frames, setFrames] = useState<GifFrame[]>([])
  const [selectedFrameId, setSelectedFrameId] = useState<string | null>(null)
  const [defaultDelayMs, setDefaultDelayMs] = useState(initialDefaultDelayMs)
  const [uploadMessage, setUploadMessage] = useState<string | null>(null)
  const framesRef = useRef<GifFrame[]>([])

  useEffect(() => {
    framesRef.current = frames
  }, [frames])

  // 컴포넌트가 사라질 때도 남은 미리보기 URL을 해제해 브라우저 메모리에 남지 않게 한다.
  useEffect(() => () => {
    framesRef.current.forEach((frame) => URL.revokeObjectURL(frame.previewUrl))
  }, [])

  const addFiles = useCallback((files: FileList | File[]) => {
    const candidates = Array.from(files)
    const validFiles = candidates.filter(isSupportedImage)
    const rejectedCount = candidates.length - validFiles.length

    setUploadMessage(rejectedCount > 0 ? 'JPEG, PNG, WebP 파일만 추가할 수 있어요.' : null)
    if (validFiles.length === 0) return

    // 파일별 URL은 추가 시 한 번만 만들고, 렌더 단계에서는 재사용한다.
    const newFrames: GifFrame[] = validFiles.map((file) => ({
      id: crypto.randomUUID(),
      file,
      previewUrl: URL.createObjectURL(file),
      delayMs: defaultDelayMs,
    }))

    setFrames((currentFrames) => [...currentFrames, ...newFrames])
    setSelectedFrameId((currentId) => currentId ?? newFrames[0].id)

    // 크기 정보는 출력 설정의 예상 값을 보여주기 위한 메타데이터일 뿐, 픽셀 데이터는 보관하지 않는다.
    void Promise.all(newFrames.map(async (frame) => ({ id: frame.id, dimensions: await readImageDimensions(frame.previewUrl) }))).then((results) => {
      setFrames((currentFrames) => currentFrames.map((frame) => {
        const result = results.find((item) => item.id === frame.id)
        return result?.dimensions ? { ...frame, ...result.dimensions } : frame
      }))
    })
  }, [defaultDelayMs])

  const removeFrame = useCallback((frameId: string) => {
    const frameIndex = frames.findIndex((frame) => frame.id === frameId)
    const frame = frames[frameIndex]
    if (!frame) return

    // 삭제한 파일의 URL을 정리하고, 선택된 프레임이었다면 인접 프레임으로 자연스럽게 이동한다.
    URL.revokeObjectURL(frame.previewUrl)
    setFrames((currentFrames) => currentFrames.filter((item) => item.id !== frameId))
    if (selectedFrameId === frameId) {
      setSelectedFrameId(frames[frameIndex + 1]?.id ?? frames[frameIndex - 1]?.id ?? null)
    }
  }, [frames, selectedFrameId])

  const reorderFrames = useCallback((nextFrames: GifFrame[]) => {
    setFrames(nextFrames)
  }, [])

  const updateFrameDelay = useCallback((frameId: string, delayMs: number) => {
    setFrames((currentFrames) => currentFrames.map((frame) => (
      frame.id === frameId ? { ...frame, delayMs } : frame
    )))
  }, [])

  const applyDelayToAll = useCallback((delayMs: number) => {
    setFrames((currentFrames) => currentFrames.map((frame) => ({ ...frame, delayMs })))
  }, [])

  return {
    frames,
    selectedFrame: frames.find((frame) => frame.id === selectedFrameId) ?? null,
    selectedFrameId,
    defaultDelayMs,
    uploadMessage,
    addFiles,
    removeFrame,
    reorderFrames,
    updateFrameDelay,
    applyDelayToAll,
    setDefaultDelayMs,
    selectFrame: setSelectedFrameId,
  }
}
