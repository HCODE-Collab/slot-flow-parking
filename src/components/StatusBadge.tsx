
import { Badge } from "@/components/ui/badge";
import { SlotStatus, RequestStatus } from "@/types";

interface StatusBadgeProps {
  status: SlotStatus | RequestStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  let variant:
    | "default"
    | "secondary"
    | "destructive"
    | "outline"
    | null
    | undefined;
  
  switch (status) {
    case "available":
      variant = "outline";
      break;
    case "unavailable":
      variant = "secondary";
      break;
    case "pending":
      variant = "secondary";
      break;
    case "approved":
      variant = "default";
      break;
    case "rejected":
      variant = "destructive";
      break;
    default:
      variant = "outline";
      break;
  }
  
  return (
    <Badge variant={variant} className="capitalize">
      {status}
    </Badge>
  );
}
