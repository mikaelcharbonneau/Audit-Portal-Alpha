import { User, Inspection, Report, Issue, FormSection } from '../types';

export const currentUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@hpe.com',
  role: 'Senior Technician',
  lastInspectionDate: '2023-04-15',
};

export const recentInspections: Inspection[] = [
  {
    id: '1',
    status: 'completed',
    location: 'Data Center A, Row 3',
    date: '2023-04-15',
    issueCount: 2,
    completedBy: currentUser.id,
  },
  {
    id: '2',
    status: 'in-progress',
    location: 'Data Center B, Row 1',
    date: '2023-04-12',
    issueCount: 5,
  },
  {
    id: '3',
    status: 'completed',
    location: 'Data Center A, Row 7',
    date: '2023-04-10',
    issueCount: 0,
    completedBy: currentUser.id,
  },
  {
    id: '4',
    status: 'completed',
    location: 'Data Center C, Row 2',
    date: '2023-04-08',
    issueCount: 3,
    completedBy: currentUser.id,
  },
];

export const issues: Issue[] = [
  {
    id: '1',
    description: 'Faulty cooling system in rack A3',
    status: 'resolved',
    severity: 'high',
    location: 'Data Center A, Row 3',
    createdAt: '2023-04-10T09:00:00Z',
    updatedAt: '2023-04-15T14:00:00Z',
    assignedTo: currentUser.id,
  },
  {
    id: '2',
    description: 'PDU showing intermittent power fluctuations',
    status: 'in-progress',
    severity: 'medium',
    location: 'Data Center B, Row 1',
    createdAt: '2023-04-12T11:00:00Z',
    updatedAt: '2023-04-12T16:00:00Z',
    assignedTo: currentUser.id,
  },
  {
    id: '3',
    description: 'UPS battery replacement needed',
    status: 'open',
    severity: 'low',
    location: 'Data Center A, Row 7',
    createdAt: '2023-04-14T08:00:00Z',
    updatedAt: '2023-04-14T08:00:00Z',
  },
  {
    id: '4',
    description: 'Network switch unresponsive',
    status: 'open',
    severity: 'critical',
    location: 'Data Center C, Row 2',
    createdAt: '2023-04-16T10:00:00Z',
    updatedAt: '2023-04-16T10:00:00Z',
  },
  {
    id: '5',
    description: 'Temperature sensors showing incorrect readings',
    status: 'in-progress',
    severity: 'medium',
    location: 'Data Center A, Row 1',
    createdAt: '2023-03-20T13:15:00Z',
    updatedAt: '2023-03-22T09:30:00Z',
    assignedTo: currentUser.id,
  },
  {
    id: '6',
    description: 'Fire suppression system needs inspection',
    status: 'resolved',
    severity: 'high',
    location: 'Data Center B, Row 5',
    createdAt: '2023-02-05T11:20:00Z',
    updatedAt: '2023-02-10T16:45:00Z',
    assignedTo: currentUser.id,
  },
  {
    id: '7',
    description: 'Water leak detected near CRAC unit',
    status: 'resolved',
    severity: 'critical',
    location: 'Data Center A, Row 2',
    createdAt: '2023-01-15T08:10:00Z',
    updatedAt: '2023-01-15T14:30:00Z',
    assignedTo: currentUser.id,
  },
];

export const reports: Report[] = [
  {
    id: '1',
    title: 'Monthly Inspection - April',
    location: 'Data Center A',
    date: '2023-04-30',
    thumbnail: 'https://images.pexels.com/photos/325229/pexels-photo-325229.jpeg',
    issues: [
      issues[0], // Faulty cooling system
      issues[2], // UPS battery replacement
      issues[4], // Temperature sensors
    ],
    summary: 'Monthly inspection revealed 3 issues in Data Center A, primarily related to cooling and power systems. All critical issues have been addressed.',
    recommendations: 'Schedule preventive maintenance for cooling systems and replace UPS batteries in the next maintenance window.'
  },
  {
    id: '2',
    title: 'Quarterly Review - Q1',
    location: 'Data Center B',
    date: '2023-03-31',
    thumbnail: 'https://images.pexels.com/photos/325229/pexels-photo-325229.jpeg',
    issues: [
      issues[1], // PDU fluctuations
      issues[5], // Fire suppression system
    ],
    summary: 'Quarterly review of Data Center B identified 2 issues that require attention. The fire suppression system has been inspected and certified.',
    recommendations: 'Monitor PDU power fluctuations and consider replacement if issue persists beyond next maintenance cycle.'
  },
  {
    id: '3',
    title: 'Annual Review - 2022',
    location: 'All Locations',
    date: '2023-01-05',
    thumbnail: 'https://images.pexels.com/photos/325229/pexels-photo-325229.jpeg',
    issues: [
      issues[3], // Network switch
      issues[6], // Water leak
    ],
    summary: 'Annual review across all data centers highlighted significant improvements in overall reliability. Two critical issues were identified and resolved promptly.',
    recommendations: 'Implement quarterly water detection system tests and upgrade network infrastructure in Data Center C.'
  },
];

export const formSections: FormSection[] = [
  {
    id: 'power-supply-unit',
    title: 'Power Supply Unit',
    fields: [
      {
        id: 'psu-issue-description',
        label: 'Issue Description',
        type: 'textarea',
        placeholder: 'Describe any issues with the Power Supply Unit',
        required: true,
      },
      {
        id: 'psu-location',
        label: 'Location',
        type: 'location',
        placeholder: 'Select location',
        required: true,
      },
      {
        id: 'psu-serial-number',
        label: 'Serial Number',
        type: 'barcode',
        placeholder: 'Scan or enter serial number',
        required: true,
      },
      {
        id: 'psu-comments',
        label: 'Additional Comments',
        type: 'textarea',
        placeholder: 'Add any additional comments',
      },
      {
        id: 'psu-files',
        label: 'Upload Files',
        type: 'file',
      },
    ],
  },
  {
    id: 'power-distribution-unit',
    title: 'Power Distribution Unit',
    fields: [
      {
        id: 'pdu-issue-description',
        label: 'Issue Description',
        type: 'textarea',
        placeholder: 'Describe any issues with the Power Distribution Unit',
        required: true,
      },
      {
        id: 'pdu-location',
        label: 'Location',
        type: 'location',
        placeholder: 'Select location',
        required: true,
      },
      {
        id: 'pdu-serial-number',
        label: 'Serial Number',
        type: 'barcode',
        placeholder: 'Scan or enter serial number',
        required: true,
      },
      {
        id: 'pdu-comments',
        label: 'Additional Comments',
        type: 'textarea',
        placeholder: 'Add any additional comments',
      },
      {
        id: 'pdu-files',
        label: 'Upload Files',
        type: 'file',
      },
    ],
  },
  {
    id: 'rdhx-verification',
    title: 'RDHX Verification',
    fields: [
      {
        id: 'rdhx-issue-description',
        label: 'Issue Description',
        type: 'textarea',
        placeholder: 'Describe any issues with RDHX',
        required: true,
      },
      {
        id: 'rdhx-location',
        label: 'Location',
        type: 'location',
        placeholder: 'Select location',
        required: true,
      },
      {
        id: 'rdhx-serial-number',
        label: 'Serial Number',
        type: 'barcode',
        placeholder: 'Scan or enter serial number',
        required: true,
      },
      {
        id: 'rdhx-comments',
        label: 'Additional Comments',
        type: 'textarea',
        placeholder: 'Add any additional comments',
      },
      {
        id: 'rdhx-files',
        label: 'Upload Files',
        type: 'file',
      },
    ],
  },
];