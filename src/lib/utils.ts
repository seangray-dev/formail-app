import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
type SubmissionData = {
  [key: string]: string;
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const exportToJson = (
  selectedData: SubmissionData[],
  filename?: string
) => {
  if (!selectedData) return;

  const dataStr = JSON.stringify(selectedData);
  const dataUri =
    'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
  // Use the provided filename or fall back to the default name
  const exportFileDefaultName = filename || 'data.json';

  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
};

export const convertToCSV = (objArray: SubmissionData[]) => {
  if (!objArray || objArray.length === 0) return '';

  // Collect all unique headers/keys from all objects
  const allHeaders = new Set<string>();
  objArray.forEach((obj) =>
    Object.keys(obj).forEach((key) => allHeaders.add(key))
  );

  // Convert Set of headers to Array
  const headers = Array.from(allHeaders);

  // Construct CSV string
  const csvRows = [
    // Headers row
    headers.join(','),
    ...objArray.map((row) =>
      // Map each value under its header
      headers.map((header) => JSON.stringify(row[header] || '')).join(',')
    ),
  ];

  // Join all rows with new line
  return csvRows.join('\r\n');
};

export const exportToCsv = (
  selectedData: SubmissionData[],
  filename?: string
) => {
  if (!selectedData || selectedData.length === 0) return;

  const csvStr = convertToCSV(selectedData);
  const dataUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvStr);
  // Use the provided filename or fall back to the default name
  const exportFileDefaultName = filename || 'data.csv';

  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
};
