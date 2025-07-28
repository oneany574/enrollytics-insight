import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface StaffCourse {
  courseName: string;
  count: number;
  type: string;
}

interface StaffPerformanceData {
  statusCode: number;
  message: string;
  data: StaffCourse[];
}

interface StaffPerformanceChartProps {
  telecallerData: StaffPerformanceData;
  counsellorData: StaffPerformanceData;
}

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  'hsl(var(--chart-6))',
  'hsl(var(--chart-7))',
  'hsl(var(--chart-8))',
];

const TYPE_COLORS = {
  BACHELORS: 'hsl(var(--chart-1))',
  MASTERS: 'hsl(var(--chart-2))',
  ALEVEL: 'hsl(var(--chart-3))',
  ACCA: 'hsl(var(--chart-4))',
  OTHER: 'hsl(var(--chart-5))',
};

export const StaffPerformanceChart: React.FC<StaffPerformanceChartProps> = ({
  telecallerData,
  counsellorData
}) => {
  // Process telecaller data
  const telecallerCourses = telecallerData.data
    .filter(course => course.count > 0)
    .sort((a, b) => b.count - a.count);
  
  const telecallerByType = telecallerData.data.reduce((acc, course) => {
    const type = course.type || 'OTHER';
    if (acc[type]) {
      acc[type] += course.count;
    } else {
      acc[type] = course.count;
    }
    return acc;
  }, {} as Record<string, number>);

  // Process counsellor data
  const counsellorCourses = counsellorData.data
    .filter(course => course.count > 0)
    .sort((a, b) => b.count - a.count);
  
  const counsellorByType = counsellorData.data.reduce((acc, course) => {
    const type = course.type || 'OTHER';
    if (acc[type]) {
      acc[type] += course.count;
    } else {
      acc[type] = course.count;
    }
    return acc;
  }, {} as Record<string, number>);

  const telecallerPieData = Object.entries(telecallerByType).map(([type, count]) => ({
    name: type,
    value: count,
  }));

  const counsellorPieData = Object.entries(counsellorByType).map(([type, count]) => ({
    name: type,
    value: count,
  }));

  // Comparison data
  const comparisonData = telecallerData.data.map(telecallerCourse => {
    const counsellorCourse = counsellorData.data.find(
      c => c.courseName === telecallerCourse.courseName
    );
    
    return {
      course: telecallerCourse.courseName.length > 20 
        ? telecallerCourse.courseName.substring(0, 20) + '...' 
        : telecallerCourse.courseName,
      fullCourseName: telecallerCourse.courseName,
      telecaller: telecallerCourse.count,
      counsellor: counsellorCourse?.count || 0,
      type: telecallerCourse.type
    };
  }).filter(item => item.telecaller > 0 || item.counsellor > 0);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-card-foreground">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-card-foreground">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            Enrollments: {data.value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-foreground">
          Staff Performance Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="comparison" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="comparison">Performance Comparison</TabsTrigger>
            <TabsTrigger value="telecaller">Telecaller Results</TabsTrigger>
            <TabsTrigger value="counsellor">Counsellor Results</TabsTrigger>
          </TabsList>
          
          <TabsContent value="comparison" className="space-y-4">
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="course" 
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="telecaller" fill={COLORS[0]} name="Telecaller Enrollments" />
                  <Bar dataKey="counsellor" fill={COLORS[1]} name="Counsellor Enrollments" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="telecaller" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-80">
                <h3 className="text-lg font-semibold mb-4 text-center">Course Type Distribution</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={telecallerPieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {telecallerPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={TYPE_COLORS[entry.name as keyof typeof TYPE_COLORS] || COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<PieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Top Performing Courses</h3>
                {telecallerCourses.slice(0, 8).map((course, index) => (
                  <div key={course.courseName} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                      <span className="font-medium text-sm">{course.courseName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{course.type}</Badge>
                      <span className="font-bold text-chart-1">{course.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="counsellor" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-80">
                <h3 className="text-lg font-semibold mb-4 text-center">Course Type Distribution</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={counsellorPieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {counsellorPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={TYPE_COLORS[entry.name as keyof typeof TYPE_COLORS] || COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<PieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Top Performing Courses</h3>
                {counsellorCourses.slice(0, 8).map((course, index) => (
                  <div key={course.courseName} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                      <span className="font-medium text-sm">{course.courseName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{course.type}</Badge>
                      <span className="font-bold text-chart-2">{course.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};