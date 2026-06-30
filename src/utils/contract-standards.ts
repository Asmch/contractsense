export interface MissingProtection {
  clauseType: string;
  title: string;
  importanceLevel: number; // 1-5
  importanceText: string;
  isNormalMissing: string;
  whyItMatters: string;
  whatCouldHappen: string;
  whatYouCanAskFor: string;
  learnWhy: string;
}

export type ContractType = "EMPLOYMENT" | "FREELANCE" | "NDA" | "GENERIC";

// The Playbooks
const PLAYBOOKS: Record<ContractType, MissingProtection[]> = {
  EMPLOYMENT: [
    {
      clauseType: "Termination",
      title: "Clear Termination Rules",
      importanceLevel: 5,
      importanceText: "Critical",
      isNormalMissing: "Highly unusual. Every employment agreement must have this.",
      whyItMatters: "This agreement doesn't clearly explain how or when you can be fired, or how you can resign.",
      whatCouldHappen: "You could be let go without notice, or forced to pay a penalty for leaving the company.",
      whatYouCanAskFor: "Ask for a clear 'Notice Period' (e.g., 30 days) and exact conditions for termination.",
      learnWhy: "Termination rules protect both parties. They guarantee you have time to find a new job, and give the employer time to find a replacement."
    },
    {
      clauseType: "Compensation",
      title: "Salary and Payment Details",
      importanceLevel: 5,
      importanceText: "Critical",
      isNormalMissing: "Very unusual. Compensation must be explicitly defined.",
      whyItMatters: "There is no clear commitment on exactly how much or when you will be paid.",
      whatCouldHappen: "Your salary could be delayed, changed, or tied to unexpected conditions.",
      whatYouCanAskFor: "Ask them to specify your exact salary, payment frequency, and any bonuses.",
      learnWhy: "Verbal promises aren't legally binding. Having your exact compensation written down prevents 'misunderstandings' later."
    }
  ],
  FREELANCE: [
    {
      clauseType: "Payment Terms",
      title: "Payment Timeline",
      importanceLevel: 5,
      importanceText: "Critical",
      isNormalMissing: "Highly unusual. All freelance contracts need this.",
      whyItMatters: "The agreement does not state exactly when invoices must be paid.",
      whatCouldHappen: "The client could delay payment for months, severely impacting your cash flow.",
      whatYouCanAskFor: "Request a specific timeline, like 'Net-30' (payment within 30 days of invoice) or upfront deposits.",
      learnWhy: "Freelancers often face late payments. A clear deadline forces the client to pay on time or face late fees."
    },
    {
      clauseType: "Intellectual Property",
      title: "Who Owns the Work",
      importanceLevel: 4,
      importanceText: "High",
      isNormalMissing: "Unusual. It's standard to define who owns the final deliverables.",
      whyItMatters: "It's unclear who owns the copyright to the work you are creating.",
      whatCouldHappen: "The client could claim ownership of your underlying tools, or you might not be allowed to use the work in your portfolio.",
      whatYouCanAskFor: "Clarify that you own the work until fully paid, and ask for permission to use it in your portfolio.",
      learnWhy: "By default, whoever creates the work owns the copyright unless a contract says otherwise."
    },
    {
      clauseType: "Confidentiality",
      title: "Confidential Information",
      importanceLevel: 3,
      importanceText: "Medium",
      isNormalMissing: "Usually expected if you are working with sensitive client data.",
      whyItMatters: "This agreement doesn't say that your information must remain private.",
      whatCouldHappen: "Your designs, code, pricing or client information could legally be shared.",
      whatYouCanAskFor: "Request a standard mutual confidentiality clause before signing.",
      learnWhy: "Contracts usually include this to ensure trade secrets and private data aren't leaked to competitors."
    }
  ],
  NDA: [
    {
      clauseType: "Term",
      title: "Expiration Date",
      importanceLevel: 5,
      importanceText: "Critical",
      isNormalMissing: "Unusual. NDAs shouldn't last forever.",
      whyItMatters: "There is no time limit on how long you must keep the information secret.",
      whatCouldHappen: "You could be held legally liable for decades over outdated information.",
      whatYouCanAskFor: "Ask for a reasonable expiration date (e.g., 2 to 5 years).",
      learnWhy: "Information loses its value over time. An endless NDA is overly burdensome and often unenforceable."
    }
  ],
  GENERIC: [
    {
      clauseType: "Liability",
      title: "Limit on Financial Risk",
      importanceLevel: 5,
      importanceText: "Critical",
      isNormalMissing: "Common in basic contracts, but highly dangerous to omit.",
      whyItMatters: "There is no cap on how much you could be sued for if something goes wrong.",
      whatCouldHappen: "You could be personally sued for millions, losing your business or personal assets.",
      whatYouCanAskFor: "Request a 'Limitation of Liability' clause capping damages to the total contract value.",
      learnWhy: "Even if you make an honest mistake, without a cap, the other party can sue you for indirect losses like 'lost profits'."
    },
    {
      clauseType: "Dispute Resolution",
      title: "How Disagreements Are Solved",
      importanceLevel: 3,
      importanceText: "Medium",
      isNormalMissing: "Often omitted in informal agreements, but standard in professional ones.",
      whyItMatters: "The contract doesn't explain what happens if you and the other party disagree.",
      whatCouldHappen: "Any minor disagreement could immediately turn into a massive, expensive lawsuit.",
      whatYouCanAskFor: "Ask to add a 'Mediation' or 'Arbitration' clause before going to court.",
      learnWhy: "Courts are expensive and slow. Mediation requires both parties to sit down with a neutral third party to find a solution."
    }
  ]
};

// 1. Detect Contract Type using simple heuristics
export function detectContractType(clauses: any[]): ContractType {
  let isEmployment = false;
  let isFreelance = false;
  let isNDA = false;

  const textToScan = clauses.map(c => (c.clauseType + " " + c.title).toLowerCase()).join(" ");

  if (textToScan.includes("employment") || textToScan.includes("salary") || textToScan.includes("benefits")) {
    isEmployment = true;
  }
  if (textToScan.includes("freelance") || textToScan.includes("deliverables") || textToScan.includes("independent contractor")) {
    isFreelance = true;
  }
  if (textToScan.includes("non-disclosure") || textToScan.includes("confidentiality agreement")) {
    isNDA = true;
  }

  if (isEmployment) return "EMPLOYMENT";
  if (isFreelance) return "FREELANCE";
  if (isNDA) return "NDA";
  return "GENERIC";
}

// 2. Cross-reference detected clauses against the appropriate playbook
export function getMissingProtections(clauses: any[]): MissingProtection[] {
  const contractType = detectContractType(clauses);
  const playbook = PLAYBOOKS[contractType] || PLAYBOOKS["GENERIC"];
  
  const presentTypes = clauses.map(c => (c.clauseType || "").toLowerCase());
  const presentTitles = clauses.map(c => (c.title || "").toLowerCase());

  const missing: MissingProtection[] = [];

  playbook.forEach(protection => {
    // Check if protection is found
    const target = protection.clauseType.toLowerCase();
    
    // We check both clauseType and title for matches
    const isFound = presentTypes.some(t => t.includes(target) || target.includes(t)) || 
                    presentTitles.some(t => t.includes(target));

    if (!isFound) {
      missing.push(protection);
    }
  });

  // Always check for Generic Liability if not NDA or Employment
  if (contractType !== "NDA" && contractType !== "EMPLOYMENT" && contractType !== "GENERIC") {
    const genericPlaybook = PLAYBOOKS["GENERIC"];
    genericPlaybook.forEach(protection => {
      const target = protection.clauseType.toLowerCase();
      const isFound = presentTypes.some(t => t.includes(target) || target.includes(t)) || 
                      presentTitles.some(t => t.includes(target));
      if (!isFound && !missing.find(m => m.clauseType === protection.clauseType)) {
        missing.push(protection);
      }
    });
  }

  // Sort by importance
  missing.sort((a, b) => b.importanceLevel - a.importanceLevel);

  return missing;
}
