# Specific Fixes Based on Peer Review Feedback

This document details the specific improvements made to address the detailed feedback provided.

## 1. Algorithm Complexity Issues

### Problem:
- Made-up Big-O notation (O(n), O(n²)) without proper analysis
- Random walk complexity claims without justification
- Complexity discussed alongside performance metrics as if they're the same thing

### Fix:
- **Scientist Agent**: Now instructed to either properly analyze complexity OR use qualitative descriptions ("inefficient", "scales poorly", "computationally expensive")
- **Guideline**: "If uncertain about complexity, skip it entirely - better to omit than guess incorrectly"
- **Reviewer Agent**: Flags any made-up Big-O notation
- **Editor Agent**: Converts incorrect complexity claims to qualitative descriptions

### Example:
- ❌ Before: "The algorithm has O(n²) complexity"
- ✅ After: "The algorithm scales poorly with input size" or proper analysis if available

## 2. Remove "Interchangeable Metrics" Language

### Problem:
- Language suggesting precision, recall, accuracy, and F1-score are interchangeable
- Confusion about when to use which metric

### Fix:
- **Scientist Agent**: Explicitly told "NEVER say metrics are 'interchangeable'"
- **Experiment Guidelines**: Now includes explanation of when each metric matters:
  - Precision: Important when false positives are costly
  - Recall: Important when missing cases is critical
  - F1-score: Balances both
  - Accuracy: Overall correctness
- **Reviewer Agent**: Flags any language suggesting metrics are interchangeable
- **Editor Agent**: Removes such language

### Example:
- ❌ Before: "These metrics are often used interchangeably"
- ✅ After: "Precision is critical when false positives are costly, while recall matters when missing cases is unacceptable"

## 3. Tighten References

### Problem:
- Placeholder text: "[Insert relevant references here]"
- Inconsistent citation numbering
- Incomplete references

### Fix:
- **Scientist Agent**: Explicitly told to never include:
  - "[Insert relevant references here]"
  - "continue with remaining references"
  - "... (continue with the remaining references)"
  - Any other placeholder text
- **Reference Generation**: Only uses real sources from web research
- **Reviewer Agent**: Checks for all placeholder types
- **Editor Agent**: Removes any remaining placeholders

### Example:
- ❌ Before: "[Insert relevant references here]"
- ✅ After: Complete citations or "[Information not available]" for missing parts

## 4. Strip Meta-Feedback Sentences

### Problem:
- Sentences that read like editing logs:
  - "This revision addresses peer review feedback by..."
  - "This section responds to reviewer concerns..."
  - "Based on feedback, we have..."

### Fix:
- **Scientist Agent**: Explicitly told "NEVER include meta-feedback sentences"
- **Revision Process**: Instructed to "write as if this is the original paper, not a revision log"
- **Reviewer Agent**: Flags all meta-feedback language
- **Editor Agent**: Removes meta-feedback sentences
- **FactChecker Agent**: New category "META_FEEDBACK" to catch these

### Example:
- ❌ Before: "This revision addresses peer review feedback by clarifying the methodology"
- ✅ After: "The methodology employs a three-stage approach..."

## 5. Precision vs Recall Context

### Problem:
- Metrics defined but not explained when each matters
- No context for choosing between metrics

### Fix:
- **Experiment Guidelines**: Now includes when each metric matters:
  - Precision: When false positives are costly (e.g., medical diagnosis)
  - Recall: When missing cases is critical (e.g., security screening)
- **Scientist Agent**: Instructed to explain context when discussing metrics

### Example:
- ✅ Added: "Precision is particularly important in medical diagnosis where false positives can cause unnecessary anxiety, while recall is critical in security screening where missing threats could be catastrophic."

## Implementation Details

### All Agents Updated:
1. **ScientistAgent**: 
   - Enhanced system prompts with all new rules
   - Section-specific guidelines updated
   - Reference generation tightened

2. **ReviewerAgent**:
   - New checks for complexity, interchangeable metrics, meta-feedback
   - Enhanced reference validation

3. **FactCheckerAgent**:
   - New "META_FEEDBACK" category
   - Enhanced technical error detection

4. **EditorAgent**:
   - Removes meta-feedback sentences
   - Fixes complexity issues
   - Removes placeholder text
   - Removes interchangeable metrics language

### Validation Flow:
1. Initial draft → Fact-checker validates
2. Review → Reviewer flags all issues
3. Revision → Scientist fixes with new guidelines
4. Fact-check again → Catches remaining issues
5. Final edit → Editor removes any remaining problems

## Expected Results

After these fixes, papers should:
- ✅ Have no made-up complexity claims (or proper analysis)
- ✅ Never suggest metrics are interchangeable
- ✅ Have complete references with no placeholders
- ✅ Read as original work, not revision logs
- ✅ Explain when precision vs recall matters
- ✅ Use qualitative complexity descriptions when uncertain

## Testing

To verify these fixes work:

```bash
cd apps/cortex
source venv/bin/activate
python3 main_improved.py --topic "test topic"
```

Check the output for:
- No "[Insert relevant references here]"
- No "This revision addresses..." sentences
- No "metrics are interchangeable" language
- No made-up Big-O notation (or proper analysis)
- Clear explanations of when precision vs recall matters




