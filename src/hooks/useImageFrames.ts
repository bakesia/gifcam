import { useCallback, useEffect, useRef, useState } from 'react'
import type { LocalImageFrame } from '../types/frame'

const acceptedTypes = new Set(['image/jpeg', 'image/png', 'image/webp'])

const isSupportedImage = (file: File) =>
  acceptedTypes.has(file.type) || /\.(jpe?g|png|webp)$/i.test(file.name)

export function useImageFrames() {
  const [frames, setFrames] = useState<LocalImageFrame[]>([])
  const [selectedFrameId, setSelectedFrameId] = useState<string | null>(null)
  const [uploadMessage, setUploadMessage] = useState<string | null>(null)
  const framesRef = useRef<LocalImageFrame[]>([])

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
    const newFrames = validFiles.map((file) => ({
      id: crypto.randomUUID(),
      file,
      previewUrl: URL.createObjectURL(file),
    }))

    setFrames((currentFrames) => [...currentFrames, ...newFrames])
    setSelectedFrameId((currentId) => currentId ?? newFrames[0].id)
  }, [])

  const removeFrame = useCallback((frameId: string) => {
    const frameIndex = frames.findIndex((frame) => frame.id === frameId)
    const frame = frames[frameIndex]
    if (!frame) return

    // 삭제한 파일의 미리보기는 더 이상 필요 없으므로 즉시 URL을 정리한다.
    URL.revokeObjectURL(frame.previewUrl)
    setFrames((currentFrames) => currentFrames.filter((item) => item.id !== frameId))
    if (selectedFrameId === frameId) {
      setSelectedFrameId(frames[frameIndex + 1]?.id ?? frames[frameIndex - 1]?.id ?? null)
    }
  }, [frames, selectedFrameId])

  const selectedFrame = frames.find((frame) => frame.id === selectedFrameId) ?? null

  return { frames, selectedFrame, selectedFrameId, uploadMessage, addFiles, removeFrame, selectFrame: setSelectedFrameId }
}
