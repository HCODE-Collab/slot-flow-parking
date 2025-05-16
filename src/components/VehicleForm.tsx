
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Vehicle, VehicleType, VehicleSize } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface VehicleFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (vehicle: Omit<Vehicle, 'id' | 'userId' | 'createdAt'>) => void;
  initialData?: Vehicle;
  isEditing?: boolean;
}

export function VehicleForm({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isEditing = false,
}: VehicleFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    plateNumber: initialData?.plateNumber || "",
    vehicleType: initialData?.vehicleType || "car" as VehicleType,
    size: initialData?.size || "medium" as VehicleSize,
    color: initialData?.attributes?.color || "",
    model: initialData?.attributes?.model || "",
    year: initialData?.attributes?.year || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate form
      if (!formData.plateNumber) {
        throw new Error("Plate number is required");
      }

      // Create vehicle object to submit
      const vehicleData = {
        plateNumber: formData.plateNumber,
        vehicleType: formData.vehicleType,
        size: formData.size,
        attributes: {
          color: formData.color,
          model: formData.model,
          year: formData.year ? parseInt(formData.year.toString()) : undefined,
        },
      };

      onSubmit(vehicleData);
      
      // Show success message
      toast({
        title: isEditing ? "Vehicle updated" : "Vehicle added",
        description: `${formData.plateNumber} has been ${
          isEditing ? "updated" : "added"
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
            {isEditing ? "Edit Vehicle" : "Add New Vehicle"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="plateNumber">Plate Number *</Label>
              <Input
                id="plateNumber"
                name="plateNumber"
                value={formData.plateNumber}
                onChange={handleChange}
                disabled={isEditing}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="vehicleType">Vehicle Type *</Label>
              <Select
                value={formData.vehicleType}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, vehicleType: value as VehicleType }))
                }
              >
                <SelectTrigger id="vehicleType">
                  <SelectValue placeholder="Select vehicle type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="car">Car</SelectItem>
                  <SelectItem value="motorcycle">Motorcycle</SelectItem>
                  <SelectItem value="truck">Truck</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="size">Vehicle Size *</Label>
              <Select
                value={formData.size}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, size: value as VehicleSize }))
                }
              >
                <SelectTrigger id="size">
                  <SelectValue placeholder="Select vehicle size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="color">Color</Label>
              <Input
                id="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                placeholder="e.g. Red"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                name="model"
                value={formData.model}
                onChange={handleChange}
                placeholder="e.g. Toyota Corolla"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                placeholder="e.g. 2023"
                type="number"
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
              {isSubmitting ? "Saving..." : isEditing ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
