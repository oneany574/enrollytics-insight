import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Course {
  courseName: string;
  count: number;
}

interface Source {
  sourceName: string;
  courses: Course[];
}

interface EnrollmentSourcesData {
  data: Source[];
}

interface EnrollmentSourcesChartProps {
  data: EnrollmentSourcesData;
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

export const EnrollmentSourcesChart: React.FC<EnrollmentSourcesChartProps> = ({ data }) => {
  // Aggregate source data
  const sourceAggregation = data.data.map(source => ({
    name: source.sourceName.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()),
    value: source.courses.reduce((sum, course) => sum + course.count, 0),
    originalName: source.sourceName
  })).sort((a, b) => b.value - a.value);

  // Get top performing sources for bar chart
  const topSources = sourceAggregation.slice(0, 8);

  // Course distribution across sources
  const courseSourceData = data.data.flatMap(source => 
    source.courses.map(course => ({
      source: source.sourceName.replace(/_/g, ' '),
      course: course.courseName.length > 25 ? course.courseName.substring(0, 25) + '...' : course.courseName,
      fullCourseName: course.courseName,
      count: course.count
    }))
  ).sort((a, b) => b.count - a.count).slice(0, 15);

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
          Enrollment Sources Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="sources" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sources">Source Distribution</TabsTrigger>
            <TabsTrigger value="courses">Course Performance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sources" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-80">
                <h3 className="text-lg font-semibold mb-4 text-center">Source Distribution</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sourceAggregation}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {sourceAggregation.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<PieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="h-80">
                <h3 className="text-lg font-semibold mb-4 text-center">Top Sources</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topSources} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis type="number" />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      width={100}
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" fill={COLORS[1]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="courses" className="space-y-4">
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={courseSourceData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="course" 
                    angle={-45}
                    textAnchor="end"
                    height={120}
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="count" fill={COLORS[2]} name="Enrollments" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};