
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { SlotRequest, Vehicle } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface SlotRequestFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { vehicleId: number, notes?: string }) => void;
  vehicles: Vehicle[];
  isEditing?: boolean;
  initialData?: SlotRequest;
}

export function SlotRequestForm({
  open,
  onOpenChange,
  onSubmit,
  vehicles,
  isEditing = false,
  initialData,
}: SlotRequestFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    vehicleId: initialData?.vehicleId?.toString() || "",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        vehicleId: initialData.vehicleId?.toString() || "",
        notes: "",
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate form
      if (!formData.vehicleId) {
        throw new Error("Please select a vehicle");
      }

      // Create request object to submit
      onSubmit({
        vehicleId: parseInt(formData.vehicleId),
        notes: formData.notes || undefined,
      });
      
      // Show success message
      toast({
        title: isEditing ? "Request updated" : "Request submitted",
        description: `Your parking slot request has been ${
          isEditing ? "updated" : "submitted"
        } successfully.`,
      });

      // Close dialog
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Parking Request" : "Request Parking Slot"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="vehicleId">Vehicle *</Label>
              <Select
                value={formData.vehicleId}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, vehicleId: value }))
                }
                disabled={isEditing}
              >
                <SelectTrigger id="vehicleId">
                  <SelectValue placeholder="Select a vehicle" />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id.toString()}>
                      {vehicle.plateNumber} - {vehicle.vehicleType} ({vehicle.size})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, notes: e.target.value }))
                }
                placeholder="Any special requirements or preferences..."
                className="min-h-[100px]"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : isEditing ? "Update" : "Submit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
