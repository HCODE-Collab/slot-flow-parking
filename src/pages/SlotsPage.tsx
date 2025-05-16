
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { ParkingSlot, SlotLocation, SlotStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { PageTitle } from "@/components/PageTitle";
import { SearchInput } from "@/components/SearchInput";
import { Pagination } from "@/components/Pagination";
import { EmptyState } from "@/components/EmptyState";
import { StatusBadge } from "@/components/StatusBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function SlotsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [slots, setSlots] = useState<ParkingSlot[]>([]);
  const [filteredSlots, setFilteredSlots] = useState<ParkingSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [sizeFilter, setSizeFilter] = useState<string>("");
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState<string>("");
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchSlots = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Generate mock slots data
        const mockSlots: ParkingSlot[] = [];
        const locations: SlotLocation[] = ["north", "south", "east", "west"];
        const statuses: SlotStatus[] = ["available", "unavailable"];
        
        for (let i = 1; i <= 70; i++) {
          mockSlots.push({
            id: i,
            slotNumber: `P${i.toString().padStart(3, '0')}`,
            size: i % 3 === 0 ? "large" : i % 2 === 0 ? "medium" : "small",
            vehicleType: i % 4 === 0 ? "truck" : i % 3 === 0 ? "motorcycle" : "car",
            status: i % 5 === 0 ? "unavailable" as SlotStatus : "available" as SlotStatus,
            location: locations[i % 4],
          });
        }
        
        setSlots(mockSlots);
        applyFilters(mockSlots);
      } catch (error) {
        console.error("Error fetching slots:", error);
        toast({
          title: "Error",
          description: "Failed to load parking slots. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSlots();
  }, [toast]);

  // Apply filters when any filter changes
  useEffect(() => {
    applyFilters(slots);
  }, [searchQuery, locationFilter, statusFilter, sizeFilter, vehicleTypeFilter, slots, user?.role]);

  // Handle search and filters
  const applyFilters = (allSlots: ParkingSlot[]) => {
    let filtered = [...allSlots];
    
    // Apply search query
    if (searchQuery) {
      filtered = filtered.filter(slot =>
        slot.slotNumber.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply location filter
    if (locationFilter) {
      filtered = filtered.filter(slot => slot.location === locationFilter);
    }
    
    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(slot => slot.status === statusFilter as SlotStatus);
    }
    
    // Apply size filter
    if (sizeFilter) {
      filtered = filtered.filter(slot => slot.size === sizeFilter);
    }
    
    // Apply vehicle type filter
    if (vehicleTypeFilter) {
      filtered = filtered.filter(slot => slot.vehicleType === vehicleTypeFilter);
    }
    
    // For normal users, only show available slots
    if (user?.role !== 'ADMIN') {
      filtered = filtered.filter(slot => slot.status === 'available');
    }
    
    setFilteredSlots(filtered);
    setTotalItems(filtered.length);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    setCurrentPage(1);
  };

  // Handle search button click
  const handleSearch = () => {
    applyFilters(slots);
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setLocationFilter("");
    setStatusFilter("");
    setSizeFilter("");
    setVehicleTypeFilter("");
    applyFilters(slots);
  };

  // Get paginated data
  const paginatedSlots = filteredSlots.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container px-4 py-8 mx-auto animate-fade-in">
      <PageTitle
        title="Parking Slots"
        description={
          user?.role === 'ADMIN'
            ? "Manage all parking slots in the system"
            : "View available parking slots"
        }
      />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
        <div className="lg:col-span-2">
          <SearchInput
            placeholder="Search by slot number..."
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={handleSearch}
          />
        </div>
        
        <div>
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Locations</SelectItem>
              <SelectItem value="north">North</SelectItem>
              <SelectItem value="south">South</SelectItem>
              <SelectItem value="east">East</SelectItem>
              <SelectItem value="west">West</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Select value={sizeFilter} onValueChange={setSizeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Sizes</SelectItem>
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="large">Large</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Select value={vehicleTypeFilter} onValueChange={setVehicleTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Vehicle Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Types</SelectItem>
              <SelectItem value="car">Car</SelectItem>
              <SelectItem value="motorcycle">Motorcycle</SelectItem>
              <SelectItem value="truck">Truck</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {user?.role === 'ADMIN' && (
          <div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="unavailable">Unavailable</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
      
      <div className="flex justify-end mb-4">
        <Button variant="outline" onClick={resetFilters} size="sm">
          Reset Filters
        </Button>
      </div>
      
      {isLoading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-16 bg-muted rounded"></div>
          ))}
        </div>
      ) : paginatedSlots.length === 0 ? (
        <EmptyState
          title="No slots found"
          description={
            Object.values([searchQuery, locationFilter, statusFilter, sizeFilter, vehicleTypeFilter]).some(v => v !== "")
              ? "Try adjusting your filters"
              : user?.role === 'ADMIN'
              ? "No parking slots have been added yet"
              : "No available parking slots match your criteria"
          }
        />
      ) : (
        <>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Slot Number</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Vehicle Type</TableHead>
                  <TableHead>Status</TableHead>
                  {user?.role === 'ADMIN' && <TableHead className="text-right">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedSlots.map(slot => (
                  <TableRow key={slot.id}>
                    <TableCell className="font-medium">{slot.slotNumber}</TableCell>
                    <TableCell className="capitalize">{slot.location}</TableCell>
                    <TableCell className="capitalize">{slot.size}</TableCell>
                    <TableCell className="capitalize">{slot.vehicleType}</TableCell>
                    <TableCell>
                      <StatusBadge status={slot.status} />
                    </TableCell>
                    {user?.role === 'ADMIN' && (
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // Toggle slot status
                            const updatedSlots = slots.map(s =>
                              s.id === slot.id
                                ? { ...s, status: s.status === 'available' ? 'unavailable' as SlotStatus : 'available' as SlotStatus }
                                : s
                            );
                            setSlots(updatedSlots);
                            applyFilters(updatedSlots);
                            
                            toast({
                              title: "Slot status updated",
                              description: `${slot.slotNumber} is now ${
                                slot.status === 'available' ? 'unavailable' : 'available'
                              }.`,
                            });
                          }}
                        >
                          {slot.status === 'available' ? 'Mark Unavailable' : 'Mark Available'}
                        </Button>
                      </TableCell>
                    )}
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
    </div>
  );
}
