import * as XLSX from 'xlsx';

interface ExportData {
  sheetName: string;
  data: any[];
  headers?: string[];
}

export const exportToExcel = (exportData: ExportData[], filename: string = 'enrollment-report') => {
  // Create a new workbook
  const workbook = XLSX.utils.book_new();

  exportData.forEach(({ sheetName, data, headers }) => {
    let worksheet;
    
    if (headers && headers.length > 0) {
      // Create worksheet with custom headers
      worksheet = XLSX.utils.json_to_sheet(data, { header: headers });
    } else {
      // Create worksheet with automatic headers
      worksheet = XLSX.utils.json_to_sheet(data);
    }

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  });

  // Generate Excel file and download
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
  const fileName = `${filename}-${timestamp}.xlsx`;
  
  XLSX.writeFile(workbook, fileName);
};

// Helper function to flatten nested objects for Excel export
export const flattenObject = (obj: any, prefix: string = ''): any => {
  const flattened: any = {};
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = prefix ? `${prefix}_${key}` : key;
      
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        Object.assign(flattened, flattenObject(obj[key], newKey));
      } else if (Array.isArray(obj[key])) {
        flattened[newKey] = JSON.stringify(obj[key]);
      } else {
        flattened[newKey] = obj[key];
      }
    }
  }
  
  return flattened;
};

// Convert enrollment levels data for Excel export
export const prepareEnrollmentLevelsData = (data: any) => {
  const exportData: any[] = [];
  
  data.data.forEach((course: any) => {
    course.levels.forEach((level: any) => {
      exportData.push({
        'Course Name': course.course,
        'Level': level.level === 'UNKNOWN' ? 'Unspecified' : level.level.toUpperCase(),
        'Count': level.count
      });
    });
  });
  
  return exportData;
};

// Convert enrollment sources data for Excel export
export const prepareEnrollmentSourcesData = (data: any) => {
  const exportData: any[] = [];
  
  data.data.forEach((source: any) => {
    source.courses.forEach((course: any) => {
      exportData.push({
        'Source Name': source.sourceName.replace(/_/g, ' '),
        'Course Name': course.courseName,
        'Count': course.count
      });
    });
  });
  
  return exportData;
};

// Convert staff performance data for Excel export
export const prepareStaffPerformanceData = (telecallerData: any, counsellorData: any) => {
  const exportData: any[] = [];
  
  telecallerData.data.forEach((course: any) => {
    const counsellorCourse = counsellorData.data.find(
      (c: any) => c.courseName === course.courseName
    );
    
    exportData.push({
      'Course Name': course.courseName,
      'Course Type': course.type,
      'Telecaller Enrollments': course.count,
      'Counsellor Enrollments': counsellorCourse?.count || 0,
      'Total Enrollments': course.count + (counsellorCourse?.count || 0)
    });
  });
  
  return exportData;
};