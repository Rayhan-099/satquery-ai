import re
from typing import Any, Dict

class EvidenceValidator:
    """
    Lightweight deterministic validator that ensures the LLM does not hallucinate numbers
    or unsupported factual claims not present in the evidence.
    """
    
    def validate_claims(self, text: str, evidence: Dict[str, Any]) -> bool:
        """
        Returns True if the text is safely grounded in the evidence, False otherwise.
        """
        # 1. Extract all numbers from the generated text
        # Matches integers or floats, e.g., 0.51, 65536, 94.2
        numbers_in_text = re.findall(r'\b\d+(?:\.\d+)?\b', text)
        
        # 2. Extract all numeric values from the evidence package
        evidence_numbers = set()
        self._extract_numbers(evidence, evidence_numbers)
        
        # Convert evidence numbers to strings rounded to 4 decimals for fuzzy string matching
        evidence_strings = set()
        for num in evidence_numbers:
            evidence_strings.add(str(num))
            if isinstance(num, float):
                evidence_strings.add(f"{num:.4f}")
                evidence_strings.add(f"{num:.3f}")
                evidence_strings.add(f"{num:.2f}")
                evidence_strings.add(f"{num:.1f}")
                # Also allow integers for percentage matching if it's rounded
                evidence_strings.add(str(int(num)))
                evidence_strings.add(str(int(round(num))))
                
        # 3. Validation rule: every number in text must exist in the evidence
        if evidence_numbers and not numbers_in_text:
            # The model failed to use any evidence (generic/useless response).
            return False
            
        for num_str in numbers_in_text:
            if num_str not in evidence_strings:
                # Hallucinated numeric claim detected
                return False
                
        return True
        
    def _extract_numbers(self, data: Any, collected: set):
        if isinstance(data, dict):
            for value in data.values():
                self._extract_numbers(value, collected)
        elif isinstance(data, list):
            for item in data:
                self._extract_numbers(item, collected)
        elif isinstance(data, (int, float)):
            if not isinstance(data, bool):  # booleans are ints in python
                collected.add(data)
