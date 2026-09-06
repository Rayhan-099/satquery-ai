from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..planner.models import QueryRequest, QueryResponse
from ..planner.rule_based import RuleBasedPlanner
from ..planner.executor import PlanExecutor
from ..planner.response_generator import ResponseGenerator
import os

router = APIRouter(prefix="/query", tags=["query"])

UPLOAD_DIR = "uploads"
planner = RuleBasedPlanner()
executor = PlanExecutor()
responder = ResponseGenerator()

@router.post("", response_model=QueryResponse)
async def process_query(request: QueryRequest, db: Session = Depends(get_db)):
    try:
        # 1. Natural-language intent -> AnalysisPlan
        plan = planner.generate_plan(request.scene_id, request.query)
        
        # 2. Execute deterministic tool
        evidence = executor.execute(plan, db, UPLOAD_DIR)
        
        # 3. Grounded Response Generation
        interpretation = responder.generate(plan, evidence)
        
        return QueryResponse(
            query=request.query,
            status="completed",
            plan=plan,
            evidence=evidence,
            interpretation=interpretation,
            limitations=[]
        )
        
    except ValueError as e:
        err_msg = str(e)
        if err_msg.startswith("UNSUPPORTED_ANALYSIS") or err_msg.startswith("UNRECOGNIZED_INTENT"):
            return QueryResponse(
                query=request.query,
                status="unsupported",
                limitations=[err_msg]
            )
        if err_msg.startswith("CLARIFICATION_REQUIRED"):
            return QueryResponse(
                query=request.query,
                status="clarification_required",
                limitations=[err_msg]
            )
        if err_msg.startswith("SCENE_NOT_FOUND"):
            raise HTTPException(status_code=404, detail=err_msg)
            
        raise HTTPException(status_code=400, detail=err_msg)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Query orchestration failed: {str(e)}")
