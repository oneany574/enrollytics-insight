import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Level {
  level: string;
  count: number;
}

interface Course {
  course: string;
  levels: Level[];
}

interface EnrollmentLevelsData {
  data: Course[];
}

interface EnrollmentLevelsChartProps {
  data: EnrollmentLevelsData;
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

export const EnrollmentLevelsChart: React.FC<EnrollmentLevelsChartProps> = ({ data }) => {
  // Aggregate level data across all courses
  const levelAggregation = data.data.reduce((acc, course) => {
    course.levels.forEach(level => {
      if (acc[level.level]) {
        acc[level.level] += level.count;
      } else {
        acc[level.level] = level.count;
      }
    });
    return acc;
  }, {} as Record<string, number>);

  const levelPieData = Object.entries(levelAggregation).map(([level, count]) => ({
    name: level === 'UNKNOWN' ? 'Unspecified' : level.toUpperCase(),
    value: count,
  }));

  // Prepare data for course-wise bar chart
  const courseBarData = data.data.map(course => {
    const totalCount = course.levels.reduce((sum, level) => sum + level.count, 0);
    return {
      course: course.course.length > 20 ? course.course.substring(0, 20) + '...' : course.course,
      fullCourseName: course.course,
      totalEnrollments: totalCount,
      ...course.levels.reduce((acc, level) => {
        acc[level.level === 'UNKNOWN' ? 'Unspecified' : level.level] = level.count;
        return acc;
      }, {} as Record<string, number>)
    };
  }).sort((a, b) => b.totalEnrollments - a.totalEnrollments).slice(0, 10);

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

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-foreground">
          Enrollment Distribution by Levels
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Level Overview</TabsTrigger>
            <TabsTrigger value="courses">Course Breakdown</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={levelPieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {levelPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="courses" className="space-y-4">
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={courseBarData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
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
                  <Bar dataKey="totalEnrollments" fill={COLORS[0]} name="Total Enrollments" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};