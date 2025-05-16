
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { User, Role } from "@/types";
import { Button } from "@/components/ui/button";
import { PageTitle } from "@/components/PageTitle";
import { SearchInput } from "@/components/SearchInput";
import { Pagination } from "@/components/Pagination";
import { EmptyState } from "@/components/EmptyState";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Navigate } from "react-router-dom";
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

export default function UsersPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Only admins can access this page
  if (user?.role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }

  useEffect(() => {
    const fetchUsers = async () => {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock users data
      const mockUsers: User[] = [
        {
          id: 1,
          name: "Admin User",
          email: "admin@example.com",
          role: "ADMIN",
        },
        {
          id: 2,
          name: "John Doe",
          email: "john@example.com",
          role: "USER",
        },
        {
          id: 3,
          name: "Jane Smith",
          email: "jane@example.com",
          role: "USER",
        },
        {
          id: 4,
          name: "Michael Johnson",
          email: "michael@example.com",
          role: "USER",
        },
        {
          id: 5,
          name: "Sara Williams",
          email: "sara@example.com",
          role: "USER",
        },
      ];
      
      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
      setTotalItems(mockUsers.length);
      setTotalPages(Math.ceil(mockUsers.length / itemsPerPage));
      setIsLoading(false);
    };
    
    fetchUsers();
  }, [itemsPerPage]);

  // Handle search
  const handleSearch = () => {
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setFilteredUsers(filtered);
    setTotalItems(filtered.length);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    setCurrentPage(1);
  };

  // Handle changing user role
  const handleToggleRole = (userId: number) => {
    // In a real app, this would be an API call
    const updatedUsers = users.map(u => {
      if (u.id === userId) {
        const newRole: Role = u.role === 'ADMIN' ? 'USER' : 'ADMIN';
        toast({
          title: "Role updated",
          description: `${u.name}'s role has been changed to ${newRole}.`,
        });
        return { ...u, role: newRole };
      }
      return u;
    });
    
    setUsers(updatedUsers);
    setFilteredUsers(updatedUsers.filter(u =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
    ));
  };

  // Handle deleting a user
  const handleDeleteUser = () => {
    if (!selectedUser) return;
    
    // In a real app, this would be an API call
    const updatedUsers = users.filter(u => u.id !== selectedUser.id);
    setUsers(updatedUsers);
    setFilteredUsers(updatedUsers.filter(u =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
    ));
    
    setTotalItems(totalItems - 1);
    setTotalPages(Math.ceil((totalItems - 1) / itemsPerPage));
    
    toast({
      title: "User deleted",
      description: `${selectedUser.name} has been deleted from the system.`,
    });
    
    setIsDeleteDialogOpen(false);
  };

  // Get paginated data
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container px-4 py-8 mx-auto animate-fade-in">
      <PageTitle
        title="Manage Users"
        description="View and manage system users"
      />
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <SearchInput
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={setSearchQuery}
          onSearch={handleSearch}
        />
      </div>
      
      {isLoading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-16 bg-muted rounded"></div>
          ))}
        </div>
      ) : paginatedUsers.length === 0 ? (
        <EmptyState
          title="No users found"
          description="Try adjusting your search query"
        />
      ) : (
        <>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.map(user => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === 'ADMIN' ? "default" : "outline"}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleRole(user.id)}
                      >
                        {user.role === 'ADMIN' ? 'Make User' : 'Make Admin'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive"
                        onClick={() => {
                          setSelectedUser(user);
                          setIsDeleteDialogOpen(true);
                        }}
                        disabled={user.id === 1} // Prevent deleting the main admin
                      >
                        Delete
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
      
      {/* Delete User Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user
              {selectedUser && ` "${selectedUser.name}"`} and all their data from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
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
