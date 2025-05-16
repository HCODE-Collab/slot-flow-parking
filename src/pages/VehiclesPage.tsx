
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Vehicle } from "@/types";
import { Button } from "@/components/ui/button";
import { PageTitle } from "@/components/PageTitle";
import { SearchInput } from "@/components/SearchInput";
import { Pagination } from "@/components/Pagination";
import { EmptyState } from "@/components/EmptyState";
import { StatusBadge } from "@/components/StatusBadge";
import { VehicleForm } from "@/components/VehicleForm";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash } from "lucide-react";

export default function VehiclesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchVehicles = async () => {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock vehicles data
      const mockVehicles: Vehicle[] = [
        {
          id: 1,
          userId: 1,
          plateNumber: "ABC123",
          vehicleType: "car",
          size: "medium",
          attributes: {
            color: "Blue",
            model: "Toyota Camry",
            year: 2020
          },
          createdAt: "2023-05-15T10:30:00Z"
        },
        {
          id: 2,
          userId: 1,
          plateNumber: "XYZ789",
          vehicleType: "motorcycle",
          size: "small",
          attributes: {
            color: "Red",
            model: "Honda CBR",
            year: 2022
          },
          createdAt: "2023-06-20T14:45:00Z"
        },
        {
          id: 3,
          userId: 1,
          plateNumber: "DEF456",
          vehicleType: "truck",
          size: "large",
          attributes: {
            color: "White",
            model: "Ford F-150",
            year: 2019
          },
          createdAt: "2023-04-10T08:15:00Z"
        }
      ];
      
      setVehicles(mockVehicles);
      setFilteredVehicles(mockVehicles);
      setTotalItems(mockVehicles.length);
      setTotalPages(Math.ceil(mockVehicles.length / itemsPerPage));
      setIsLoading(false);
    };
    
    fetchVehicles();
  }, [itemsPerPage]);

  // Handle search
  const handleSearch = () => {
    const filtered = vehicles.filter(vehicle =>
      vehicle.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.vehicleType.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setFilteredVehicles(filtered);
    setTotalItems(filtered.length);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    setCurrentPage(1);
  };

  // Handle adding a new vehicle
  const handleAddVehicle = (vehicleData: Omit<Vehicle, 'id' | 'userId' | 'createdAt'>) => {
    // In a real app, this would be an API call
    const newVehicle: Vehicle = {
      id: Math.floor(Math.random() * 1000),
      userId: user!.id,
      plateNumber: vehicleData.plateNumber,
      vehicleType: vehicleData.vehicleType,
      size: vehicleData.size,
      attributes: vehicleData.attributes,
      createdAt: new Date().toISOString(),
    };
    
    setVehicles([...vehicles, newVehicle]);
    setFilteredVehicles([...filteredVehicles, newVehicle]);
    setTotalItems(totalItems + 1);
    setTotalPages(Math.ceil((totalItems + 1) / itemsPerPage));
  };

  // Handle updating a vehicle
  const handleUpdateVehicle = (vehicleData: Omit<Vehicle, 'id' | 'userId' | 'createdAt'>) => {
    if (!selectedVehicle) return;
    
    // In a real app, this would be an API call
    const updatedVehicle: Vehicle = {
      ...selectedVehicle,
      vehicleType: vehicleData.vehicleType,
      size: vehicleData.size,
      attributes: vehicleData.attributes,
    };
    
    setVehicles(vehicles.map(v => v.id === selectedVehicle.id ? updatedVehicle : v));
    setFilteredVehicles(filteredVehicles.map(v => v.id === selectedVehicle.id ? updatedVehicle : v));
  };

  // Handle deleting a vehicle
  const handleDeleteVehicle = () => {
    if (!selectedVehicle) return;
    
    // In a real app, this would be an API call
    setVehicles(vehicles.filter(v => v.id !== selectedVehicle.id));
    setFilteredVehicles(filteredVehicles.filter(v => v.id !== selectedVehicle.id));
    setTotalItems(totalItems - 1);
    setTotalPages(Math.ceil((totalItems - 1) / itemsPerPage));
    
    toast({
      title: "Vehicle deleted",
      description: `${selectedVehicle.plateNumber} has been deleted.`,
    });
    
    setIsDeleteDialogOpen(false);
  };

  // Get paginated data
  const paginatedVehicles = filteredVehicles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container px-4 py-8 mx-auto animate-fade-in">
      <PageTitle
        title="My Vehicles"
        description="Manage your registered vehicles"
        action={
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Vehicle
          </Button>
        }
      />
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <SearchInput
          placeholder="Search by plate number or type..."
          value={searchQuery}
          onChange={setSearchQuery}
          onSearch={handleSearch}
        />
      </div>
      
      {isLoading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-muted rounded"></div>
          ))}
        </div>
      ) : paginatedVehicles.length === 0 ? (
        <EmptyState
          title="No vehicles found"
          description={
            searchQuery
              ? "Try adjusting your search query"
              : "Add your first vehicle to get started"
          }
          action={
            !searchQuery
              ? {
                  label: "Add Vehicle",
                  onClick: () => setIsAddDialogOpen(true),
                }
              : undefined
          }
        />
      ) : (
        <>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plate Number</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>Color</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedVehicles.map(vehicle => (
                  <TableRow key={vehicle.id}>
                    <TableCell className="font-medium">{vehicle.plateNumber}</TableCell>
                    <TableCell className="capitalize">{vehicle.vehicleType}</TableCell>
                    <TableCell className="capitalize">{vehicle.size}</TableCell>
                    <TableCell>{vehicle.attributes?.model || "-"}</TableCell>
                    <TableCell>{vehicle.attributes?.color || "-"}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedVehicle(vehicle);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedVehicle(vehicle);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            limit={itemsPerPage}
            totalItems={totalItems}
            onPageChange={setCurrentPage}
            onLimitChange={setItemsPerPage}
          />
        </>
      )}
      
      {/* Add Vehicle Dialog */}
      <VehicleForm
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddVehicle}
      />
      
      {/* Edit Vehicle Dialog */}
      {selectedVehicle && (
        <VehicleForm
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSubmit={handleUpdateVehicle}
          initialData={selectedVehicle}
          isEditing={true}
        />
      )}
      
      {/* Delete Vehicle Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the vehicle
              {selectedVehicle && ` "${selectedVehicle.plateNumber}"`} and remove its
              data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteVehicle}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
