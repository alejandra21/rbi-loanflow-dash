

# Plan: Simplified Engine 6 (V2) - Construction Feasibility Without BCP Data

## Overview

Create a new simplified version of Engine 6 that works without BCP-related data. The original component remains untouched.

---

## Impact of Missing Data

Without BCP Estimate, Contractor Feasibility, and BCP Timeline, three sections are fully removed and the final score formula must be recalculated:

| Section | Original | V2 (Simplified) |
|---------|----------|------------------|
| 1 - Appraisal Scope Review | Kept | Kept (unchanged) |
| 2 - AIV/ARV Value Logic | Kept | Kept (unchanged) |
| 3 - Comparable Sales Feasibility | Kept | Kept (unchanged) |
| 4 - POS Budget vs BCP Cost | BCP comparison | Show POS Budget only (no variance) |
| 5 - Contractor Feasibility (BCP) | Full display | **Removed entirely** |
| 6 - Timeline vs Appraisal | BCP vs Appraisal | **Removed entirely** |
| 7 - Permit Validation | Refinance only | Kept (unchanged) |
| 8 - Final Feasibility Score | 3-factor weighted | Simplified 2-factor formula |

### Revised Final Score (Section 8)

Without contractor and timeline scores, the formula simplifies to only use the available data:
- **ARV Support Ratio** (from Section 2)
- **ARV Comp Status** (from Section 3)

Proposed simplified formula:
- `ARV Support Score x 0.6 + Comp Feasibility Score x 0.4`
- Or display a "Partial Score" indicator noting that BCP data is pending

---

## Technical Implementation

### 1. New Type Definition

Add a `ConstructionFeasibilityV2Data` interface in `src/types/collateralReview.ts` that omits BCP fields:

```typescript
export interface ConstructionFeasibilityV2Data {
  productType: 'FNF' | 'GUC';
  scopeAssumptionReview: ScopeAssumptionReview;
  aiv: number;
  arv: number;
  rehabBudget: number;
  arvSupportRatio: number;
  arvSupportStatus: CheckStatus;
  arvSupportInterpretation: 'Strong' | 'Acceptable' | 'Weak ARV';
  arvCompsFeasibility: ARVCompsFeasibility;
  posBudget: number;
  // No bcpEstimate, no budgetVariance
  permitValidation?: PermitValidation;
  feasibilityScore: number;
  feasibilityResult: 'Feasible' | 'Review' | 'Not Feasible';
  formula: string;
  checks: EngineCheck[];
}
```

### 2. New Component

Create `src/components/collateral-review/ConstructionFeasibilityEngineV2.tsx` with 5 active sections:

- **Section 1**: Appraisal Scope Assumption Review (same design)
- **Section 2**: AIV/ARV Value Logic Check (same design)
- **Section 3**: Comparable Sales Feasibility (same design)
- **Section 4**: POS Budget (simplified - just shows the budget amount, no BCP comparison)
- **Section 7**: Permit Validation (same, Refinance only)
- **Section 8**: Final Score with circular gauge and a note indicating BCP data is not yet available

Sections 5 and 6 will not appear at all.

### 3. Mock Data

Add V2 mock data to `CollateralReviewTab.tsx` for the simplified scenario and wire up the V2 component.

---

## Files to Create/Modify

| File | Action | Changes |
|------|--------|---------|
| `src/types/collateralReview.ts` | Modify | Add `ConstructionFeasibilityV2Data` interface |
| `src/components/collateral-review/ConstructionFeasibilityEngineV2.tsx` | **Create** | New simplified component |
| `src/components/CollateralReviewTab.tsx` | Modify | Add V2 mock data and render V2 component |

The original `ConstructionFeasibilityEngine.tsx` will not be touched.

