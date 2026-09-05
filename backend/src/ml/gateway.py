import json
import logging
from typing import Dict, Any, Optional

logger = logging.getLogger(__name__)

class ModelGateway:
    """
    Model Gateway for interpreting deterministic EO evidence using a lightweight LLM.
    Lazily loads the model to save memory/startup time.
    Falls back gracefully if torch/transformers are missing or if inference fails.
    """
    def __init__(self, model_id: str = "HuggingFaceTB/SmolLM-135M-Instruct"):
        self.model_id = model_id
        self.pipeline = None
        self.is_loaded = False
        self.load_failed = False
        
    def _load_model(self):
        if self.is_loaded or self.load_failed:
            return
            
        try:
            import torch
            from transformers import pipeline
            
            logger.info(f"Loading {self.model_id} for evidence interpretation...")
            # We use a very small model (135M parameters) that runs easily on CPU/MVP hardware
            device = "cuda" if torch.cuda.is_available() else "cpu"
            self.pipeline = pipeline(
                "text-generation", 
                model=self.model_id, 
                device=device,
                torch_dtype=torch.float32 if device == "cpu" else torch.bfloat16
            )
            self.is_loaded = True
            logger.info("Model loaded successfully.")
        except ImportError:
            logger.warning("torch or transformers not installed. Falling back to deterministic responses.")
            self.load_failed = True
        except Exception as e:
            logger.error(f"Failed to load model {self.model_id}: {str(e)}")
            self.load_failed = True

    def interpret_evidence(self, evidence: Dict[str, Any]) -> Optional[str]:
        """
        Attempts to generate a natural language explanation of the evidence.
        Returns None if generation fails or the model is unavailable.
        """
        self._load_model()
        
        if not self.is_loaded or not self.pipeline:
            return None
            
        try:
            # We filter out large arrays/paths to keep the prompt clean for the small model
            filtered_evidence = {k: v for k, v in evidence.items() if k not in ["output_raster", "visualization_asset", "scene_id"]}
            evidence_str = json.dumps(filtered_evidence, indent=2)
            
            prompt = (
                "You are a scientific assistant. "
                "Write exactly one sentence summarizing the following evidence. "
                "You MUST include the numeric statistics provided. "
                "Do not invent any new numbers.\n\n"
                f"Evidence:\n{evidence_str}\n\n"
                "Summary:"
            )
            
            messages = [
                {"role": "user", "content": prompt}
            ]
            
            outputs = self.pipeline(
                messages, 
                max_new_tokens=100, 
                temperature=0.3,
                do_sample=True,
                return_full_text=False
            )
            
            generated_text = outputs[0]["generated_text"].strip()
            return generated_text
            
        except Exception as e:
            logger.error(f"Inference failed: {str(e)}")
            return None
