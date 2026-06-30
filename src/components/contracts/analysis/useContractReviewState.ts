import { useState, useEffect } from 'react';

export type ReviewDecision = 'ACCEPT' | 'NEGOTIATE' | 'SKIP' | 'DISPUTED';
export type ViewState = 1 | 2 | 3 | 4 | 5;
export type ReviewMode = 'QUICK' | 'DETAILED' | null;

interface ContractReviewState {
  currentViewState: ViewState;
  reviewMode: ReviewMode;
  decisions: Record<string, ReviewDecision>;
}

export function useContractReviewState(contractId: string) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [state, setState] = useState<ContractReviewState>({
    currentViewState: 2, // Default to Verdict state when opened
    reviewMode: null,
    decisions: {}
  });

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(`contract_review_state_${contractId}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        setState({
          currentViewState: parsed.currentViewState || 2,
          reviewMode: parsed.reviewMode || null,
          decisions: parsed.decisions || {}
        });
      }
    } catch (e) {
      console.error("Failed to load review state", e);
    }
    setIsLoaded(true);
  }, [contractId]);

  // Save to localStorage on change
  useEffect(() => {
    if (!isLoaded || typeof window === 'undefined') return;
    try {
      localStorage.setItem(`contract_review_state_${contractId}`, JSON.stringify(state));
    } catch (e) {
      console.error("Failed to save review state", e);
    }
  }, [state, contractId, isLoaded]);

  const setViewState = (viewState: ViewState) => {
    setState(prev => ({ ...prev, currentViewState: viewState }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const setReviewMode = (mode: ReviewMode) => {
    setState(prev => ({ ...prev, reviewMode: mode }));
  };

  const setDecision = (clauseId: string, decision: ReviewDecision) => {
    setState(prev => ({
      ...prev,
      decisions: {
        ...prev.decisions,
        [clauseId]: decision
      }
    }));
  };

  const clearDecisions = () => {
    setState(prev => ({
      ...prev,
      decisions: {}
    }));
  };

  return {
    ...state,
    isLoaded,
    setViewState,
    setReviewMode,
    setDecision,
    clearDecisions
  };
}
