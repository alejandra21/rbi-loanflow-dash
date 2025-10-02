export type PhaseStatus = 'passed' | 'failed' | 'manual' | 'pending';
export type OverallStatus = 'In Progress' | 'Completed' | 'Issues Found' | 'Manual Review' | 'Delayed';

export interface IDVDetails {
  status: string;
  provider: string;
  confidence: number;
  verificationDate: string;
  documentType: string;
  documentNumber: string;
}

export interface EINVerification {
  verified: boolean;
  provider: string;
  verificationDate: string;
  matchConfidence?: number;
}

export interface CreditScoreRequest {
  provider: string;
  status: string;
  requestDate: string;
}

export interface Signatory {
  name: string;
  title: string;
  email: string;
  status: PhaseStatus;
  ownershipPercentage?: number;
  citizenship?: string;
  creditScore?: number;
  idvDetails?: IDVDetails;
  einVerification?: EINVerification;
  creditScoreRequest?: CreditScoreRequest;
}

export interface EligibilityData {
  entityName: string;
  entityType: string;
  entityNameValid: boolean;
  entityTypeValid: boolean;
  ein: string;
  signatories: Signatory[];
  validationDocuments: Array<string | { name: string; proof: string; verificationMethod: string }>;
  documentIssuedDate: string;
  entityNameValidation?: {
    provider: string;
    validationDate: string;
    matchConfidence: number;
    apiResponse: any;
  };
  einVerification?: {
    status: string;
    provider: string;
    verificationDate: string;
  };
}

export interface Phase {
  status: PhaseStatus;
  completedAt?: string;
  completedDate?: string;
  notes?: string;
  data?: Record<string, any>;
  eligibilityData?: EligibilityData;
  rawOutput?: any;
  keyValueData?: Record<string, any>;
  conditions?: Array<{
    name: string;
    passed: boolean;
    details?: string;
  }>;
}

export interface TimelineEvent {
  phase: string;
  status: string;
  date: string;
  user?: string;
}

export interface LoanApplication {
  id: string;
  lendingwiseId: string;
  applicantName: string;
  applicantAddress: string;
  loanAmount: number;
  overallStatus: OverallStatus;
  lastUpdated: string;
  phases: {
    eligibility: Phase;
    tiering: Phase;
    occupancy: Phase;
    underwriting: Phase;
    funding: Phase;
  };
  timeline: TimelineEvent[];
  signatories?: Signatory[];
  assignedReviewer?: string;
  priority?: 'High' | 'Medium' | 'Low';
}

export const mockLoans: LoanApplication[] = [
  {
    id: 'LN-2024-001',
    lendingwiseId: 'LW-45678-2024',
    applicantName: 'Acme Corporation',
    applicantAddress: '123 Business Park, Austin, TX 78701',
    loanAmount: 500000,
    overallStatus: 'Manual Review',
    lastUpdated: '2024-03-15',
    timeline: [
      { phase: 'Application Received', status: 'completed', date: '2024-03-08', user: 'System' },
      { phase: 'Eligibility Check', status: 'completed', date: '2024-03-10', user: 'System' },
      { phase: 'Credit Tiering', status: 'completed', date: '2024-03-12', user: 'System' },
      { phase: 'Occupancy Verification', status: 'manual', date: '2024-03-15', user: 'Sarah Johnson' },
      { phase: 'Underwriting Review', status: 'pending', date: '-' },
      { phase: 'Funding', status: 'pending', date: '-' }
    ],
    phases: {
      eligibility: {
        status: 'passed',
        completedAt: '2024-03-10',
        completedDate: '2024-03-10',
        eligibilityData: {
          entityName: 'Acme Corporation',
          entityType: 'LLC',
          entityNameValid: true,
          entityTypeValid: true,
          ein: '12-3456789',
          documentIssuedDate: '2024-03-08',
          signatories: [
            {
              name: 'John Smith',
              title: 'CEO',
              email: 'john@acme.com',
              status: 'passed',
              ownershipPercentage: 60,
              citizenship: 'US Citizen',
              creditScore: 750,
              idvDetails: {
                status: 'verified',
                provider: 'Socure',
                confidence: 98,
                verificationDate: '2024-03-09T10:30:00Z',
                documentType: 'Driver License',
                documentNumber: 'TX-123456789'
              },
              einVerification: {
                verified: true,
                provider: 'IRS Verification Service',
                verificationDate: '2024-03-09T11:00:00Z',
                matchConfidence: 100
              },
              creditScoreRequest: {
                provider: 'Experian',
                status: 'completed',
                requestDate: '2024-03-09T09:00:00Z'
              }
            },
            {
              name: 'Jane Doe',
              title: 'CFO',
              email: 'jane@acme.com',
              status: 'passed',
              ownershipPercentage: 40,
              citizenship: 'US Citizen',
              creditScore: 780,
              idvDetails: {
                status: 'verified',
                provider: 'Socure',
                confidence: 96,
                verificationDate: '2024-03-09T10:45:00Z',
                documentType: 'Passport',
                documentNumber: 'US-987654321'
              },
              einVerification: {
                verified: true,
                provider: 'IRS Verification Service',
                verificationDate: '2024-03-09T11:15:00Z',
                matchConfidence: 100
              },
              creditScoreRequest: {
                provider: 'Experian',
                status: 'completed',
                requestDate: '2024-03-09T09:15:00Z'
              }
            }
          ],
          validationDocuments: [
            {
              name: 'Articles of Organization',
              proof: 'Document verified through state registry',
              verificationMethod: 'State Business Registry API'
            },
            {
              name: 'EIN Confirmation Letter',
              proof: 'IRS verification successful',
              verificationMethod: 'IRS e-Services'
            }
          ],
          entityNameValidation: {
            provider: 'State Business Registry',
            validationDate: '2024-03-09T08:00:00Z',
            matchConfidence: 100,
            apiResponse: {
              entity_found: true,
              exact_match: true,
              status: 'active'
            }
          },
          einVerification: {
            status: 'verified',
            provider: 'IRS Verification Service',
            verificationDate: '2024-03-09T11:30:00Z'
          }
        },
        rawOutput: {
          workflow_id: 'wf_eligibility_001',
          execution_time: '2.3s',
          api_calls: 5,
          result: 'passed'
        }
      },
      tiering: {
        status: 'passed',
        completedAt: '2024-03-12',
        completedDate: '2024-03-12',
        keyValueData: {
          'Credit Tier': 'Tier A',
          'Interest Rate': '5.25%',
          'Approval Status': 'Approved'
        },
        conditions: [
          { name: 'Credit Score > 700', passed: true, details: 'Average: 765' },
          { name: 'Debt-to-Income < 43%', passed: true, details: 'Calculated: 38%' },
          { name: 'No Recent Delinquencies', passed: true }
        ],
        rawOutput: {
          tier: 'A',
          rate: 5.25,
          approved: true
        }
      },
      occupancy: {
        status: 'manual',
        notes: 'Requires manual review of occupancy documentation',
        keyValueData: {
          'Property Type': 'Commercial',
          'Occupancy Rate': '85%',
          'Verification Status': 'Pending Review'
        }
      },
      underwriting: { status: 'pending' },
      funding: { status: 'pending' }
    },
    signatories: [
      {
        name: 'John Smith',
        title: 'CEO',
        email: 'john@acme.com',
        status: 'passed',
        ownershipPercentage: 60,
        citizenship: 'US Citizen',
        creditScore: 750
      },
      {
        name: 'Jane Doe',
        title: 'CFO',
        email: 'jane@acme.com',
        status: 'passed',
        ownershipPercentage: 40,
        citizenship: 'US Citizen',
        creditScore: 780
      }
    ],
    assignedReviewer: 'Sarah Johnson',
    priority: 'High'
  },
  {
    id: 'LN-2024-002',
    lendingwiseId: 'LW-45679-2024',
    applicantName: 'Tech Innovations LLC',
    applicantAddress: '456 Innovation Drive, San Francisco, CA 94102',
    loanAmount: 750000,
    overallStatus: 'Issues Found',
    lastUpdated: '2024-03-14',
    timeline: [
      { phase: 'Application Received', status: 'completed', date: '2024-03-06', user: 'System' },
      { phase: 'Eligibility Check', status: 'completed', date: '2024-03-08', user: 'System' },
      { phase: 'Credit Tiering', status: 'failed', date: '2024-03-10', user: 'System' },
      { phase: 'Occupancy Verification', status: 'pending', date: '-' },
      { phase: 'Underwriting Review', status: 'pending', date: '-' },
      { phase: 'Funding', status: 'pending', date: '-' }
    ],
    phases: {
      eligibility: {
        status: 'passed',
        completedAt: '2024-03-08',
        completedDate: '2024-03-08'
      },
      tiering: {
        status: 'failed',
        notes: 'Credit score below threshold',
        completedAt: '2024-03-10',
        completedDate: '2024-03-10',
        keyValueData: {
          'Credit Tier': 'Below Threshold',
          'Interest Rate': 'N/A',
          'Approval Status': 'Rejected'
        },
        conditions: [
          { name: 'Credit Score > 700', passed: false, details: 'Average: 650' },
          { name: 'Debt-to-Income < 43%', passed: true, details: 'Calculated: 40%' }
        ]
      },
      occupancy: { status: 'pending' },
      underwriting: { status: 'pending' },
      funding: { status: 'pending' }
    },
    signatories: [
      {
        name: 'Mike Wilson',
        title: 'Founder',
        email: 'mike@techinno.com',
        status: 'passed',
        creditScore: 650
      }
    ],
    priority: 'Medium'
  },
  {
    id: 'LN-2024-003',
    lendingwiseId: 'LW-45680-2024',
    applicantName: 'Green Energy Solutions',
    applicantAddress: '789 Eco Street, Portland, OR 97201',
    loanAmount: 1000000,
    overallStatus: 'Manual Review',
    lastUpdated: '2024-03-16',
    timeline: [
      { phase: 'Application Received', status: 'completed', date: '2024-03-09', user: 'System' },
      { phase: 'Eligibility Check', status: 'completed', date: '2024-03-11', user: 'System' },
      { phase: 'Credit Tiering', status: 'completed', date: '2024-03-13', user: 'System' },
      { phase: 'Occupancy Verification', status: 'completed', date: '2024-03-14', user: 'System' },
      { phase: 'Underwriting Review', status: 'manual', date: '2024-03-16', user: 'Michael Chen' },
      { phase: 'Funding', status: 'pending', date: '-' }
    ],
    phases: {
      eligibility: {
        status: 'passed',
        completedAt: '2024-03-11',
        completedDate: '2024-03-11'
      },
      tiering: {
        status: 'passed',
        completedAt: '2024-03-13',
        completedDate: '2024-03-13',
        keyValueData: {
          'Credit Tier': 'Tier B',
          'Interest Rate': '6.25%',
          'Approval Status': 'Approved'
        }
      },
      occupancy: {
        status: 'passed',
        completedAt: '2024-03-14',
        completedDate: '2024-03-14'
      },
      underwriting: {
        status: 'manual',
        notes: 'Complex financial structure requires review'
      },
      funding: { status: 'pending' }
    },
    signatories: [
      {
        name: 'Emily Chen',
        title: 'President',
        email: 'emily@greenenergy.com',
        status: 'passed',
        creditScore: 720
      },
      {
        name: 'David Park',
        title: 'COO',
        email: 'david@greenenergy.com',
        status: 'manual',
        creditScore: 710
      }
    ],
    assignedReviewer: 'Michael Chen',
    priority: 'High'
  },
  {
    id: 'LN-2024-004',
    lendingwiseId: 'LW-45681-2024',
    applicantName: 'Retail Plus Inc',
    applicantAddress: '321 Commerce Blvd, Chicago, IL 60601',
    loanAmount: 350000,
    overallStatus: 'Completed',
    lastUpdated: '2024-03-13',
    timeline: [
      { phase: 'Application Received', status: 'completed', date: '2024-03-03', user: 'System' },
      { phase: 'Eligibility Check', status: 'completed', date: '2024-03-05', user: 'System' },
      { phase: 'Credit Tiering', status: 'completed', date: '2024-03-07', user: 'System' },
      { phase: 'Occupancy Verification', status: 'completed', date: '2024-03-09', user: 'System' },
      { phase: 'Underwriting Review', status: 'completed', date: '2024-03-11', user: 'Alex Martinez' },
      { phase: 'Funding', status: 'completed', date: '2024-03-13', user: 'System' }
    ],
    phases: {
      eligibility: {
        status: 'passed',
        completedAt: '2024-03-05',
        completedDate: '2024-03-05'
      },
      tiering: {
        status: 'passed',
        completedAt: '2024-03-07',
        completedDate: '2024-03-07'
      },
      occupancy: {
        status: 'passed',
        completedAt: '2024-03-09',
        completedDate: '2024-03-09'
      },
      underwriting: {
        status: 'passed',
        completedAt: '2024-03-11',
        completedDate: '2024-03-11'
      },
      funding: {
        status: 'passed',
        completedAt: '2024-03-13',
        completedDate: '2024-03-13'
      }
    },
    signatories: [
      {
        name: 'Robert Taylor',
        title: 'Owner',
        email: 'robert@retailplus.com',
        status: 'passed',
        creditScore: 800
      }
    ],
    priority: 'Low'
  },
  {
    id: 'LN-2024-005',
    lendingwiseId: 'LW-45682-2024',
    applicantName: 'Construction Pro LLC',
    applicantAddress: '555 Builder Lane, Denver, CO 80202',
    loanAmount: 900000,
    overallStatus: 'In Progress',
    lastUpdated: '2024-03-15',
    timeline: [
      { phase: 'Application Received', status: 'completed', date: '2024-03-07', user: 'System' },
      { phase: 'Eligibility Check', status: 'completed', date: '2024-03-09', user: 'System' },
      { phase: 'Credit Tiering', status: 'manual', date: '2024-03-15', user: 'Alex Martinez' },
      { phase: 'Occupancy Verification', status: 'pending', date: '-' },
      { phase: 'Underwriting Review', status: 'pending', date: '-' },
      { phase: 'Funding', status: 'pending', date: '-' }
    ],
    phases: {
      eligibility: {
        status: 'passed',
        completedAt: '2024-03-09',
        completedDate: '2024-03-09'
      },
      tiering: {
        status: 'manual',
        notes: 'Industry risk assessment needed'
      },
      occupancy: { status: 'pending' },
      underwriting: { status: 'pending' },
      funding: { status: 'pending' }
    },
    signatories: [
      {
        name: 'James Anderson',
        title: 'Managing Partner',
        email: 'james@constructionpro.com',
        status: 'passed',
        creditScore: 730
      },
      {
        name: 'Lisa Brown',
        title: 'Financial Director',
        email: 'lisa@constructionpro.com',
        status: 'passed',
        creditScore: 745
      }
    ],
    assignedReviewer: 'Alex Martinez',
    priority: 'Medium'
  }
];
