import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, TrendingUp, Users, BookOpen, Target } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  onExportExcel: () => void;
  stats?: {
    totalEnrollments: number;
    totalCourses: number;
    totalSources: number;
    conversionRate: string;
  };
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  title,
  onExportExcel,
  stats
}) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{title}</h1>
              <p className="text-muted-foreground mt-2">
                Comprehensive analytics and insights for student enrollments
              </p>
            </div>
            <Button onClick={onExportExcel} className="bg-primary hover:bg-primary/90">
              <Download className="w-4 h-4 mr-2" />
              Export to Excel
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="container py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-r from-chart-1/10 to-chart-1/5 border-chart-1/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
                <Users className="h-4 w-4 text-chart-1" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-chart-1">{stats.totalEnrollments}</div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="w-3 h-3 inline mr-1" />
                  Active students
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-chart-2/10 to-chart-2/5 border-chart-2/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
                <BookOpen className="h-4 w-4 text-chart-2" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-chart-2">{stats.totalCourses}</div>
                <p className="text-xs text-muted-foreground">
                  Available programs
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-chart-6/10 to-chart-6/5 border-chart-6/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Lead Sources</CardTitle>
                <Target className="h-4 w-4 text-chart-6" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-chart-6">{stats.totalSources}</div>
                <p className="text-xs text-muted-foreground">
                  Active channels
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-success/10 to-success/5 border-success/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">{stats.conversionRate}</div>
                <p className="text-xs text-muted-foreground">
                  Lead to enrollment
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container pb-8">
        {children}
      </div>
    </div>
  );
};