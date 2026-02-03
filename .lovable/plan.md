
# Plan: Implement Engine 6 - Construction Feasibility (FNF/GUC)

## Overview

Engine 6 validates that the As-Is Value (AIV) and ARV stated in the appraisal are realistically achievable given the borrower's budget, contractor feasibility, and timeline. This engine only applies to Fix & Flip (FNF) and Ground-Up Construction (GUC) loan products.

---

## What Needs to Be Built

Based on the PDF documentation, Engine 6 has 8 sections that need to be displayed:

| Section | Name | Purpose |
|---------|------|---------|
| 1 | Appraisal Scope Assumption Review | Validate budget covers appraiser-assumed repairs |
| 2 | AIV/ARV Value Logic Check | Calculate ARV Support Ratio |
| 3 | Comparable Sales Feasibility | Verify ARV comps adjustment thresholds |
| 4 | POS Budget vs BCP Cost Validation | Compare borrower budget to BCP estimate |
| 5 | Contractor Feasibility (BCP) | Show BCP recommendation and max supported |
| 6 | Timeline vs Appraisal Assumptions | Compare BCP timeline to appraisal assumptions |
| 7 | Permit & Jurisdiction Validation | Verify permits match (Refinance only) |
| 8 | Final Feasibility Score | Product-specific weighted score |

---

## Technical Implementation

### 1. Update Type Definitions (`src/types/collateralReview.ts`)

Expand the `ConstructionFeasibilityData` interface to include all 8 sections:

```typescript
export interface ConstructionFeasibilityData {
  productType: 'FNF' | 'GUC';
  
  // Section 1: Appraisal Scope Assumption Review
  scopeAssumptionReview: {
    appraiserAssumedItems: string[];
    posBudgetItems: string[];
    scopeMatchStatus: 'full_match' | 'partial_match' | 'mismatch';
    scopeResult: 'Continue' | 'REVIEW' | 'FAIL';
  };
  
  // Section 2: AIV/ARV Value Logic Check
  aiv: number;
  arv: number;
  rehabBudget: number;
  arvSupportRatio: number;
  arvSupportStatus: CheckStatus;
  arvSupportInterpretation: 'Strong' | 'Acceptable' | 'Weak ARV';
  
  // Section 3: Comparable Sales Feasibility (ARV Comps)
  arvCompsFeasibility: {
    netAdjustmentAvg: number;
    netAdjustmentThreshold: number;
    grossAdjustmentAvg: number;
    grossAdjustmentThreshold: number;
    compConditionSupportsARV: boolean;
    compSaleDatesWithin6Months: boolean;
    arvCompStatus: CheckStatus;
  };
  
  // Section 4: POS Budget to BCP Cost Validation
  posBudget: number;
  bcpEstimate: number;
  budgetVariance: number;
  budgetVarianceStatus: CheckStatus;
  budgetVarianceResult: 'Pass' | 'Review' | 'Fail';
  
  // Section 5: Contractor Feasibility (BCP)
  contractorScore: number;
  contractorStatus: 'Recommended' | 'Recommended w/ Max' | 'Not Recommended';
  bcpMaxSupported?: number;
  tradeCoverage?: string;
  experienceScore?: number;
  
  // Section 6: Timeline vs Appraisal Assumptions
  bcpTimelineMonths: number;
  appraisalTimelineMonths: number;
  timelineScore: number;
  timelineResult: 'Pass' | 'Review' | 'High Risk';
  
  // Section 7: Permit & Jurisdiction Validation (Refinance only)
  permitValidation?: {
    permitActive: boolean;
    permitAddressMatch: boolean;
    permitContractorMatch: boolean;
    permitScopeMatch: boolean;
    permitStatus: CheckStatus;
  };
  
  // Section 8: Final Feasibility Score
  feasibilityScore: number;
  feasibilityResult: 'Feasible' | 'Review' | 'Not Feasible';
  formula: string;
  
  checks: EngineCheck[];
}
```

### 2. Add Mock Data for FNF Loan

Add a complete `constructionFeasibility` object to the mock data demonstrating a Fix & Flip scenario:

```typescript
constructionFeasibility: {
  productType: 'FNF',
  
  scopeAssumptionReview: {
    appraiserAssumedItems: ['Full kitchen renovation', 'Bathroom updates', 'Roof replacement', 'HVAC system'],
    posBudgetItems: ['Kitchen renovation', 'Bathroom updates', 'Roof replacement', 'HVAC replacement', 'Flooring'],
    scopeMatchStatus: 'full_match',
    scopeResult: 'Continue'
  },
  
  aiv: 300000,
  arv: 420000,
  rehabBudget: 100000,
  arvSupportRatio: 95,  // (300+100)/420 = 95%
  arvSupportStatus: 'flag',
  arvSupportInterpretation: 'Weak ARV',
  
  arvCompsFeasibility: {
    netAdjustmentAvg: 12,
    netAdjustmentThreshold: 15,
    grossAdjustmentAvg: 22,
    grossAdjustmentThreshold: 25,
    compConditionSupportsARV: true,
    compSaleDatesWithin6Months: true,
    arvCompStatus: 'pass'
  },
  
  posBudget: 120000,
  bcpEstimate: 135000,
  budgetVariance: 12.5,
  budgetVarianceStatus: 'flag',
  budgetVarianceResult: 'Review',
  
  contractorScore: 85,
  contractorStatus: 'Recommended w/ Max',
  bcpMaxSupported: 180000,
  tradeCoverage: 'Full',
  experienceScore: 90,
  
  bcpTimelineMonths: 8,
  appraisalTimelineMonths: 6,
  timelineScore: 80,
  timelineResult: 'Pass',
  
  feasibilityScore: 78,
  feasibilityResult: 'Review',
  formula: 'FNF: (100 - 12.5×100)×0.5 + 85×0.3 + 80×0.2 = 78',
  
  checks: [...]
}
```

### 3. Update Engine 6 UI Component

Replace the current basic Engine 6 implementation with a comprehensive display:

**Section Layout:**
```text
+----------------------------------------------------------+
| Engine 6: Construction Feasibility          [Score: 78]  |
+----------------------------------------------------------+
| Product Type: [FNF Badge]  |  Feasibility: [Review Badge]|
+----------------------------------------------------------+

Section 1: Appraisal Scope Assumption Review
+---------------------------+---------------------------+
| Appraiser Assumed Scope   | POS Budget Scope          |
| - Full kitchen renovation | - Kitchen renovation      |
| - Bathroom updates        | - Bathroom updates        |
| - Roof replacement        | - Roof replacement        |
| - HVAC system            | - HVAC replacement        |
|                          | - Flooring                |
+---------------------------+---------------------------+
| Scope Match: [Full Match] → [Continue]                  |
+----------------------------------------------------------+

Section 2: AIV/ARV Value Logic Check
+------------+------------+------------+------------------+
| AIV        | Rehab      | ARV        | ARV Support Ratio|
| $300,000   | $100,000   | $420,000   | 95% [Weak ARV]   |
+------------+------------+------------+------------------+
| Formula: (AIV + Rehab) ÷ ARV = (300,000+100,000)÷420,000|
| Thresholds: ≤85% Strong | 86-92% Acceptable | >92% Weak|
+----------------------------------------------------------+

Section 3: Comparable Sales Feasibility
+--------------------+----------+-----------+
| Check              | Value    | Threshold |
| Net Adjustments    | 12%      | ≤15%      |
| Gross Adjustments  | 22%      | ≤25%      |
| Comp Condition ARV | Required | ✓         |
| Comp Sale Dates    | ≤6 mo    | ✓         |
+--------------------+----------+-----------+

Section 4: POS Budget → BCP Cost Validation
+----------------+----------------+------------------+
| POS Budget     | BCP Estimate   | Budget Variance  |
| $120,000       | $135,000       | 12.5% [Review]   |
+----------------+----------------+------------------+
| Thresholds: ≤10% Pass | 11-15% Review | >15% Fail  |
+----------------------------------------------------------+

Section 5: Contractor Feasibility (BCP)
+--------------------+--------------------+
| BCP Result         | [Recommended w/Max]|
| Max Supported      | $180,000           |
| Trade Coverage     | Full               |
| Experience Score   | 90                 |
+--------------------+--------------------+

Section 6: Timeline Comparison
+----------------+----------------+------------------+
| BCP Timeline   | Appraisal Est  | Timeline Score   |
| 8 months       | 6 months       | 80 [Pass]        |
+----------------+----------------+------------------+
| Formula: 100 - (|8-6| × 10) = 80                   |
+----------------------------------------------------------+

Section 8: Final Feasibility Score
+----------------------------------------------------------+
|  [Circular Gauge: 78]  FNF Feasibility                   |
|  Formula: (100 - BudgetVar×100)×0.5 + Contractor×0.3     |
|           + Timeline×0.2 = 78                            |
|  ≥80 Feasible | 65-79 Review | <65 Not Feasible         |
+----------------------------------------------------------+

[Engine Checks Table]
```

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/types/collateralReview.ts` | Expand `ConstructionFeasibilityData` interface with all 8 sections |
| `src/components/CollateralReviewTab.tsx` | Add mock data for Engine 6, replace basic UI with comprehensive 8-section display |

---

## Visual Design Approach

1. **Sub-section headers** with separators for each of the 8 sections
2. **Comparison cards** showing appraiser scope vs. POS budget scope
3. **Formula displays** in code blocks showing calculations
4. **Threshold indicator bars** for ARV Support Ratio, Budget Variance, Timeline Score
5. **Circular gauge** for final feasibility score (similar to Phase 11 Risk Score)
6. **Color-coded badges** for Pass/Review/Fail statuses
7. **Conditional Section 7** (Permit Validation) only shown for Refinance transactions

---

## Mock Data Strategy

Since the current loan (LOA-2024-001) is a DSCR product, Engine 6 won't display. The implementation will:
1. Add a second mock data variant for FNF/GUC products
2. Or switch the current mock to FNF to demonstrate Engine 6
3. Display a "Not Applicable" message for non-FNF/GUC products

---

## Implementation Notes

- Engine 6 is conditionally rendered only when `data.productType === 'FNF' || data.productType === 'GUC'`
- The final feasibility formula differs between FNF and GUC:
  - **FNF**: `(100 - BudgetVariance×100)×0.5 + ContractorScore×0.3 + TimelineScore×0.2`
  - **GUC**: `(100 - BudgetVariance×100)×0.4 + ContractorScore×0.35 + TimelineScore×0.25`
- Section 7 (Permit Validation) only applies to Refinance transactions
