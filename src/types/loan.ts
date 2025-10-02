export type PhaseStatus = 'passed' | 'failed' | 'manual' | 'pending';
export type OverallStatus = 'In Progress' | 'Completed' | 'Issues Found' | 'Manual Review';
export type UserRole = 'admin' | 'reviewer' | 'manager';

export interface Signatory {
    name: string;
    ownershipPercentage: number;
    citizenship: string;
    foreignNational: boolean;
    id: string;
    creditScore?: number;
    idvVerified: boolean;
    idvDetails?: {
        provider: string;
        verificationDate: string;
        documentType: string;
        documentNumber: string;
        status: 'verified' | 'failed' | 'pending';
        confidence: number;
    };
    creditScoreRequest?: {
        requestDate: string;
        provider: string;
        status: 'completed' | 'pending' | 'failed';
    };
    einVerification?: {
        verified: boolean;
        verificationDate: string;
        matchConfidence: number;
        provider: string;
    };
}

export interface EligibilityData {
    entityName: string;
    entityNameValid: boolean;
    entityNameValidation?: {
        provider: string;
        validationDate: string;
        apiResponse: Record<string, any>;
        matchConfidence: number;
    };
    entityType?: string;
    entityTypeValid?: boolean;
    entityTypeValidation?: {
        provider: string;
        validationDate: string;
        apiResponse: Record<string, any>;
    };
    signatories: Signatory[];
    einValidated: boolean;
    ein: string;
    einVerification?: {
        provider: string;
        verificationDate: string;
        apiResponse: Record<string, any>;
        status: 'verified' | 'failed' | 'pending';
    };
    entityActive: boolean;
    entityInGoodStanding: boolean;
    validationDocuments: Array<{
        name: string;
        proof: string;
        verificationMethod: string;
    }>;
    documentIssuedDate: string;
}

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
    eligibilityData?: EligibilityData;
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
    lendingwiseId: string;
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
        lendingwiseId: "LW-2024-1001",
        applicantName: "Tech Corp Ltd",
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
                eligibilityData: {
                    entityName: "Tech Corp Ltd",
                    entityNameValid: true,
                    entityNameValidation: {
                        provider: "SOS API",
                        validationDate: "2024-01-05T09:30:00Z",
                        apiResponse: {
                            entity_name: "Tech Corp Ltd",
                            status: "ACTIVE",
                            match_score: 100,
                            registration_date: "2020-03-15"
                        },
                        matchConfidence: 100
                    },
                    entityType: "LLC",
                    entityTypeValid: true,
                    entityTypeValidation: {
                        provider: "SOS API",
                        validationDate: "2024-01-05T09:30:00Z",
                        apiResponse: {
                            entity_type: "Limited Liability Company",
                            formation_state: "Delaware",
                            verified: true
                        }
                    },
                    signatories: [
                        {
                            name: "John Smith",
                            ownershipPercentage: 65,
                            citizenship: "US",
                            foreignNational: false,
                            id: "SSN: ***-**-1234",
                            creditScore: 750,
                            idvVerified: true,
                            idvDetails: {
                                provider: "Persona",
                                verificationDate: "2024-01-05T10:15:00Z",
                                documentType: "Driver's License",
                                documentNumber: "DL-NY-****1234",
                                status: "verified",
                                confidence: 98
                            },
                            creditScoreRequest: {
                                requestDate: "2024-01-05T10:30:00Z",
                                provider: "Experian",
                                status: "completed"
                            },
                            einVerification: {
                                verified: true,
                                verificationDate: "2024-01-05T10:45:00Z",
                                matchConfidence: 100,
                                provider: "IRS EIN Verification API"
                            }
                        },
                        {
                            name: "Emily Chen",
                            ownershipPercentage: 35,
                            citizenship: "US",
                            foreignNational: false,
                            id: "SSN: ***-**-5678",
                            creditScore: 720,
                            idvVerified: true,
                            idvDetails: {
                                provider: "Persona",
                                verificationDate: "2024-01-05T10:20:00Z",
                                documentType: "Passport",
                                documentNumber: "PP-US-****5678",
                                status: "verified",
                                confidence: 95
                            },
                            creditScoreRequest: {
                                requestDate: "2024-01-05T10:35:00Z",
                                provider: "Experian",
                                status: "completed"
                            },
                            einVerification: {
                                verified: true,
                                verificationDate: "2024-01-05T10:50:00Z",
                                matchConfidence: 100,
                                provider: "IRS EIN Verification API"
                            }
                        }
                    ],
                    einValidated: true,
                    ein: "12-3456789",
                    einVerification: {
                        provider: "IRS EIN Verification API",
                        verificationDate: "2024-01-05T09:45:00Z",
                        apiResponse: {
                            ein: "12-3456789",
                            entity_name: "Tech Corp Ltd",
                            status: "ACTIVE",
                            verified: true
                        },
                        status: "verified"
                    },
                    entityActive: true,
                    entityInGoodStanding: true,
                    validationDocuments: [
                        {
                            name: "Certificate of Incorporation",
                            proof: "Document verified via Delaware SOS database, File #7234892, issued 2020-03-15",
                            verificationMethod: "SOS Database Cross-Reference"
                        },
                        {
                            name: "Good Standing Certificate",
                            proof: "Current status verified via SOS API, last checked 2024-01-05, no outstanding issues",
                            verificationMethod: "Real-time SOS API Verification"
                        },
                        {
                            name: "Operating Agreement",
                            proof: "Document authenticated via digital signature validation, signed by all members 2020-03-20",
                            verificationMethod: "Digital Signature Validation"
                        }
                    ],
                    documentIssuedDate: "2024-01-05"
                },
                keyValueData: {
                    "Entity Status": "Active & Good Standing",
                    "EIN": "12-3456789",
                    "Validation Date": "2024-01-05",
                    "Total Signatories": "2",
                    "Foreign Nationals": "0"
                },
                rawOutput: {
                    eligibility_check: {
                        entity_name_valid: true,
                        ein_validated: true,
                        entity_active: true,
                        foreign_nationals_count: 0,
                        all_credit_scores_acceptable: true,
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
        lendingwiseId: "LW-2024-1002",
        applicantName: "Real Estate Corp",
        applicantAddress: "456 Oak Avenue, Los Angeles, CA 90210",
        loanAmount: 250000,
        overallStatus: "Manual Review",
        lastUpdated: "2024-01-14",
        phases: {
            eligibility: {
                name: "Eligibility",
                status: "manual",
                completedDate: "2024-01-10",
                eligibilityData: {
                    entityName: "Real Estate Corp",
                    entityNameValid: false,
                    entityNameValidation: {
                        provider: "SOS API",
                        validationDate: "2024-01-05T09:30:00Z",
                        apiResponse: {
                            entity_name: "Real Estate Corp",
                            status: "INACTIVE",
                            match_score: 100,
                            registration_date: "2020-03-15"
                        },
                        matchConfidence: 10
                    },
                    entityType: "LLC",
                    entityTypeValid: false,
                    entityTypeValidation: {
                        provider: "SOS API",
                        validationDate: "2024-01-05T09:30:00Z",
                        apiResponse: {
                            entity_type: "Limited Liability Company",
                            formation_state: "Delaware",
                            verified: false
                        }
                    },
                    signatories: [
                        {
                            name: "John Smith",
                            ownershipPercentage: 65,
                            citizenship: "US",
                            foreignNational: false,
                            id: "SSN: ***-**-1234",
                            creditScore: 750,
                            idvVerified: false,
                            idvDetails: {
                                provider: "Persona",
                                verificationDate: "2024-01-05T10:15:00Z",
                                documentType: "Driver's License",
                                documentNumber: "DL-NY-****1234",
                                status: "failed",
                                confidence: 98
                            },
                            creditScoreRequest: {
                                requestDate: "2024-01-05T10:30:00Z",
                                provider: "Experian",
                                status: "completed"
                            },
                            einVerification: {
                                verified: false,
                                verificationDate: "2024-01-05T10:45:00Z",
                                matchConfidence: 100,
                                provider: "IRS EIN Verification API"
                            }
                        },
                        {
                            name: "Emily Chen",
                            ownershipPercentage: 35,
                            citizenship: "US",
                            foreignNational: false,
                            id: "SSN: ***-**-5678",
                            creditScore: 720,
                            idvVerified: false,
                            idvDetails: {
                                provider: "Persona",
                                verificationDate: "2024-01-05T10:20:00Z",
                                documentType: "Passport",
                                documentNumber: "PP-US-****5678",
                                status: "failed",
                                confidence: 95
                            },
                            creditScoreRequest: {
                                requestDate: "2024-01-05T10:35:00Z",
                                provider: "Experian",
                                status: "completed"
                            },
                            einVerification: {
                                verified: false,
                                verificationDate: "2024-01-05T10:50:00Z",
                                matchConfidence: 100,
                                provider: "IRS EIN Verification API"
                            }
                        }
                    ],
                    einValidated: false,
                    ein: "12-3456789",
                    einVerification: {
                        provider: "IRS EIN Verification API",
                        verificationDate: "2024-01-05T09:45:00Z",
                        apiResponse: {
                            ein: "12-3456789",
                            entity_name: "Tech Corp Ltd",
                            status: "ACTIVE",
                            verified: false
                        },
                        status: "verified"
                    },
                    entityActive: true,
                    entityInGoodStanding: true,
                    validationDocuments: [
                        {
                            name: "Certificate of Incorporation",
                            proof: "Document verified via Delaware SOS database, File #7234892, issued 2020-03-15",
                            verificationMethod: "SOS Database Cross-Reference"
                        },
                        {
                            name: "Good Standing Certificate",
                            proof: "Current status verified via SOS API, last checked 2024-01-05, no outstanding issues",
                            verificationMethod: "Real-time SOS API Verification"
                        },
                        {
                            name: "Operating Agreement",
                            proof: "Document authenticated via digital signature validation, signed by all members 2020-03-20",
                            verificationMethod: "Digital Signature Validation"
                        }
                    ],
                    documentIssuedDate: "2024-01-05"
                },
                keyValueData: {
                    "Entity Status": "Active & Good Standing",
                    "EIN": "12-3456789",
                    "Validation Date": "2024-01-05",
                    "Total Signatories": "2",
                    "Foreign Nationals": "0"
                },
                rawOutput: {
                    eligibility_check: {
                        entity_name_valid: true,
                        ein_validated: true,
                        entity_active: true,
                        foreign_nationals_count: 0,
                        all_credit_scores_acceptable: true,
                        result: "PASS"
                    }
                }
            },
            tiering: {
                name: "Tiering",
                status: "pending",
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
                status: "pending",
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
            { phase: "Application", status: "Submitted", date: "2024-01-07", user: "System" },
            { phase: "Eligibility", status: "Failed", date: "2024-01-09", user: "Auto Check" },
            { phase: "Tiering", status: "Pending", date: "2024-01-09", user: "-" }
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
        lendingwiseId: "LW-2024-1003",
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
        lendingwiseId: "LW-2024-1004",
        applicantName: "Jessica Wilson",
        applicantAddress: "321 Elm Street, Miami, FL 33101",
        loanAmount: 320000,
        overallStatus: "Manual Review",
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