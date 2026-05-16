import { REQUEST_STATUS_STYLES, type RequestStatus } from '@/types'

export default function StatusBadge({ status }: { status: RequestStatus }) {
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${REQUEST_STATUS_STYLES[status]}`}>
      {status}
    </span>
  )
}
