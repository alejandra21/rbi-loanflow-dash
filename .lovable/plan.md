
## Adding Loan Application Document Link

### Overview
You need a persistent link to the general loan application document that's accessible from anywhere in the loan detail view, not tied to any specific phase. This makes sense since the loan application is a foundational document that underwriters may reference throughout the review process.

---

### Recommended Approaches

#### Option A: Add to Header Section (Recommended)
Add the document link as a button next to the loan type badge in the header area. This keeps it always visible and easily accessible.

**Location:** Next to the loan type badge, before the status badge
**Implementation:** Add a `FileText` icon button or link that opens/downloads the loan application document

```
┌─────────────────────────────────────────────────────────────────────────┐
│ ← Back to List                                                          │
│                                                                         │
│ LOA-2024-001                                      [Status Badge]        │
│ Tech Corp Ltd - $500,000  [DSCR]  [📄 Loan Application]                │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Option B: Add to Actions Card
Add a "View Loan Application" button in the Actions card alongside the existing workflow buttons. This groups all actions together.

```
┌─────────────────────────────────────────────────────────────────────────┐
│ ⚙️ Actions                                                              │
│ ──────────────────────────────────────────────────────────────────────  │
│ [▶ Re-execute Workflow]                                                 │
│ [▶ Re-execute Current Phase]                                            │
│ [📄 View Loan Application]  ← NEW                                       │
│ ──────────────────────────────────────────────────────────────────────  │
│ [Workflow Execution]                                                    │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Option C: Add a Documents Quick Access Card
Create a new small card in the timeline row dedicated to important documents, which could hold the loan application link and potentially other general documents.

```
┌───────────────────┬───────────────────┬─────────────────────┐
│ Processing        │ Actions           │ Documents           │
│ Timeline          │                   │                     │
│                   │ [Re-execute...]   │ [📄 Loan App]       │
│ [Stepper...]      │ [Re-execute...]   │ [📄 Other Doc]      │
│                   │ [Workflow Exec]   │                     │
└───────────────────┴───────────────────┴─────────────────────┘
```

---

### My Recommendation: Option A (Header Section)

I recommend **Option A** because:
1. The loan application is a primary reference document
2. It stays visible regardless of which phase tab is selected
3. It doesn't clutter the Actions card with document links
4. Keeps the current layout grid intact (2 columns for timeline + 1 column for actions)

---

### Technical Implementation

#### 1. Update LoanApplication Type
Add a `loanApplicationDocumentUrl` field to the `LoanApplication` interface in `src/types/loan.ts`:

```typescript
export interface LoanApplication {
  // ... existing fields
  loanApplicationDocumentUrl?: string;  // NEW: URL to general loan application doc
}
```

#### 2. Update Mock Data
Add mock document URLs to the sample loans.

#### 3. Modify Header in LoanDetail.tsx
Add a document button/link in the header section (around line 1536-1540):

```tsx
<p className="text-muted-foreground">
  {loan.phases.borrowerEligibility.eligibilityData?.entityName || loan.applicantName} -{" "}
  {formatCurrency(loan.loanAmount)}
  <Badge variant="outline" className="ml-3">
    {loan.loanType}
  </Badge>
  {/* NEW: Loan Application Document Link */}
  {loan.loanApplicationDocumentUrl && (
    <Button 
      variant="ghost" 
      size="sm" 
      className="ml-3 h-6 px-2 text-xs"
      onClick={() => window.open(loan.loanApplicationDocumentUrl, '_blank')}
    >
      <FileText className="h-3 w-3 mr-1" />
      Loan Application
    </Button>
  )}
</p>
```

#### 4. Visual Styling Options
- **Button style:** Ghost button with FileText icon
- **Link style:** Underlined text link
- **Badge style:** Clickable badge similar to the loan type badge

---

### Files to Modify

| File | Changes |
|------|---------|
| `src/types/loan.ts` | Add `loanApplicationDocumentUrl` field to `LoanApplication` interface |
| `src/types/loan.ts` | Add mock URLs to sample loan data |
| `src/components/LoanDetail.tsx` | Add document link button in header section |

---

### Alternative: Quick Access Dropdown
If you anticipate having multiple general documents (not just the loan application), we could implement a dropdown menu in the header:

```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="sm" className="ml-3">
      <FileText className="h-4 w-4 mr-1" />
      Documents
      <ChevronDown className="h-3 w-3 ml-1" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem onClick={() => window.open(loan.loanApplicationUrl)}>
      Loan Application
    </DropdownMenuItem>
    <DropdownMenuItem onClick={() => window.open(loan.otherDocUrl)}>
      Other Document
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

This approach would be more scalable if you need to add more general documents in the future.
