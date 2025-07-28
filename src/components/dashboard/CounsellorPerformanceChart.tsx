import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

interface CounsellorPerformanceChartProps {
  data: StaffPerformanceData;
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

export const CounsellorPerformanceChart: React.FC<CounsellorPerformanceChartProps> = ({ data }) => {
  const counsellorCourses = data.data
    .filter(course => course.count > 0)
    .sort((a, b) => b.count - a.count);
  
  const counsellorByType = data.data.reduce((acc, course) => {
    const type = course.type || 'OTHER';
    if (acc[type]) {
      acc[type] += course.count;
    } else {
      acc[type] = course.count;
    }
    return acc;
  }, {} as Record<string, number>);

  const counsellorPieData = Object.entries(counsellorByType).map(([type, count]) => ({
    name: type,
    value: count,
  }));

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
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold text-foreground">
          Counsellor Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
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
                <PieTooltip />
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
      </CardContent>
    </Card>
  );
};