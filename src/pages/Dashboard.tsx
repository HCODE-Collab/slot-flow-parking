
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { PageTitle } from "@/components/PageTitle";
import { StatsCard } from "@/components/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { ChartData, StatsData } from "@/types";

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<StatsData>({
    totalVehicles: 0,
    availableSlots: 0,
    pendingRequests: 0,
    occupiedSlots: 0,
  });
  const [vehicleTypeData, setVehicleTypeData] = useState<ChartData[]>([]);
  const [requestStatusData, setRequestStatusData] = useState<ChartData[]>([]);
  const [slotLocationData, setSlotLocationData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock data fetch
    const fetchData = async () => {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock stats data
      setStats({
        totalVehicles: 12,
        availableSlots: 43,
        pendingRequests: 5,
        occupiedSlots: 27,
      });
      
      // Mock vehicle type data for pie chart
      setVehicleTypeData([
        { name: "Car", value: 8 },
        { name: "Motorcycle", value: 3 },
        { name: "Truck", value: 1 },
      ]);
      
      // Mock request status data for bar chart
      setRequestStatusData([
        { name: "Pending", value: 5 },
        { name: "Approved", value: 15 },
        { name: "Rejected", value: 2 },
      ]);
      
      // Mock slot location data for bar chart
      setSlotLocationData([
        { name: "North", value: 20 },
        { name: "South", value: 18 },
        { name: "East", value: 15 },
        { name: "West", value: 17 },
      ]);
      
      setIsLoading(false);
    };
    
    fetchData();
  }, []);

  // Custom colors for charts
  const COLORS = ['#3b82f6', '#10b981', '#f43f5e', '#f59e0b'];

  return (
    <div className="container px-4 py-8 mx-auto animate-fade-in">
      <PageTitle
        title={`Welcome, ${user?.name}!`}
        description="View your parking management dashboard"
      />
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            <StatsCard
              title="Total Vehicles"
              value={stats.totalVehicles}
              helperText="Registered in the system"
            />
            <StatsCard
              title="Available Slots"
              value={stats.availableSlots}
              helperText="Ready for allocation"
              trend="up"
              trendValue="+2"
            />
            <StatsCard
              title="Pending Requests"
              value={stats.pendingRequests}
              helperText="Awaiting approval"
              trend={stats.pendingRequests > 2 ? "up" : "down"}
              trendValue={stats.pendingRequests > 2 ? "+3" : "-1"}
            />
            <StatsCard
              title="Occupied Slots"
              value={stats.occupiedSlots}
              helperText="Currently in use"
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Vehicle Types</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={vehicleTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => 
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {vehicleTypeData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={COLORS[index % COLORS.length]} 
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Request Status</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={requestStatusData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" name="Count" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {user?.role === 'ADMIN' && (
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Parking Slots by Location</CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={slotLocationData}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" name="Number of Slots" fill="#10b981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </>
      )}
    </div>
  );
}
