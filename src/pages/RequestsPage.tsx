
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { SlotRequest, RequestStatus, Vehicle } from "@/types";
import { Button } from "@/components/ui/button";
import { PageTitle } from "@/components/PageTitle";
import { SearchInput } from "@/components/SearchInput";
import { Pagination } from "@/components/Pagination";
import { EmptyState } from "@/components/EmptyState";
import { StatusBadge } from "@/components/StatusBadge";
import { SlotRequestForm } from "@/components/SlotRequestForm";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Plus, Check, X } from "lucide-react";

export default function RequestsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [requests, setRequests] = useState<SlotRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<SlotRequest[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<SlotRequest | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      // In a real app, this would be API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock vehicles data
      const mockVehicles: Vehicle[] = [
        {
          id: 1,
          userId: user?.id || 1,
          plateNumber: "ABC123",
          vehicleType: "car",
          size: "medium",
          attributes: { color: "Blue", model: "Toyota Camry" },
          createdAt: "2023-05-15T10:30:00Z"
        },
        {
          id: 2,
          userId: user?.id || 1,
          plateNumber: "XYZ789",
          vehicleType: "motorcycle",
          size: "small",
          attributes: { color: "Red", model: "Honda CBR" },
          createdAt: "2023-06-20T14:45:00Z"
        },
      ];
      
      // Mock requests data
      const mockRequests: SlotRequest[] = [
        {
          id: 1,
          userId: user?.id || 1,
          vehicleId: 1,
          requestStatus: "pending",
          createdAt: "2023-07-01T09:00:00Z",
          updatedAt: "2023-07-01T09:00:00Z",
          vehicle: mockVehicles[0],
        },
        {
          id: 2,
          userId: user?.id || 1,
          vehicleId: 2,
          slotId: 5,
          slotNumber: "P005",
          requestStatus: "approved",
          createdAt: "2023-06-25T11:30:00Z",
          updatedAt: "2023-06-26T10:15:00Z",
          vehicle: mockVehicles[1],
        },
        {
          id: 3,
          userId: user?.id || 1,
          vehicleId: 1,
          requestStatus: "rejected",
          createdAt: "2023-06-20T14:00:00Z",
          updatedAt: "2023-06-21T09:45:00Z",
          vehicle: mockVehicles[0],
        }
      ];

      // If admin, add requests from other users
      if (user?.role === 'ADMIN') {
        mockRequests.push({
          id: 4,
          userId: 2,
          vehicleId: 3,
          requestStatus: "pending",
          createdAt: "2023-07-02T10:30:00Z",
          updatedAt: "2023-07-02T10:30:00Z",
          vehicle: {
            id: 3,
            userId: 2,
            plateNumber: "DEF456",
            vehicleType: "car",
            size: "large",
            attributes: { color: "Black", model: "BMW X5" },
            createdAt: "2023-05-10T08:45:00Z"
          },
          user: {
            name: "John Doe",
            email: "john.doe@example.com"
          }
        });
      }
      
      setVehicles(mockVehicles);
      setRequests(mockRequests);
      setFilteredRequests(mockRequests);
      setTotalItems(mockRequests.length);
      setTotalPages(Math.ceil(mockRequests.length / itemsPerPage));
      setIsLoading(false);
    };
    
    fetchData();
  }, [user, itemsPerPage]);

  // Apply filters when status filter changes
  useEffect(() => {
    applyFilters();
  }, [statusFilter, searchQuery]);

  // Handle search and filters
  const applyFilters = () => {
    let filtered = requests;
    
    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(request => request.requestStatus === statusFilter);
    }
    
    // Apply search query
    if (searchQuery) {
      filtered = filtered.filter(request => 
        request.vehicle?.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.slotNumber?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredRequests(filtered);
    setTotalItems(filtered.length);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    setCurrentPage(1);
  };

  // Handle search button click
  const handleSearch = () => {
    applyFilters();
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("");
    applyFilters();
  };

  // Handle creating a new request
  const handleCreateRequest = (data: { vehicleId: number, notes?: string }) => {
    // In a real app, this would be an API call
    const vehicle = vehicles.find(v => v.id === data.vehicleId);
    if (!vehicle) return;
    
    const newRequest: SlotRequest = {
      id: Math.floor(Math.random() * 1000),
      userId: user!.id,
      vehicleId: data.vehicleId,
      requestStatus: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      vehicle,
    };
    
    setRequests([newRequest, ...requests]);
    setFilteredRequests([newRequest, ...filteredRequests]);
    setTotalItems(totalItems + 1);
    setTotalPages(Math.ceil((totalItems + 1) / itemsPerPage));
    
    toast({
      title: "Request submitted",
      description: "Your parking slot request has been submitted successfully.",
    });
  };

  // Handle approving a request (admin only)
  const handleApproveRequest = () => {
    if (!selectedRequest) return;
    
    // In a real app, this would be an API call
    const updatedRequest: SlotRequest = {
      ...selectedRequest,
      requestStatus: "approved",
      slotId: 10, // Mock slot assignment
      slotNumber: "P010",
      updatedAt: new Date().toISOString(),
    };
    
    setRequests(requests.map(r => r.id === selectedRequest.id ? updatedRequest : r));
    setFilteredRequests(filteredRequests.map(r => r.id === selectedRequest.id ? updatedRequest : r));
    
    toast({
      title: "Request approved",
      description: `Parking slot P010 has been assigned to vehicle ${selectedRequest.vehicle?.plateNumber}.`,
    });
    
    setIsApproveDialogOpen(false);
  };

  // Handle rejecting a request (admin only)
  const handleRejectRequest = () => {
    if (!selectedRequest) return;
    
    // In a real app, this would be an API call
    const updatedRequest: SlotRequest = {
      ...selectedRequest,
      requestStatus: "rejected",
      updatedAt: new Date().toISOString(),
    };
    
    setRequests(requests.map(r => r.id === selectedRequest.id ? updatedRequest : r));
    setFilteredRequests(filteredRequests.map(r => r.id === selectedRequest.id ? updatedRequest : r));
    
    toast({
      title: "Request rejected",
      description: `The parking request for vehicle ${selectedRequest.vehicle?.plateNumber} has been rejected.`,
    });
    
    setIsRejectDialogOpen(false);
  };

  // Handle canceling a request (user only)
  const handleCancelRequest = () => {
    if (!selectedRequest) return;
    
    // In a real app, this would be an API call
    setRequests(requests.filter(r => r.id !== selectedRequest.id));
    setFilteredRequests(filteredRequests.filter(r => r.id !== selectedRequest.id));
    setTotalItems(totalItems - 1);
    setTotalPages(Math.ceil((totalItems - 1) / itemsPerPage));
    
    toast({
      title: "Request canceled",
      description: "Your parking slot request has been canceled.",
    });
    
    setIsCancelDialogOpen(false);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get paginated data
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container px-4 py-8 mx-auto animate-fade-in">
      <PageTitle
        title={user?.role === 'ADMIN' ? "Slot Requests" : "My Requests"}
        description={
          user?.role === 'ADMIN'
            ? "Manage parking slot requests from users"
            : "Track your parking slot requests"
        }
        action={
          user?.role !== 'ADMIN' && (
            <Button onClick={() => setIsRequestDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Request
            </Button>
          )
        }
      />
      
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <SearchInput
          placeholder="Search by plate number or slot..."
          value={searchQuery}
          onChange={setSearchQuery}
          onSearch={handleSearch}
          className="w-full sm:w-auto sm:max-w-xs"
        />
        
        <div className="w-full sm:w-40">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button variant="outline" onClick={resetFilters} className="sm:ml-auto" size="sm">
          Reset Filters
        </Button>
      </div>
      
      {isLoading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-muted rounded"></div>
          ))}
        </div>
      ) : paginatedRequests.length === 0 ? (
        <EmptyState
          title="No requests found"
          description={
            statusFilter || searchQuery
              ? "Try adjusting your filters"
              : user?.role === 'ADMIN'
              ? "No parking slot requests have been submitted yet"
              : "You haven't made any parking slot requests yet"
          }
          action={
            user?.role !== 'ADMIN' && !statusFilter && !searchQuery
              ? {
                  label: "New Request",
                  onClick: () => setIsRequestDialogOpen(true),
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
                  <TableHead>Request ID</TableHead>
                  {user?.role === 'ADMIN' && <TableHead>User</TableHead>}
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Slot</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedRequests.map(request => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">#{request.id}</TableCell>
                    {user?.role === 'ADMIN' && (
                      <TableCell>{request.user?.name || "Unknown"}</TableCell>
                    )}
                    <TableCell>
                      {request.vehicle?.plateNumber} ({request.vehicle?.vehicleType})
                    </TableCell>
                    <TableCell>
                      {request.slotNumber || "-"}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={request.requestStatus} />
                    </TableCell>
                    <TableCell>{formatDate(request.createdAt)}</TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedRequest(request);
                          setIsViewDialogOpen(true);
                        }}
                      >
                        View
                      </Button>
                      
                      {user?.role === 'ADMIN' && request.requestStatus === 'pending' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-success/10 hover:bg-success/20 text-success"
                            onClick={() => {
                              setSelectedRequest(request);
                              setIsApproveDialogOpen(true);
                            }}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-destructive/10 hover:bg-destructive/20 text-destructive"
                            onClick={() => {
                              setSelectedRequest(request);
                              setIsRejectDialogOpen(true);
                            }}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                      
                      {user?.role !== 'ADMIN' && request.requestStatus === 'pending' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive"
                          onClick={() => {
                            setSelectedRequest(request);
                            setIsCancelDialogOpen(true);
                          }}
                        >
                          Cancel
                        </Button>
                      )}
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
      
      {/* New Request Dialog */}
      <SlotRequestForm
        open={isRequestDialogOpen}
        onOpenChange={setIsRequestDialogOpen}
        onSubmit={handleCreateRequest}
        vehicles={vehicles}
      />
      
      {/* View Request Dialog */}
      {selectedRequest && (
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Request Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium">Request ID</h4>
                  <p className="text-sm text-muted-foreground">#{selectedRequest.id}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Status</h4>
                  <StatusBadge status={selectedRequest.requestStatus} />
                </div>
                <div>
                  <h4 className="text-sm font-medium">Created</h4>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(selectedRequest.createdAt)}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Last Updated</h4>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(selectedRequest.updatedAt)}
                  </p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Vehicle Information</h4>
                <Card>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <h5 className="text-xs font-medium">Plate Number</h5>
                        <p className="text-sm">{selectedRequest.vehicle?.plateNumber}</p>
                      </div>
                      <div>
                        <h5 className="text-xs font-medium">Type</h5>
                        <p className="text-sm capitalize">{selectedRequest.vehicle?.vehicleType}</p>
                      </div>
                      <div>
                        <h5 className="text-xs font-medium">Size</h5>
                        <p className="text-sm capitalize">{selectedRequest.vehicle?.size}</p>
                      </div>
                      <div>
                        <h5 className="text-xs font-medium">Color</h5>
                        <p className="text-sm">{selectedRequest.vehicle?.attributes?.color || "-"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {selectedRequest.slotId && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Assigned Slot</h4>
                  <Card>
                    <CardContent className="p-4">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <h5 className="text-xs font-medium">Slot Number</h5>
                          <p className="text-sm">{selectedRequest.slotNumber}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Approve Request Dialog (Admin only) */}
      <AlertDialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Parking Request</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve this parking request for vehicle{" "}
              <span className="font-medium">{selectedRequest?.vehicle?.plateNumber}</span>?
              This will assign a parking slot to the vehicle.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleApproveRequest}
              className="bg-success text-success-foreground hover:bg-success/90"
            >
              Approve
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Reject Request Dialog (Admin only) */}
      <AlertDialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Parking Request</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reject this parking request for vehicle{" "}
              <span className="font-medium">{selectedRequest?.vehicle?.plateNumber}</span>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRejectRequest}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Reject
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Cancel Request Dialog (User only) */}
      <AlertDialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Parking Request</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this parking request for vehicle{" "}
              <span className="font-medium">{selectedRequest?.vehicle?.plateNumber}</span>?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelRequest}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Cancel Request
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
