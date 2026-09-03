import { useCallback, useEffect, useRef, useState } from 'react'
import { generateGif } from '../lib/gif/generateGif'
import {
  GifGenerationError,
  getGifskiRepeat,
  validateGifGenerationInput,
} from '../lib/gif/gifOptions'
import type { GifWorkerRequest, GifWorkerResponse } from '../lib/gif/workerMessages'
import type {
  Dimensions,
  GeneratedGif,
  GifFrame,
  GifGenerationProgress,
  GifGenerationStatus,
  OutputSettings,
} from '../types/gif'

type GenerateOptions = {
  frames: GifFrame[]
  dimensions: Dimensions | null
  settings: OutputSettings
  sourceSignature: string
}

type ActiveJob = {
  id: number
  mode: 'worker' | 'fallback'
  sourceSignature: string
  width: number
  height: number
  durationMs: number
  frameCount: number
}

const supportsWorkerPipeline = () =>
  typeof Worker !== 'undefined' &&
  typeof OffscreenCanvas !== 'undefined' &&
  typeof createImageBitmap !== 'undefined'

export function useGifGeneration() {
  const [status, setStatus] = useState<GifGenerationStatus>('idle')
  const [progress, setProgress] = useState<GifGenerationProgress | null>(null)
  const [result, setResult] = useState<GeneratedGif | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const resultUrlRef = useRef<string | null>(null)
  const workerRef = useRef<Worker | null>(null)
  const activeJobRef = useRef<ActiveJob | null>(null)
  const jobSequenceRef = useRef(0)
  const isEncodingRef = useRef(false)

  const clearResult = useCallback(() => {
    if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current)
    resultUrlRef.current = null
    setResult(null)
  }, [])

  const finishJob = useCallback((jobId: number, blob: Blob) => {
    const job = activeJobRef.current
    if (!job || job.id !== jobId || jobSequenceRef.current !== jobId) return

    const previewUrl = URL.createObjectURL(blob)
    resultUrlRef.current = previewUrl
    setResult({
      blob,
      previewUrl,
      width: job.width,
      height: job.height,
      fileSize: blob.size,
      durationMs: job.durationMs,
      frameCount: job.frameCount,
      sourceSignature: job.sourceSignature,
    })
    activeJobRef.current = null
    isEncodingRef.current = false
    setProgress(null)
    setStatus('ready')
  }, [])

  const failJob = useCallback((jobId: number, message: string, detail?: unknown) => {
    const job = activeJobRef.current
    if (!job || job.id !== jobId || jobSequenceRef.current !== jobId) return

    console.error('GIF 생성 실패', detail ?? message)
    activeJobRef.current = null
    isEncodingRef.current = false
    setProgress(null)
    setErrorMessage(message)
    setStatus('error')
  }, [])

  const handleWorkerMessage = useCallback((event: MessageEvent<GifWorkerResponse>) => {
    const message = event.data
    if (message.type === 'progress') {
      if (activeJobRef.current?.id === message.jobId) setProgress(message.progress)
      return
    }
    if (message.type === 'success') {
      finishJob(message.jobId, new Blob([message.buffer], { type: 'image/gif' }))
      return
    }

    failJob(message.jobId, message.message, message.detail)
  }, [failJob, finishJob])

  const handleWorkerError = useCallback((event: ErrorEvent) => {
    const jobId = activeJobRef.current?.id
    if (jobId === undefined) return
    workerRef.current?.terminate()
    workerRef.current = null
    failJob(jobId, 'GIF를 만드는 중 문제가 발생했습니다.', event.error ?? event.message)
  }, [failJob])

  const getWorker = useCallback(() => {
    if (workerRef.current) return workerRef.current

    const worker = new Worker(new URL('../workers/gif.worker.ts', import.meta.url), {
      type: 'module',
      name: 'gifcam-encoder',
    })
    worker.onmessage = handleWorkerMessage
    worker.onerror = handleWorkerError
    workerRef.current = worker
    return worker
  }, [handleWorkerError, handleWorkerMessage])

  const invalidateResult = useCallback(() => {
    jobSequenceRef.current += 1
    clearResult()
    setErrorMessage(null)
    setProgress(null)

    if (activeJobRef.current?.mode === 'worker') {
      workerRef.current?.terminate()
      workerRef.current = null
      activeJobRef.current = null
      isEncodingRef.current = false
      setStatus('idle')
      return
    }

    if (!isEncodingRef.current) setStatus('idle')
  }, [clearResult])

  const createGif = useCallback(({ frames, dimensions, settings, sourceSignature }: GenerateOptions) => {
    if (isEncodingRef.current) return

    try {
      validateGifGenerationInput(frames, dimensions)
      getGifskiRepeat(settings.loop)
    } catch (error) {
      const message = error instanceof GifGenerationError
        ? error.userMessage
        : 'GIF를 만드는 중 문제가 발생했습니다.'
      setErrorMessage(message)
      setStatus('error')
      return
    }

    const jobId = jobSequenceRef.current + 1
    jobSequenceRef.current = jobId
    const mode = supportsWorkerPipeline() ? 'worker' : 'fallback'
    activeJobRef.current = {
      id: jobId,
      mode,
      sourceSignature,
      width: dimensions.width,
      height: dimensions.height,
      durationMs: frames.reduce((total, frame) => total + frame.delayMs, 0),
      frameCount: frames.length,
    }
    isEncodingRef.current = true
    clearResult()
    setErrorMessage(null)
    setProgress({ stage: 'preparing' })
    setStatus('encoding')

    if (mode === 'worker') {
      try {
        const request: GifWorkerRequest = {
          type: 'generate',
          jobId,
          frames: frames.map((frame) => ({ file: frame.file, delayMs: frame.delayMs })),
          dimensions,
          settings: {
            fitMode: settings.fitMode,
            backgroundColor: settings.backgroundColor,
            loop: settings.loop,
          },
        }
        getWorker().postMessage(request)
      } catch (error) {
        failJob(jobId, 'GIF를 만드는 중 문제가 발생했습니다.', error)
      }
      return
    }

    void generateGif({
      frames,
      dimensions,
      settings,
      onProgress: (nextProgress) => {
        if (activeJobRef.current?.id === jobId) setProgress(nextProgress)
      },
    })
      .then((blob) => finishJob(jobId, blob))
      .catch((error: unknown) => {
        failJob(
          jobId,
          error instanceof GifGenerationError
            ? error.userMessage
            : 'GIF를 만드는 중 문제가 발생했습니다.',
          error,
        )
      })
      .finally(() => {
        if (activeJobRef.current?.id === jobId && jobSequenceRef.current !== jobId) {
          activeJobRef.current = null
          isEncodingRef.current = false
          setProgress(null)
          setStatus('idle')
        }
      })
  }, [clearResult, failJob, finishJob, getWorker])

  const downloadResult = useCallback(() => {
    if (!resultUrlRef.current) return
    const link = document.createElement('a')
    link.href = resultUrlRef.current
    link.download = 'gifcam.gif'
    document.body.append(link)
    link.click()
    link.remove()
  }, [])

  useEffect(() => () => {
    jobSequenceRef.current += 1
    workerRef.current?.terminate()
    if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current)
  }, [])

  return {
    status,
    progress,
    result,
    errorMessage,
    createGif,
    downloadResult,
    invalidateResult,
  }
}
