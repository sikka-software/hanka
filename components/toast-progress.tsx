import { toast } from 'sonner'
import { Progress } from '@/components/ui/progress'

type ProgressToastProps = {
  current: number
  total: number
  filePath: string
}

export function updateProgressToast(
  toastId: string | number | undefined,
  progress: ProgressToastProps
) {
  const percent = (progress.current / progress.total) * 100
  
  if (toastId) {
    toast.custom((t) => (
      <div className="w-full">
        <div className="flex justify-between text-sm mb-2">
          <span>Saving {progress.current}/{progress.total}: {progress.filePath}</span>
          <span>{Math.round(percent)}%</span>
        </div>
        <Progress value={percent} className="h-2" />
      </div>
    ), { id: toastId })
  } else {
    return toast.custom((t) => (
      <div className="w-full">
        <div className="flex justify-between text-sm mb-2">
          <span>Saving 1/{progress.total}: {progress.filePath}</span>
          <span>0%</span>
        </div>
        <Progress value={0} className="h-2" />
      </div>
    ), { duration: Infinity })
  }
}
