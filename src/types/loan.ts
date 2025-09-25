export type PhaseStatus = 'passed' | 'failed' | 'manual' | 'pending';
export type OverallStatus = 'In Progress' | 'Completed' | 'Issues Found' | 'Delayed';
export type UserRole = 'admin' | 'reviewer' | 'manager';

export interface PhaseStep {
  name: string;
  status: PhaseStatus;
  completedDate?: string;
  notes?: string;
  conditions?: {
    name: string;
    passed: boolean;
    details?: string;
  }[];
}

export interface LoanApplication {
  id: string;
  applicantName: string;
  applicantAddress: string;
  loanAmount: number;
  overallStatus: OverallStatus;
  lastUpdated: string;
  assignedReviewer?: string;
  phases: {
    eligibility: PhaseStep;
    tiering: PhaseStep;
    occupancy: PhaseStep;
    underwriting: PhaseStep;
    funding: PhaseStep;
  };
  timeline: {
    phase: string;
    status: string;
    date: string;
    user: string;
  }[];
}

export const mockLoans: LoanApplication[] = [
  {
    id: "RBI-2024-001",
    applicantName: "Rajesh Kumar",
    applicantAddress: "123 MG Road, Mumbai, Maharashtra 400001",
    loanAmount: 5000000,
    overallStatus: "In Progress",
    lastUpdated: "2024-01-15",
    assignedReviewer: "Priya Sharma",
    phases: {
      eligibility: { name: "Eligibility", status: "passed", completedDate: "2024-01-10" },
      tiering: { name: "Tiering", status: "passed", completedDate: "2024-01-12" },
      occupancy: { name: "Occupancy Verification", status: "manual", notes: "Property documents require verification" },
      underwriting: { name: "Underwriting", status: "pending" },
      funding: { name: "Funding", status: "pending" }
    },
    timeline: [
      { phase: "Application", status: "Submitted", date: "2024-01-08", user: "System" },
      { phase: "Eligibility", status: "Completed", date: "2024-01-10", user: "Auto Check" },
      { phase: "Tiering", status: "Completed", date: "2024-01-12", user: "Auto Check" }
    ]
  },
  {
    id: "RBI-2024-002",
    applicantName: "Sneha Patel",
    applicantAddress: "456 Ring Road, Ahmedabad, Gujarat 380001",
    loanAmount: 2500000,
    overallStatus: "Issues Found",
    lastUpdated: "2024-01-14",
    phases: {
      eligibility: { name: "Eligibility", status: "passed", completedDate: "2024-01-09" },
      tiering: { name: "Tiering", status: "failed", notes: "Credit score below threshold" },
      occupancy: { name: "Occupancy Verification", status: "pending" },
      underwriting: { name: "Underwriting", status: "pending" },
      funding: { name: "Funding", status: "pending" }
    },
    timeline: [
      { phase: "Application", status: "Submitted", date: "2024-01-07", user: "System" },
      { phase: "Eligibility", status: "Completed", date: "2024-01-09", user: "Auto Check" },
      { phase: "Tiering", status: "Failed", date: "2024-01-14", user: "Auto Check" }
    ]
  },
  {
    id: "RBI-2024-003",
    applicantName: "Arjun Singh",
    applicantAddress: "789 Sector 15, Gurgaon, Haryana 122001",
    loanAmount: 7500000,
    overallStatus: "Completed",
    lastUpdated: "2024-01-13",
    phases: {
      eligibility: { name: "Eligibility", status: "passed", completedDate: "2024-01-05" },
      tiering: { name: "Tiering", status: "passed", completedDate: "2024-01-07" },
      occupancy: { name: "Occupancy Verification", status: "passed", completedDate: "2024-01-10" },
      underwriting: { name: "Underwriting", status: "passed", completedDate: "2024-01-12" },
      funding: { name: "Funding", status: "passed", completedDate: "2024-01-13" }
    },
    timeline: [
      { phase: "Application", status: "Submitted", date: "2024-01-03", user: "System" },
      { phase: "Eligibility", status: "Completed", date: "2024-01-05", user: "Auto Check" },
      { phase: "Tiering", status: "Completed", date: "2024-01-07", user: "Auto Check" },
      { phase: "Occupancy", status: "Completed", date: "2024-01-10", user: "Manual Review" },
      { phase: "Underwriting", status: "Completed", date: "2024-01-12", user: "Underwriter" },
      { phase: "Funding", status: "Approved", date: "2024-01-13", user: "Manager" }
    ]
  },
  {
    id: "RBI-2024-004",
    applicantName: "Maya Iyer",
    applicantAddress: "321 Brigade Road, Bangalore, Karnataka 560001",
    loanAmount: 3200000,
    overallStatus: "Delayed",
    lastUpdated: "2024-01-11",
    assignedReviewer: "Rahul Gupta",
    phases: {
      eligibility: { name: "Eligibility", status: "passed", completedDate: "2024-01-08" },
      tiering: { name: "Tiering", status: "manual", notes: "Borderline credit score requires review" },
      occupancy: { name: "Occupancy Verification", status: "pending" },
      underwriting: { name: "Underwriting", status: "pending" },
      funding: { name: "Funding", status: "pending" }
    },
    timeline: [
      { phase: "Application", status: "Submitted", date: "2024-01-06", user: "System" },
      { phase: "Eligibility", status: "Completed", date: "2024-01-08", user: "Auto Check" }
    ]
  }
];