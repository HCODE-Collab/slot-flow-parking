
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Log } from "@/types";
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
import { Navigate } from "react-router-dom";

export default function LogsPage() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<Log[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<Log[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Only admins can access this page
  if (user?.role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }

  useEffect(() => {
    const fetchLogs = async () => {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate mock logs data
      const mockLogs: Log[] = [];
      const actions = [
        "User login",
        "Vehicle added",
        "Vehicle updated",
        "Vehicle deleted",
        "Slot request created",
        "Slot request approved",
        "Slot request rejected",
        "Slot status updated",
        "User registered",
        "Profile updated",
      ];
      
      const users = [
        { id: 1, name: "Admin User" },
        { id: 2, name: "John Doe" },
        { id: 3, name: "Jane Smith" },
        { id: 4, name: "Michael Johnson" },
      ];
      
      for (let i = 1; i <= 100; i++) {
        const user = users[i % users.length];
        const action = actions[i % actions.length];
        const date = new Date();
        date.setHours(date.getHours() - i);
        
        mockLogs.push({
          id: i,
          userId: user.id,
          action,
          timestamp: date.toISOString(),
          userName: user.name,
        });
      }
      
      setLogs(mockLogs);
      setFilteredLogs(mockLogs);
      setTotalItems(mockLogs.length);
      setTotalPages(Math.ceil(mockLogs.length / itemsPerPage));
      setIsLoading(false);
    };
    
    fetchLogs();
  }, [itemsPerPage]);

  // Handle search
  const handleSearch = () => {
    const filtered = logs.filter(log =>
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.userName?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setFilteredLogs(filtered);
    setTotalItems(filtered.length);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    setCurrentPage(1);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // Get paginated data
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container px-4 py-8 mx-auto animate-fade-in">
      <PageTitle
        title="System Logs"
        description="View system activity logs"
      />
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <SearchInput
          placeholder="Search by action or user..."
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
      ) : paginatedLogs.length === 0 ? (
        <EmptyState
          title="No logs found"
          description="Try adjusting your search query"
        />
      ) : (
        <>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedLogs.map(log => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-sm">
                      {formatDate(log.timestamp)}
                    </TableCell>
                    <TableCell>{log.userName || `User #${log.userId}`}</TableCell>
                    <TableCell>{log.action}</TableCell>
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
