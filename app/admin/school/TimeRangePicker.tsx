import { Clock } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface TimeRangePickerProps {
  startLabel: string
  endLabel: string
  startName: string
  endName: string
  startValue: string
  endValue: string
  onChange: (name: string, value: string) => void
}

export function TimeRangePicker({
  startLabel,
  endLabel,
  startName,
  endName,
  startValue,
  endValue,
  onChange,
}: TimeRangePickerProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor={startName}>{startLabel}</Label>
        <div className="relative">
          <Input
            id={startName}
            name={startName}
            type="time"
            value={startValue}
            onChange={(e) => onChange(startName, e.target.value)}
            className="pl-10"
          />
          <Clock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor={endName}>{endLabel}</Label>
        <div className="relative">
          <Input
            id={endName}
            name={endName}
            type="time"
            value={endValue}
            onChange={(e) => onChange(endName, e.target.value)}
            className="pl-10"
          />
          <Clock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>
    </div>
  )
}

