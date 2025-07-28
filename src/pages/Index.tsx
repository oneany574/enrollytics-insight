import React from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { EnrollmentLevelsChart } from '@/components/dashboard/EnrollmentLevelsChart';
import { EnrollmentSourcesChart } from '@/components/dashboard/EnrollmentSourcesChart';
import { StaffPerformanceChart } from '@/components/dashboard/StaffPerformanceChart';
import { DataTable } from '@/components/dashboard/DataTable';
import { Badge } from '@/components/ui/badge';
import { 
  exportToExcel, 
  prepareEnrollmentLevelsData, 
  prepareEnrollmentSourcesData, 
  prepareStaffPerformanceData 
} from '@/utils/excelExport';

// Sample data - replace with your actual API data
const enrollmentLevelsData = {
  "data": [
    {
      "course": "A Level Created",
      "levels": [
        {
          "level": "UNKNOWN",
          "count": 2
        }
      ]
    },
    {
      "course": "A Levels Non Science",
      "levels": [
        {
          "level": "UNKNOWN",
          "count": 5
        }
      ]
    },
    {
      "course": "A Levels Science",
      "levels": [
        {
          "level": "UNKNOWN",
          "count": 10
        }
      ]
    },
    {
      "course": "Acca",
      "levels": [
        {
          "level": "UNKNOWN",
          "count": 5
        },
        {
          "level": "l3",
          "count": 1
        }
      ]
    },
    {
      "course": "Bachelors in Information Technology",
      "levels": [
        {
          "level": "l4",
          "count": 2
        },
        {
          "level": "l3",
          "count": 1
        },
        {
          "level": "UNKNOWN",
          "count": 1
        }
      ]
    },
    {
      "course": "BBA (Hons) Business and Management",
      "levels": [
        {
          "level": "l5",
          "count": 1
        },
        {
          "level": "UNKNOWN",
          "count": 8
        },
        {
          "level": "l4",
          "count": 1
        }
      ]
    },
    {
      "course": "BSc (Hons) Computer Science",
      "levels": [
        {
          "level": "l4",
          "count": 3
        },
        {
          "level": "l3",
          "count": 3
        },
        {
          "level": "UNKNOWN",
          "count": 7
        }
      ]
    },
    {
      "course": "MBA",
      "levels": [
        {
          "level": "l4",
          "count": 2
        },
        {
          "level": "l5",
          "count": 1
        },
        {
          "level": "UNKNOWN",
          "count": 6
        }
      ]
    }
  ]
};

const enrollmentSourcesData = {
  "data": [
    {
      "sourceName": "WALKIN",
      "courses": [
        {
          "courseName": "Masters In Information Management",
          "count": 7
        },
        {
          "courseName": "BBA (Hons) Business and Management",
          "count": 6
        },
        {
          "courseName": "BSc (Hons) Computer Science",
          "count": 6
        },
        {
          "courseName": "Bsc (H) Computer Science - AI",
          "count": 5
        },
        {
          "courseName": "MBA",
          "count": 9
        }
      ]
    },
    {
      "sourceName": "CAMPAIGN",
      "courses": [
        {
          "courseName": "A Levels Science",
          "count": 3
        },
        {
          "courseName": "BSc (Hons) Computer Science",
          "count": 5
        },
        {
          "courseName": "Acca",
          "count": 3
        },
        {
          "courseName": "BBA (Hons) Business and Management",
          "count": 2
        }
      ]
    },
    {
      "sourceName": "GOOGLE",
      "courses": [
        {
          "courseName": "BSc Test",
          "count": 1
        },
        {
          "courseName": "BBA (Hons) Business and Management",
          "count": 1
        }
      ]
    },
    {
      "sourceName": "AGENCY",
      "courses": [
        {
          "courseName": "Bsc Hotel Science",
          "count": 6
        },
        {
          "courseName": "BSc (Hons) Computer Science",
          "count": 1
        }
      ]
    }
  ]
};

const telecallerData = {
  "statusCode": 200,
  "message": "Telecaller assigned total fetched",
  "data": [
    {
      "courseName": "BBA (Hons) Business and Management",
      "count": 1,
      "type": "BACHELORS"
    },
    {
      "courseName": "BSc (Hons) Computer Science",
      "count": 5,
      "type": "BACHELORS"
    },
    {
      "courseName": "BSc Test",
      "count": 1,
      "type": "BACHELORS"
    },
    {
      "courseName": "Acca",
      "count": 3,
      "type": "ACCA"
    },
    {
      "courseName": "Bachelors in Information Technology",
      "count": 2,
      "type": "BACHELORS"
    }
  ]
};

const counsellorData = {
  "statusCode": 200,
  "message": "Counsellor assigned total fetched",
  "data": [
    {
      "courseName": "BBA (Hons) Business and Management",
      "count": 1,
      "type": "BACHELORS"
    },
    {
      "courseName": "BSc (Hons) Computer Science",
      "count": 5,
      "type": "BACHELORS"
    },
    {
      "courseName": "BSc Test",
      "count": 1,
      "type": "BACHELORS"
    },
    {
      "courseName": "Acca",
      "count": 3,
      "type": "ACCA"
    },
    {
      "courseName": "Bachelors in Information Technology",
      "count": 2,
      "type": "BACHELORS"
    }
  ]
};

const Index = () => {
  // Calculate statistics
  const totalEnrollments = enrollmentLevelsData.data.reduce((sum, course) => 
    sum + course.levels.reduce((levelSum, level) => levelSum + level.count, 0), 0
  );
  
  const totalCourses = enrollmentLevelsData.data.length;
  const totalSources = enrollmentSourcesData.data.length;
  const conversionRate = "68.5%"; // This would typically be calculated from your data

  const stats = {
    totalEnrollments,
    totalCourses,
    totalSources,
    conversionRate
  };

  // Prepare table data
  const enrollmentTableData = enrollmentLevelsData.data.flatMap((course, courseIndex) =>
    course.levels.map((level, levelIndex) => ({
      id: `${courseIndex}-${levelIndex}`,
      course: course.course,
      level: level.level === 'UNKNOWN' ? 'Unspecified' : level.level.toUpperCase(),
      count: level.count,
      courseFull: course.course
    }))
  );

  const sourceTableData = enrollmentSourcesData.data.flatMap((source, sourceIndex) =>
    source.courses.map((course, courseIndex) => ({
      id: `${sourceIndex}-${courseIndex}`,
      source: source.sourceName.replace(/_/g, ' '),
      course: course.courseName,
      count: course.count,
      sourceFull: source.sourceName
    }))
  );

  const enrollmentColumns = [
    { key: 'course', label: 'Course Name', sortable: true },
    { 
      key: 'level', 
      label: 'Level', 
      sortable: true,
      render: (value: string) => (
        <Badge variant={value === 'Unspecified' ? 'secondary' : 'default'}>
          {value}
        </Badge>
      )
    },
    { key: 'count', label: 'Enrollments', sortable: true }
  ];

  const sourceColumns = [
    { 
      key: 'source', 
      label: 'Source', 
      sortable: true,
      render: (value: string) => (
        <Badge variant="outline" className="font-medium">
          {value}
        </Badge>
      )
    },
    { key: 'course', label: 'Course Name', sortable: true },
    { key: 'count', label: 'Enrollments', sortable: true }
  ];

  const handleExportExcel = () => {
    const exportData = [
      {
        sheetName: 'Enrollment Levels',
        data: prepareEnrollmentLevelsData(enrollmentLevelsData)
      },
      {
        sheetName: 'Enrollment Sources',
        data: prepareEnrollmentSourcesData(enrollmentSourcesData)
      },
      {
        sheetName: 'Staff Performance',
        data: prepareStaffPerformanceData(telecallerData, counsellorData)
      }
    ];

    exportToExcel(exportData, 'student-enrollment-report');
  };

  return (
    <DashboardLayout
      title="Student Enrollment Analytics"
      onExportExcel={handleExportExcel}
      stats={stats}
    >
      <div className="space-y-8">
        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <EnrollmentLevelsChart data={enrollmentLevelsData} />
          <EnrollmentSourcesChart data={enrollmentSourcesData} />
        </div>

        {/* Staff Performance */}
        <StaffPerformanceChart 
          telecallerData={telecallerData} 
          counsellorData={counsellorData} 
        />

        {/* Data Tables */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <DataTable
            title="Enrollment by Levels"
            data={enrollmentTableData}
            columns={enrollmentColumns}
          />
          <DataTable
            title="Enrollment by Sources"
            data={sourceTableData}
            columns={sourceColumns}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;