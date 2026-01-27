export type PhaseStatus = 'passed' | 'failed' | 'manual' | 'pending';
export type OverallStatus = 'In Progress' | 'Completed' | 'Issues Found' | 'Manual Review';
export type UserRole = 'admin' | 'reviewer' | 'manager';

export interface Signatory {
    name: string;
    ownershipPercentage: number;
    citizenship: string;
    foreignNational: boolean;
    id: string;
    ssn: string;
    dob: string;
    ofacFlag: boolean;
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
    ssnVerification?: {
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
    experienceTieringData?: any;
    nonOwnerOccupancyData?: any;
    dscrCashFlowData?: any;
    closingProtectionData?: any;
    auditLog?: AuditLogEntry[];
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

export type LoanType = 'Bridge' | 'DSCR' | 'Construction' | 'Fix and Flip';

export interface LoanApplication {
    id: string;
    lendingwiseId: string;
    applicantName: string;
    applicantAddress: string;
    loanAmount: number;
    loanType: LoanType;
    overallStatus: OverallStatus;
    lastUpdated: string;
    assignedReviewer?: string;
    loanApplicationDocumentUrl?: string;
    phases: {
        borrowerEligibility: PhaseStep;
        experienceTiering: PhaseStep;
        creditReview: PhaseStep;
        nonOwnerOccupancy: PhaseStep;
        collateralReview: PhaseStep;
        dscrCashFlow: PhaseStep;
        titleInsurance: PhaseStep;
        closingProtection: PhaseStep;
        insurancePolicy: PhaseStep;
        assetVerification: PhaseStep;
        finalApproval: PhaseStep;
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
        loanType: "DSCR",
        overallStatus: "In Progress",
        lastUpdated: "2024-01-15",
        assignedReviewer: "Sarah Johnson",
        loanApplicationDocumentUrl: "https://example.com/documents/LOA-2024-001-application.pdf",
        phases: {
            borrowerEligibility: {
                name: "Borrower Eligibility",
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
                            ssn: "***-**-1234",
                            dob: "1985-03-15",
                            ofacFlag: false,
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
                            ssnVerification: {
                                verified: true,
                                verificationDate: "2024-01-05T10:45:00Z",
                                matchConfidence: 100,
                                provider: "SSA Verification API"
                            }
                        },
                        {
                            name: "Emily Chen",
                            ownershipPercentage: 35,
                            citizenship: "US",
                            foreignNational: false,
                            id: "SSN: ***-**-5678",
                            ssn: "***-**-5678",
                            dob: "1990-07-22",
                            ofacFlag: false,
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
                            ssnVerification: {
                                verified: true,
                                verificationDate: "2024-01-05T10:50:00Z",
                                matchConfidence: 100,
                                provider: "SSA Verification API"
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
            experienceTiering: {
                name: "Experience Tiering",
                status: "passed",
                completedDate: "2024-01-12",
                experienceTieringData: {
                    loan_id: "LOA-2024-001",
                    stage_code: 'experienceTiering',
                    status: 'pass',
                    assigned_tier: 'Gold',
                    confidence_score: 0.78,
                    exposure_limit_usd: 5000000,
                    recommended_ltc_cap: 85,
                    recommended_arv_cap: 70,
                    exception_flag: false,
                    metrics: {
                        verified_exits_count: 8,
                        verified_volume_usd: 3200000,
                        lookback_months: 36,
                        borrower_experience_score: 75.5,
                        guarantor_record_score: 82.0,
                        liquidity_ratio: 68.0,
                        performance_record_score: 88.5
                    },
                    checks: [
                        { name: 'entity_match', ok: true, detail: 'Matched entity "Tech Corp Ltd" with 95% confidence via entity search' },
                        { name: 'ownership_verification', ok: true, detail: 'Borrower confirmed as key member through OpenCorporates verification' },
                        { name: 'exit_verification', ok: true, detail: 'Verified 8 exits totaling $3,200,000 in last 36 months' },
                        { name: 'evaluation_logic', ok: true, detail: 'Pass: DSCR evaluation completed' }
                    ],
                    discrepancies: [],
                    manual_validation: { required: false },
                    ran_at: "2024-01-12T14:45:00Z",
                    ran_by: "Auto Check",
                    source: 'PrequalDat',
                    entity_match: {
                        entityName: "Tech Corp Ltd",
                        confidence: 95,
                        method: 'entity_search'
                    },
                    ownership_verified: true,
                    evaluation_outcome: 'Pass'
                },
                auditLog: [
                    {
                        id: "et-audit-001",
                        timestamp: "2024-01-12T14:30:00Z",
                        user: "System",
                        action: "Workflow Initiated",
                        phase: "Experience Tiering",
                        details: "Experience Tiering workflow started for LOA-2024-001"
                    },
                    {
                        id: "et-audit-002",
                        timestamp: "2024-01-12T14:35:00Z",
                        user: "PrequalDat API",
                        action: "Entity Match Completed",
                        phase: "Experience Tiering",
                        details: "Entity 'Tech Corp Ltd' matched with 95% confidence"
                    },
                    {
                        id: "et-audit-003",
                        timestamp: "2024-01-12T14:40:00Z",
                        user: "PrequalDat API",
                        action: "Exit Verification Completed",
                        phase: "Experience Tiering",
                        details: "Verified 8 exits totaling $3.2M in last 36 months"
                    },
                    {
                        id: "et-audit-004",
                        timestamp: "2024-01-12T14:45:00Z",
                        user: "Auto Check",
                        action: "Tier Assigned",
                        phase: "Experience Tiering",
                        details: "Gold tier assigned based on verified metrics",
                        decision: "approved"
                    }
                ]
            },
            creditReview: {
                name: "Credit Review",
                status: "passed",
                completedDate: "2024-01-13",
                keyValueData: {
                    "Credit Score": "750",
                    "Credit Status": "Approved"
                }
            },
            nonOwnerOccupancy: {
                name: "Non-Owner Occupancy Verification",
                status: "passed",
                nonOwnerOccupancyData: {
                    loan_id: "LOA-2024-001",
                    stage_code: 'nonOwnerOccupancy' as const,
                    status: 'pass' as const,
                    transaction_type: 'Refinance' as const,
                    
                    property_address: "456 Investment Ave, Miami, FL 33101",
                    property_address_normalized: "456 INVESTMENT AVE MIAMI FL 33101",
                    
                    borrower_addresses: [
                        {
                            original: "123 Main Street, New York, NY 10001",
                            normalized: "123 MAIN ST NEW YORK NY 10001",
                            source: 'borrower' as const,
                            sourceDetail: "Application POS",
                            matchScore: 15
                        },
                        {
                            original: "789 Business Blvd, Brooklyn, NY 11201",
                            normalized: "789 BUSINESS BLVD BROOKLYN NY 11201",
                            source: 'borrower' as const,
                            sourceDetail: "Bank Statement",
                            matchScore: 12
                        }
                    ],
                    guarantor_addresses: [
                        {
                            original: "321 Park Ave, Manhattan, NY 10022",
                            normalized: "321 PARK AVE MANHATTAN NY 10022",
                            source: 'guarantor' as const,
                            sourceDetail: "John Smith - Gov ID",
                            matchScore: 8
                        }
                    ],
                    tlo_addresses: [
                        {
                            original: "123 Main St, New York, NY 10001",
                            normalized: "123 MAIN ST NEW YORK NY 10001",
                            source: 'tlo' as const,
                            sourceDetail: "TLO Background Check",
                            matchScore: 15
                        }
                    ],
                    credit_report_addresses: [
                        {
                            original: "789 Business Boulevard, Brooklyn NY 11201",
                            normalized: "789 BUSINESS BLVD BROOKLYN NY 11201",
                            source: 'credit_report' as const,
                            sourceDetail: "Xactus Credit Report",
                            matchScore: 12
                        }
                    ],
                    bank_statement_addresses: [
                        {
                            original: "789 Business Blvd, Brooklyn, NY 11201",
                            normalized: "789 BUSINESS BLVD BROOKLYN NY 11201",
                            source: 'bank_statement' as const,
                            sourceDetail: "Chase Bank Statement",
                            matchScore: 12
                        }
                    ],
                    gov_id_addresses: [
                        {
                            original: "321 Park Avenue, Manhattan, NY 10022",
                            normalized: "321 PARK AVE MANHATTAN NY 10022",
                            source: 'gov_id' as const,
                            sourceDetail: "Driver's License - John Smith",
                            matchScore: 8
                        }
                    ],
                    
                    address_matches: [],
                    has_any_match: false,
                    
                    title_owner_check: {
                        titleOwner: "Tech Corp Ltd",
                        titleOwnerAddress: "456 Investment Ave, Miami, FL 33101",
                        borrowerEntity: "Tech Corp Ltd",
                        guarantors: ["John Smith", "Emily Chen"],
                        isMatch: true,
                        reason: "Title owner matches borrower entity"
                    },
                    
                    homestead_check: {
                        hasHomestead: false,
                        reason: "No homestead exemption found for property"
                    },
                    
                    requires_manual_review: false,
                    manual_review_reasons: [],
                    
                    override_applied: false,
                    
                    logs: [
                        {
                            id: "log-1",
                            timestamp: "2024-01-12T14:30:00Z",
                            tag: "INIT",
                            description: "Phase 4 initiated for refinance transaction",
                            action: "PHASE_START",
                            user: "AI Underwriting System",
                            status: "Success",
                            jsonData: {
                                transactionType: "Refinance",
                                loanId: "LOA-2024-001"
                            }
                        },
                        {
                            id: "log-2",
                            timestamp: "2024-01-12T14:30:15Z",
                            tag: "ADDRESS_NORMALIZATION",
                            description: "Property and borrower addresses normalized",
                            action: "NORMALIZE_ADDRESSES",
                            user: "AI Underwriting System",
                            status: "Success",
                            jsonData: {
                                propertyAddressNormalized: "456 INVESTMENT AVE MIAMI FL 33101",
                                totalAddressesProcessed: 8
                            }
                        },
                        {
                            id: "log-3",
                            timestamp: "2024-01-12T14:30:30Z",
                            tag: "ADDRESS_COMPARISON",
                            description: "Address match comparison completed",
                            action: "COMPARE_ADDRESSES",
                            user: "AI Underwriting System",
                            status: "Success",
                            jsonData: {
                                totalComparisons: 8,
                                matchesFound: 0,
                                highestMatchScore: 15
                            }
                        },
                        {
                            id: "log-4",
                            timestamp: "2024-01-12T14:30:45Z",
                            tag: "TITLE_CHECK",
                            description: "Title owner verification completed",
                            action: "VERIFY_TITLE_OWNER",
                            user: "AI Underwriting System",
                            status: "Success",
                            jsonData: {
                                titleOwner: "Tech Corp Ltd",
                                borrowerEntity: "Tech Corp Ltd",
                                isMatch: true
                            }
                        },
                        {
                            id: "log-5",
                            timestamp: "2024-01-12T14:31:00Z",
                            tag: "HOMESTEAD_CHECK",
                            description: "Homestead exemption check completed",
                            action: "CHECK_HOMESTEAD",
                            user: "AI Underwriting System",
                            status: "Success",
                            jsonData: {
                                hasHomesteadExemption: false,
                                taxRecordOwner: "Tech Corp Ltd"
                            }
                        },
                        {
                            id: "log-6",
                            timestamp: "2024-01-12T14:31:15Z",
                            tag: "PHASE_COMPLETE",
                            description: "Phase 4 completed - No owner occupancy detected",
                            action: "PHASE_END",
                            user: "AI Underwriting System",
                            status: "Pass",
                            jsonData: {
                                finalStatus: "pass",
                                requiresManualReview: false,
                                executionTimeMs: 75000
                            }
                        }
                    ],
                    
                    ran_at: "2024-01-12T14:30:00Z",
                    ran_by: "AI Underwriting System",
                    source: "AWS + TLO + Xactus"
                }
            },
            collateralReview: { name: "Collateral Review", status: "pending" },
            dscrCashFlow: {
                name: "DSCR-Specific Cash Flow Review",
                status: "passed",
                completedDate: "2024-01-14",
                dscrCashFlowData: {
                    appraisalInput: {
                        occupancy: 'Occupied' as const,
                        actualLeaseRent: 2800,
                        marketRent: 3000,
                        appraisedValue: 485000,
                        appraisalDate: "2024-01-05",
                        pdfSource: "s3://rbi-loan-docs/appraisals/LOA-2024-001_appraisal.pdf",
                        borrowerCreditScorePOS: 720,
                        borrowerCreditScoreBureau: 718,
                        loanAmount: 388000,
                        interestRate: 7.25,
                        term: 30,
                        termsFileSource: "s3://rbi-loan-docs/terms/LOA-2024-001_loan_terms.pdf",
                        asIsValue: 500000,
                        posLTV: 80,
                        posLTC: 75,
                        appraisalLTV: 80,
                        appraisalLTC: 74
                    },
                    rentDecision: {
                        selectedRent: 2800,
                        decisionRule: "For occupied properties, selected the lesser of actual lease rent ($2,800) and market rent ($3,000)",
                        ruleApplied: 'occupied_lesser' as const
                    },
                    dscrCalculation: {
                        selectedRent: 2800,
                        posDebtService: 2100,
                        calculatedDSCR: 1.33
                    },
                    comparisonMetrics: [
                        {
                            metric: "DSCR",
                            posValue: "1.35",
                            aiValue: "1.33",
                            difference: "-0.02",
                            tolerance: "+0.05",
                            flag: 'none' as const,
                            flagDetails: "Within tolerance. Difference of -0.02 is less than +0.05 threshold."
                        },
                        {
                            metric: "Credit Score",
                            posValue: "720",
                            aiValue: "718",
                            difference: "-2",
                            tolerance: "+20 points",
                            flag: 'none' as const,
                            flagDetails: "Within tolerance. Difference of -2 points is less than +20 threshold."
                        },
                        {
                            metric: "Appraised Value",
                            posValue: "$500,000",
                            aiValue: "$485,000",
                            difference: "-$15,000 (-3%)",
                            tolerance: "+5%",
                            flag: 'none' as const,
                            flagDetails: "Within tolerance. Difference of 3% is less than +5% threshold."
                        },
                        {
                            metric: "LTV",
                            posValue: "80%",
                            aiValue: "80%",
                            difference: "0%",
                            tolerance: "0%",
                            flag: 'none' as const,
                            flagDetails: "No difference detected. Values match exactly."
                        },
                        {
                            metric: "LTC",
                            posValue: "75%",
                            aiValue: "74%",
                            difference: "-1%",
                            tolerance: "0%",
                            flag: 'major' as const,
                            flagDetails: "Mismatch detected. Any difference in LTV/LTC requires manual review."
                        }
                    ],
                    tierChange: {
                        posTier: "Gold",
                        aiCalculatedTier: "Gold",
                        tierChanged: false
                    },
                    aiDecision: {
                        outcome: 'pass' as const,
                        action: 'proceed_phase_7' as const,
                        reason: "All metrics within tolerance. DSCR of 1.33 exceeds minimum threshold of 1.25. No deviations detected. Proceeding to Phase 7."
                    },
                    downstreamNotification: {
                        posUpdated: true,
                        downstreamServicesNotified: true,
                        lastUpdateTimestamp: "2024-01-14T16:45:00Z"
                    },
                    toleranceRules: [
                        {
                            metric: "DSCR",
                            threshold: "+0.05",
                            deviationType: 'minor' as const,
                            action: "Auto-reprice in POS"
                        },
                        {
                            metric: "Credit Score",
                            threshold: "+20 points",
                            deviationType: 'minor' as const,
                            action: "Auto-reprice in POS"
                        },
                        {
                            metric: "Appraised Value",
                            threshold: "+5%",
                            deviationType: 'minor' as const,
                            action: "Auto-reprice in POS"
                        },
                        {
                            metric: "LTV",
                            threshold: "Any tier change",
                            deviationType: 'major' as const,
                            action: "Manual Underwriter Review"
                        },
                        {
                            metric: "LTC",
                            threshold: "Any tier change",
                            deviationType: 'major' as const,
                            action: "Manual Underwriter Review"
                        }
                    ],
                    logs: [
                        {
                            id: "dscr-log-1",
                            timestamp: "2024-01-14T16:30:00Z",
                            user: "AI Underwriting System",
                            action: "Appraisal PDF Extraction",
                            tag: "EXTRACTION",
                            status: "completed" as const,
                            details: "Successfully extracted occupancy, lease rent, market rent, and appraised value from appraisal PDF",
                            jsonData: {
                                occupancy: "Occupied",
                                actualLeaseRent: 2800,
                                marketRent: 3000,
                                appraisedValue: 485000
                            }
                        },
                        {
                            id: "dscr-log-2",
                            timestamp: "2024-01-14T16:32:00Z",
                            user: "AI Underwriting System",
                            action: "Rent Selection Logic Applied",
                            tag: "RENT_DECISION",
                            status: "completed" as const,
                            details: "Applied occupied property rule: selected lesser of actual lease rent and market rent",
                            jsonData: {
                                ruleApplied: "occupied_lesser",
                                actualLeaseRent: 2800,
                                marketRent: 3000,
                                selectedRent: 2800
                            }
                        },
                        {
                            id: "dscr-log-3",
                            timestamp: "2024-01-14T16:35:00Z",
                            user: "AI Underwriting System",
                            action: "POS Debt Service Retrieved",
                            tag: "POS_INTEGRATION",
                            status: "completed" as const,
                            details: "Retrieved debt service amount from POS system",
                            jsonData: {
                                posDebtService: 2100,
                                source: "POS API"
                            }
                        },
                        {
                            id: "dscr-log-4",
                            timestamp: "2024-01-14T16:37:00Z",
                            user: "AI Underwriting System",
                            action: "DSCR Calculated",
                            tag: "CALCULATION",
                            status: "completed" as const,
                            details: "Calculated DSCR using selected rent and POS debt service",
                            jsonData: {
                                selectedRent: 2800,
                                posDebtService: 2100,
                                calculatedDSCR: 1.33,
                                formula: "DSCR = Selected Rent / POS Debt Service"
                            }
                        },
                        {
                            id: "dscr-log-5",
                            timestamp: "2024-01-14T16:40:00Z",
                            user: "AI Underwriting System",
                            action: "POS Comparison Completed",
                            tag: "COMPARISON",
                            status: "completed" as const,
                            details: "Compared AI-calculated values against POS values and applied tolerance rules",
                            jsonData: {
                                dscrComparison: { pos: 1.35, ai: 1.33, difference: -0.02, flag: "none" },
                                creditScoreComparison: { pos: 720, ai: 718, difference: -2, flag: "none" },
                                appraisedValueComparison: { pos: 500000, ai: 485000, difference: -15000, flag: "none" }
                            }
                        },
                        {
                            id: "dscr-log-6",
                            timestamp: "2024-01-14T16:42:00Z",
                            user: "AI Underwriting System",
                            action: "Tier Change Check",
                            tag: "TIER_VALIDATION",
                            status: "completed" as const,
                            details: "Verified leverage tier unchanged from POS",
                            jsonData: {
                                posTier: "Gold",
                                aiCalculatedTier: "Gold",
                                tierChanged: false
                            }
                        },
                        {
                            id: "dscr-log-7",
                            timestamp: "2024-01-14T16:45:00Z",
                            user: "AI Underwriting System",
                            action: "Final Decision: PASS",
                            tag: "DECISION",
                            status: "completed" as const,
                            details: "All values within tolerance. DSCR exceeds minimum. Proceeding to Phase 7.",
                            jsonData: {
                                outcome: "pass",
                                action: "proceed_phase_7",
                                dscr: 1.33,
                                minimumDSCR: 1.25,
                                deviationsDetected: 0
                            }
                        }
                    ]
                }
            },
            titleInsurance: { name: "Title Insurance Verification", status: "manual" },
            closingProtection: { 
                name: "Closing Protection Letter", 
                status: "manual",
                closingProtectionData: {
                    cplDocument: {
                        lenderName: "RBI Private Lending, LLC ISAOA/ATIMA",
                        propertyAddress: "456 Investment Ave, Miami, FL 33101",
                        loanAmount: 500000,
                        agentName: "Florida Title Services LLC",
                        underwriter: "First American Title",
                        effectiveDate: "2024-01-20",
                        cplType: "ALTA",
                        lossPayee: "RBI Private Lending, LLC ISAOA/ATIMA",
                        purpose: "Purchase",
                        borrowerName: "Tech Corp Ltd",
                        ocrStatus: "readable",
                        sourceFile: "/documents/cpl-LOA-2024-001.pdf",
                        buyerName: "Tech Corp Ltd",
                        sellerName: "Miami Properties LLC"
                    },
                    titleCommitment: {
                        propertyAddress: "456 Investment Ave, Miami, FL 33101",
                        loanAmount: 485000,
                        underwriter: "First American Title",
                        agentName: "Florida Title Services LLC",
                        vestedOwner: "Tech Corp Ltd",
                        borrowerName: "Tech Corp Ltd"
                    },
                    posData: {
                        propertyAddress: "456 Investment Avenue, Miami, FL 33101",
                        scheduledClosingDate: "2024-02-15",
                        loanPurpose: "Purchase",
                        borrowerName: "Tech Corp Ltd",
                        propertyState: "FL",
                        loanAmount: 500000,
                        buyerName: "Tech Corp Ltd",
                        sellerName: "Miami Properties LLC"
                    },
                    uspsAddress: {
                        standardizedAddress: "456 INVESTMENT AVE, MIAMI FL 33101",
                        matchScore: 98
                    },
                    appraisalAddress: "456 Investment Ave, Miami, FL 33101",
                    validationChecks: [
                        {
                            stepNumber: "8.1",
                            name: "Load CPL Document",
                            status: "pass",
                            logicCriteria: "OCR must return readable lender name, property address, loan amount",
                            posValue: "N/A",
                            cplValue: "Document readable",
                            systemBehavior: "stop_workflow"
                        },
                        {
                            stepNumber: "8.2",
                            name: "Verify Lender Name",
                            status: "pass",
                            logicCriteria: "Must equal 'RBI Private Lending, LLC ISAOA/ATIMA'",
                            posValue: "RBI Private Lending, LLC ISAOA/ATIMA",
                            cplValue: "RBI Private Lending, LLC ISAOA/ATIMA",
                            systemBehavior: "manual_review"
                        },
                        {
                            stepNumber: "8.3",
                            name: "Property Address Match",
                            status: "pass",
                            logicCriteria: "CPL address must match ALL: Appraisal, USPS normalized, Title Commitment",
                            posValue: "456 Investment Ave, Miami, FL 33101",
                            cplValue: "456 Investment Ave, Miami, FL 33101",
                            systemBehavior: "manual_review"
                        },
                        {
                            stepNumber: "8.4",
                            name: "CPL Loan Amount Validation",
                            status: "pass",
                            logicCriteria: "CPL loan amount must be ≥ Title Commitment loan amount",
                            posValue: "$485,000 (Title)",
                            cplValue: "$500,000",
                            systemBehavior: "auto_pass",
                            details: "CPL amount ($500,000) ≥ Title Commitment ($485,000)"
                        },
                        {
                            stepNumber: "8.6",
                            name: "Effective Date Validation",
                            status: "pass",
                            logicCriteria: "CPL Effective Date must be ≤ scheduled closing date (60 days or less)",
                            posValue: "2024-02-15 (Closing)",
                            cplValue: "2024-01-20",
                            systemBehavior: "manual_review"
                        },
                        {
                            stepNumber: "8.8",
                            name: "State-Specific CPL Form",
                            status: "pass",
                            logicCriteria: "Texas: T-50 form; All other states: ALTA",
                            posValue: "FL (requires ALTA)",
                            cplValue: "ALTA",
                            systemBehavior: "manual_review"
                        },
                        {
                            stepNumber: "8.9",
                            name: "Loss Payee Validation",
                            status: "pass",
                            logicCriteria: "Must include 'RBI Private Lending, LLC ISAOA/ATIMA'",
                            posValue: "RBI Private Lending, LLC ISAOA/ATIMA",
                            cplValue: "RBI Private Lending, LLC ISAOA/ATIMA",
                            systemBehavior: "manual_review"
                        },
                        {
                            stepNumber: "8.10",
                            name: "CPL → Title Commitment Crossmatch",
                            status: "pass",
                            logicCriteria: "Underwriter, agent, property address, loan amount must align",
                            posValue: "First American / FL Title Services",
                            cplValue: "First American / FL Title Services",
                            systemBehavior: "manual_review"
                        },
                        {
                            stepNumber: "8.11B",
                            name: "Verify CPL Purpose = Purchase",
                            status: "pass",
                            logicCriteria: "CPL must specify 'Purchase' or Purchase-related language",
                            posValue: "Purchase",
                            cplValue: "Purchase",
                            systemBehavior: "manual_review"
                        },
                        {
                            stepNumber: "8.11C",
                            name: "Cross-Document Validation",
                            status: "pass",
                            logicCriteria: "CPL → Title → Property Address, underwriter",
                            posValue: "All documents aligned",
                            cplValue: "All documents aligned",
                            systemBehavior: "manual_review"
                        }
                    ],
                    overallStatus: "warn",
                    processedAt: "2024-01-15T10:30:00Z",
                    processedBy: "AI Validation Engine"
                }
            },
            insurancePolicy: { name: "Insurance Policy Review", status: "passed", completedDate: "2024-01-15" },
            assetVerification: { name: "Asset Verification", status: "passed", completedDate: "2024-01-16" },
            finalApproval: { name: "Final Approval", status: "passed", completedDate: "2024-01-16" }
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
        loanType: "Bridge",
        overallStatus: "Manual Review",
        lastUpdated: "2024-01-14",
        phases: {
            borrowerEligibility: {
                name: "Borrower Eligibility",
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
                            ssn: "***-**-1234",
                            dob: "1985-03-15",
                            ofacFlag: false,
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
                            ssnVerification: {
                                verified: false,
                                verificationDate: "2024-01-05T10:45:00Z",
                                matchConfidence: 100,
                                provider: "SSA Verification API"
                            }
                        },
                        {
                            name: "Emily Chen",
                            ownershipPercentage: 35,
                            citizenship: "Canada",
                            foreignNational: true,
                            id: "SSN: ***-**-5678",
                            ssn: "***-**-5678",
                            dob: "1990-07-22",
                            ofacFlag: true,
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
                            ssnVerification: {
                                verified: false,
                                verificationDate: "2024-01-05T10:50:00Z",
                                matchConfidence: 100,
                                provider: "SSA Verification API"
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
                }
            },
            experienceTiering: { name: "Experience Tiering", status: "pending" },
            creditReview: { name: "Credit Review", status: "pending" },
            nonOwnerOccupancy: { name: "Non-Owner Occupancy Verification", status: "pending" },
            collateralReview: { name: "Collateral Review", status: "pending" },
            dscrCashFlow: { name: "DSCR-Specific Cash Flow Review", status: "pending" },
            titleInsurance: { name: "Title Insurance Verification", status: "pending" },
            closingProtection: { name: "Closing Protection Letter", status: "pending" },
            insurancePolicy: { name: "Insurance Policy Review", status: "pending" },
            assetVerification: { name: "Asset Verification", status: "pending" },
            finalApproval: { name: "Final Approval", status: "pending" }
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
        applicantName: "Johnson LLC",
        applicantAddress: "789 Pine Street, Chicago, IL 60601",
        loanAmount: 750000,
        loanType: "Construction",
        overallStatus: "Completed",
        lastUpdated: "2024-01-13",
        phases: {
            borrowerEligibility: { name: "Borrower Eligibility", status: "passed", completedDate: "2024-01-05" },
            experienceTiering: { name: "Experience Tiering", status: "passed", completedDate: "2024-01-06" },
            creditReview: { name: "Credit Review", status: "passed", completedDate: "2024-01-07" },
            nonOwnerOccupancy: { name: "Non-Owner Occupancy Verification", status: "passed", completedDate: "2024-01-08" },
            collateralReview: { name: "Collateral Review", status: "passed", completedDate: "2024-01-09" },
            dscrCashFlow: { name: "DSCR-Specific Cash Flow Review", status: "passed", completedDate: "2024-01-10" },
            titleInsurance: { name: "Title Insurance Verification", status: "passed", completedDate: "2024-01-11" },
            closingProtection: { name: "Closing Protection Letter", status: "passed", completedDate: "2024-01-12" },
            insurancePolicy: { name: "Insurance Policy Review", status: "passed", completedDate: "2024-01-12" },
            assetVerification: { name: "Asset Verification", status: "passed", completedDate: "2024-01-13" },
            finalApproval: { name: "Final Approval", status: "passed", completedDate: "2024-01-13" }
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
        applicantName: "Wilson LLC",
        applicantAddress: "321 Elm Street, Miami, FL 33101",
        loanAmount: 320000,
        loanType: "Fix and Flip",
        overallStatus: "Issues Found",
        lastUpdated: "2024-01-11",
        assignedReviewer: "David Martinez",
        phases: {
            borrowerEligibility: {
                name: "Borrower Eligibility",
                status: "failed",
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
                            ssn: "***-**-1234",
                            dob: "1985-03-15",
                            ofacFlag: false,
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
                            ssnVerification: {
                                verified: false,
                                verificationDate: "2024-01-05T10:45:00Z",
                                matchConfidence: 100,
                                provider: "SSA Verification API"
                            }
                        },
                        {
                            name: "Emily Chen",
                            ownershipPercentage: 35,
                            citizenship: "US",
                            foreignNational: false,
                            id: "SSN: ***-**-5678",
                            ssn: "***-**-5678",
                            dob: "1990-07-22",
                            ofacFlag: false,
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
                            ssnVerification: {
                                verified: false,
                                verificationDate: "2024-01-05T10:50:00Z",
                                matchConfidence: 100,
                                provider: "SSA Verification API"
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
                }
            },
            experienceTiering: { name: "Experience Tiering", status: "pending" },
            creditReview: { name: "Credit Review", status: "pending" },
            nonOwnerOccupancy: { name: "Non-Owner Occupancy Verification", status: "pending" },
            collateralReview: { name: "Collateral Review", status: "pending" },
            dscrCashFlow: { name: "DSCR-Specific Cash Flow Review", status: "pending" },
            titleInsurance: { name: "Title Insurance Verification", status: "pending" },
            closingProtection: { name: "Closing Protection Letter", status: "pending" },
            insurancePolicy: { name: "Insurance Policy Review", status: "pending" },
            assetVerification: { name: "Asset Verification", status: "pending" },
            finalApproval: { name: "Final Approval", status: "pending" }
        },
        timeline: [
            { phase: "Application", status: "Submitted", date: "2024-01-06", user: "System" },
            { phase: "Eligibility", status: "Error", date: "2024-01-08", user: "Auto Check" }
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