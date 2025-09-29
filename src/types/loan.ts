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
  keyValueData?: Record<string, any>;
  rawOutput?: Record<string, any>;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  phase: string;
  details: string;
  decision?: 'approved' | 'rejected' | 'info_requested';
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
  auditLog: AuditLogEntry[];
}

export const mockLoans: LoanApplication[] = [
  {
    id: "LOA-2024-001",
    applicantName: "John Smith",
    applicantAddress: "123 Main Street, New York, NY 10001",
    loanAmount: 500000,
    overallStatus: "In Progress",
    lastUpdated: "2024-01-15",
    assignedReviewer: "Sarah Johnson",
    phases: {
      eligibility: { 
        name: "Eligibility", 
        status: "passed", 
        completedDate: "2024-01-10",
        keyValueData: {
          "Age": "32 years",
          "Income": "$120,000 annually",
          "Credit Score": "750",
          "Employment": "Software Engineer",
          "Company": "Tech Corp Ltd"
        },
        rawOutput: {
          eligibility_check: {
            age_eligible: true,
            income_sufficient: true,
            credit_score: 750,
            employment_status: "employed",
            result: "PASS"
          }
        }
      },
      tiering: { 
        name: "Tiering", 
        status: "passed", 
        completedDate: "2024-01-12",
        keyValueData: {
          "Risk Tier": "Tier 2",
          "Interest Rate": "8.5%",
          "LTV Ratio": "80%",
          "Processing Fee": "$2,500"
        },
        rawOutput: {
          tiering_result: {
            risk_score: 68,
            tier: "T2",
            interest_rate: 8.5,
            ltv_ratio: 0.8,
            result: "APPROVED"
          }
        }
      },
      occupancy: { 
        name: "Occupancy Verification", 
        status: "manual", 
        notes: "Property documents require verification",
        keyValueData: {
          "Property Type": "Residential Apartment",
          "Location": "New York, NY",
          "Built Year": "2018",
          "Sq Ft": "1,200",
          "Current Occupancy": "Self Occupied"
        },
        rawOutput: {
          occupancy_check: {
            property_verified: false,
            documents_uploaded: true,
            site_visit_required: true,
            result: "MANUAL_REVIEW"
          }
        }
      },
      underwriting: { name: "Underwriting", status: "pending" },
      funding: { name: "Funding", status: "pending" }
    },
    timeline: [
      { phase: "Application", status: "Submitted", date: "2024-01-08", user: "System" },
      { phase: "Eligibility", status: "Completed", date: "2024-01-10", user: "Auto Check" },
      { phase: "Tiering", status: "Completed", date: "2024-01-12", user: "Auto Check" }
    ],
    auditLog: [
      {
        id: "audit-001",
        timestamp: "2024-01-10T10:30:00Z",
        user: "Auto Check",
        action: "Phase Completed",
        phase: "Eligibility",
        details: "All eligibility criteria met automatically"
      },
      {
        id: "audit-002", 
        timestamp: "2024-01-12T14:45:00Z",
        user: "Auto Check",
        action: "Phase Completed",
        phase: "Tiering",
        details: "Risk assessment completed, assigned to Tier 2"
      },
      {
        id: "audit-003",
        timestamp: "2024-01-13T09:15:00Z",
        user: "Sarah Johnson",
        action: "Manual Review Assigned",
        phase: "Occupancy",
        details: "Property documents uploaded for manual verification"
      }
    ]
  },
  {
    id: "LOA-2024-002",
    applicantName: "Emily Davis",
    applicantAddress: "456 Oak Avenue, Los Angeles, CA 90210",
    loanAmount: 250000,
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
    ],
    auditLog: [
      {
        id: "audit-004",
        timestamp: "2024-01-09T11:20:00Z",
        user: "Auto Check",
        action: "Phase Completed",
        phase: "Eligibility",
        details: "Eligibility check passed successfully"
      },
      {
        id: "audit-005",
        timestamp: "2024-01-14T16:30:00Z",
        user: "Auto Check",
        action: "Phase Failed",
        phase: "Tiering",
        details: "Credit score 680 below minimum threshold of 700"
      }
    ]
  },
  {
    id: "LOA-2024-003",
    applicantName: "Michael Johnson",
    applicantAddress: "789 Pine Street, Chicago, IL 60601",
    loanAmount: 750000,
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
    ],
    auditLog: [
      {
        id: "audit-006",
        timestamp: "2024-01-05T10:15:00Z",
        user: "Auto Check",
        action: "Phase Completed",
        phase: "Eligibility",
        details: "All eligibility requirements satisfied"
      },
      {
        id: "audit-007",
        timestamp: "2024-01-13T15:45:00Z",
        user: "Manager",
        action: "Loan Approved",
        phase: "Funding",
        details: "Final approval granted for funding disbursement",
        decision: "approved"
      }
    ]
  },
  {
    id: "LOA-2024-004",
    applicantName: "Jessica Wilson",
    applicantAddress: "321 Elm Street, Miami, FL 33101",
    loanAmount: 320000,
    overallStatus: "Delayed",
    lastUpdated: "2024-01-11",
    assignedReviewer: "David Martinez",
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
    ],
    auditLog: [
      {
        id: "audit-008",
        timestamp: "2024-01-08T12:30:00Z",
        user: "Auto Check",
        action: "Phase Completed",
        phase: "Eligibility",
        details: "Eligibility check completed successfully"
      },
      {
        id: "audit-009",
        timestamp: "2024-01-09T09:00:00Z",
        user: "David Martinez",
        action: "Manual Review Assigned",
        phase: "Tiering",
        details: "Borderline credit score flagged for manual review"
      }
    ]
  }
];