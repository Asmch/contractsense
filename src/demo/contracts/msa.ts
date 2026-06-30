export const msaContract = {
  _id: "demo_msa_01",
  title: "Master Service Agreement - Acme Corp",
  status: "COMPLETE",
  safetyScore: 72,
  riskLevel: "HIGH",
  pageCount: 14,
  wordCount: 4230,
  executiveSummary: "This Master Service Agreement establishes terms for software development services. While generally standard, it heavily favors the Client, containing high-risk IP assignment terms and an uncapped liability clause that exposes the Service Provider to significant financial risk.",
  keyTakeaways: [
    "Client assumes full ownership of all IP immediately upon creation.",
    "Liability is uncapped for third-party claims.",
    "Payment terms are extended to Net 90.",
    "Standard termination for convenience by Client with 30 days notice."
  ],
  executiveNegotiationReport: {
    whatToNegotiateFirst: [
      "Uncapped Indemnification (§ 7.3)",
      "Net 90 Payment Terms (§ 4.1)"
    ],
    whatToNegotiateSecond: [
      "Blanket IP Transfer without carving out pre-existing IP (§ 5.1)",
      "Unilateral Termination without penalty (§ 9.2)"
    ],
    whatCanBeIgnored: [
      "Standard Confidentiality Obligations",
      "Independent Contractor Status"
    ]
  }
};

export const msaClauses = [
  {
    _id: "clause_01",
    contractId: "demo_msa_01",
    order: 1,
    title: "Unlimited Indemnification",
    clauseType: "Liability",
    content: "The Service Provider hereby agrees to indemnify, defend, and hold harmless the Client from any and all unlimited liability arising from third-party claims regardless of cause.",
    riskLevel: "CRITICAL",
    riskScore: 92,
    explanation: "You are agreeing to pay for ANY legal claims made against the client related to your work, without any financial limit.",
    concerns: [
      "Exposes you to infinite financial risk.",
      "Not tied to your actual fault or negligence."
    ],
    recommendations: [
      "Cap liability at the amount of fees paid in the last 12 months.",
      "Limit indemnification to direct damages caused by gross negligence."
    ],
    suggestedRewrite: "Service Provider shall indemnify Client for direct damages arising solely from Service Provider's gross negligence, capped at fees paid in the trailing 12 months.",
    riskReductionScore: 58,
    acceptanceProbability: 65,
    marketStandard: "Capped at 1x to 2x annual contract value.",
    marketStandardReason: "Vendors cannot insure against uncapped, abstract risks.",
    talkingPoints: [
      "Our insurance policy caps our coverage.",
      "We cannot accept risk disproportionate to the contract value."
    ],
    negotiationPriority: "CRITICAL"
  },
  {
    _id: "clause_02",
    contractId: "demo_msa_01",
    order: 2,
    title: "Net 90 Payment Terms",
    clauseType: "Payment",
    content: "Payment shall be due within ninety (90) days of invoice receipt, subject to internal review and approval by Client's accounting department.",
    riskLevel: "HIGH",
    riskScore: 78,
    explanation: "You won't get paid until 3 months after you submit an invoice.",
    concerns: [
      "Severe impact on cash flow.",
      "'Subject to internal review' allows indefinite delays."
    ],
    recommendations: [
      "Negotiate to Net 30.",
      "Add late payment interest of 1.5% per month."
    ],
    suggestedRewrite: "Payment shall be due within thirty (30) days of invoice receipt. Undisputed late payments shall accrue interest at 1.5% per month.",
    riskReductionScore: 40,
    acceptanceProbability: 85,
    marketStandard: "Net 30 or Net 45.",
    marketStandardReason: "Small/Medium service providers require predictable cash flow.",
    talkingPoints: [
      "Standard terms for our services are Net 30.",
      "Extended terms require an adjustment to our pricing."
    ],
    idealPosition: "Net 15 days.",
    fallbackPosition: "Net 45 days max.",
    negotiationPriority: "HIGH"
  },
  {
    _id: "clause_03",
    contractId: "demo_msa_01",
    order: 3,
    title: "Blanket IP Transfer",
    clauseType: "Intellectual Property",
    content: "Client shall exclusively own all intellectual property, materials, and deliverables created under this Agreement.",
    riskLevel: "MEDIUM",
    riskScore: 55,
    explanation: "The client owns everything you create for them. However, it doesn't mention your pre-existing tools or templates.",
    concerns: [
      "You might accidentally transfer ownership of tools you use for other clients."
    ],
    recommendations: [
      "Carve out 'Background IP' (things you already owned)."
    ],
    suggestedRewrite: "Client shall own deliverables created specifically under this Agreement. Service Provider retains ownership of all pre-existing IP, granting Client a license to use it within the deliverables.",
    riskReductionScore: 21,
    acceptanceProbability: 95,
    marketStandard: "Client owns custom work; Vendor keeps background IP.",
    marketStandardReason: "Vendors need their core tools to serve multiple clients.",
    talkingPoints: [
      "We need to retain our underlying frameworks to operate.",
      "This doesn't limit your use of the final product."
    ],
    negotiationPriority: "MEDIUM"
  },
  {
    _id: "clause_04",
    contractId: "demo_msa_01",
    order: 4,
    title: "Confidentiality",
    clauseType: "Confidentiality",
    content: "Both parties agree to maintain the confidentiality of all proprietary information shared during the course of this engagement for a period of three (3) years.",
    riskLevel: "LOW",
    riskScore: 12,
    explanation: "Standard mutual non-disclosure agreement lasting 3 years.",
    concerns: [],
    recommendations: [
      "Standard clause, no action required."
    ]
  }
];
