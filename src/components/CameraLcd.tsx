import { formatSeconds } from '../lib/outputSize'
type CameraLcdProps = {
  frameCount: number
  totalDurationMs: number
  dimensionsLabel: string
}

export function CameraLcd({ frameCount, totalDurationMs, dimensionsLabel }: CameraLcdProps) {
  return (
    <>
      <div className="hidden items-start gap-2 lg:flex"><span className="mt-1 size-3 animate-[recBlink_1s_steps(2,end)_infinite] rounded-full bg-red-800" /><p className="mt-0.5 animate-[recordingFade_1.8s_ease-in-out_infinite] font-machine text-[12px] leading-4 text-zinc-600">RECORDING...</p></div>
      <div className="grid gap-1 border-[3px] border-[#526556] bg-[#b6c7ac] p-3 font-machine text-[#233428] shadow-[inset_0_0_0_2px_#dce8d3]"><div className="flex justify-between text-[10px] font-bold tracking-widest"><span>{String(frameCount).padStart(2, '0')} FRM</span><span>{formatSeconds(totalDurationMs)}</span></div><strong className="text-lg leading-none">{dimensionsLabel}</strong></div>
    </>
  )
}

