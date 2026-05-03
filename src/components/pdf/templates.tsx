import type { Agreement, Worker, Payment, Project } from '@/types';
import { owner, partner } from '@/data/demo';

const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
const TOTAL_PAGES = 5;

function PdfHeader({ refNo, title }: { refNo: string; title: string }) {
  return (
    <div className="border-b-2 border-[#1a1f36] pb-4 mb-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-lg font-bold text-[#1a1f36] tracking-tight">VisaHOBe PTE. LTD.</h1>
          <p className="text-[9px] text-gray-500 mt-0.5">VisaMOTion Recruitment System</p>
        </div>
        <div className="text-right">
          <p className="text-[9px] text-gray-500">Ref: {refNo}</p>
          <p className="text-[9px] text-gray-500">Date: {today}</p>
        </div>
      </div>
      <h2 className="text-sm font-bold text-[#1a1f36] mt-4 uppercase tracking-wider">{title}</h2>
    </div>
  );
}

function PdfFooter({ pageNum, totalPages = TOTAL_PAGES }: { pageNum: number; totalPages?: number }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 px-10 pb-6 flex items-end justify-between border-t border-gray-200 pt-3">
      <p className="text-[8px] text-gray-400">VisaHOBe PTE. LTD. — Confidential</p>
      <p className="text-[8px] text-gray-400">Page {pageNum} of {totalPages}</p>
    </div>
  );
}

function SignatureBlock({ names }: { names: string[] }) {
  return (
    <div className="mt-10 grid grid-cols-2 gap-8">
      {names.map((name) => (
        <div key={name}>
          <div className="border-b border-gray-300 h-12 mb-2" />
          <p className="text-[10px] font-semibold text-[#1a1f36]">{name}</p>
          <p className="text-[9px] text-gray-500">Signature & Date</p>
        </div>
      ))}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[11px] font-bold text-[#1a1f36] uppercase tracking-wider mt-5 mb-2 border-l-2 border-amber-500 pl-2">
      {children}
    </h3>
  );
}

function Clause({ num, text }: { num: string; text: string }) {
  return (
    <p className="text-[10px] text-gray-700 leading-relaxed mb-2">
      <span className="font-semibold text-[#1a1f36]">{num}.</span> {text}
    </p>
  );
}

function PageShell({ refNo, title, pageNum, children }: { refNo: string; title: string; pageNum: number; children: React.ReactNode }) {
  return (
    <div className="px-10 pt-8 pb-16 text-[10px] relative h-full bg-white">
      <PdfHeader refNo={refNo} title={title} />
      {children}
      <PdfFooter pageNum={pageNum} />
    </div>
  );
}

function DraftStamp() {
  return (
    <div className="absolute right-8 top-24 -rotate-12 border-2 border-amber-500/60 text-amber-600 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded">
      Draft · Awaiting Upload
    </div>
  );
}

// ==================== PARTNERSHIP AGREEMENT (5 pages) ====================
export function PartnershipAgreementPages(agreement?: Agreement): React.ReactNode[] {
  const ref = agreement?.referenceNo || 'AGR-PARTNER-2025-001';
  const t = 'Partnership Agreement';
  return [
    <PageShell key="p1" refNo={ref} title={t} pageNum={1}>
      <DraftStamp />
      <p className="text-[10px] text-gray-600 mb-4">
        This Partnership Agreement ("Agreement") is entered into on <strong>{today}</strong> by and between the following parties:
      </p>
      <SectionTitle>Parties</SectionTitle>
      <div className="bg-gray-50 rounded p-3 mb-4 text-[10px]">
        <p><strong>Party A (Owner):</strong> {owner.name}</p>
        <p className="text-gray-500">Passport: {owner.passport} | Nationality: {owner.nationality}</p>
        <p className="text-gray-500">Internal ID: {owner.internalId}</p>
        <div className="h-2" />
        <p><strong>Party B (Partner):</strong> {partner.name}</p>
        <p className="text-gray-500">Passport: {partner.passport} | Nationality: {partner.nationality}</p>
        <p className="text-gray-500">Internal ID: {partner.internalId}</p>
      </div>
      <SectionTitle>Recitals</SectionTitle>
      <Clause num="A" text="Whereas the Owner operates VisaHOBe PTE. LTD., a manpower recruitment business serving employers across South-East Asia and the Middle East." />
      <Clause num="B" text="Whereas the Partner wishes to participate in the operation, financing, and growth of the said business under defined terms." />
      <Clause num="C" text="Whereas both parties intend to formalise their cooperation through this Agreement." />
    </PageShell>,
    <PageShell key="p2" refNo={ref} title={`${t} (cont.)`} pageNum={2}>
      <SectionTitle>Terms & Conditions</SectionTitle>
      <Clause num="1" text="Both parties agree to jointly operate the manpower recruitment business under the name VisaHOBe PTE. LTD. and its associated VisaMOTion Recruitment System." />
      <Clause num="2" text="The profit-sharing ratio shall be 60% (Owner) and 40% (Partner) of net profits after deduction of all operational expenses." />
      <Clause num="3" text="Each party shall contribute to business operations as agreed upon in the operational addendum attached hereto as Schedule A." />
      <Clause num="4" text="This agreement shall be effective from the date of signing and shall remain in force for a period of twenty-four (24) months, renewable by mutual consent." />
      <Clause num="5" text="Either party may terminate this agreement with ninety (90) days written notice. Upon termination, assets and liabilities shall be divided proportionally." />
      <SectionTitle>Roles & Responsibilities</SectionTitle>
      <Clause num="6" text="The Owner shall manage end-to-end recruitment operations, employer relationships, and overall business strategy." />
      <Clause num="7" text="The Partner shall oversee finance, compliance, and provide working capital up to the agreed cap stated in Schedule A." />
    </PageShell>,
    <PageShell key="p3" refNo={ref} title={`${t} (cont.)`} pageNum={3}>
      <SectionTitle>Financial Obligations</SectionTitle>
      <Clause num="8" text="All financial transactions must be recorded in the VisaMOTion system and reconciled monthly by both parties." />
      <Clause num="9" text="Neither party shall incur debts or financial obligations exceeding SGD 10,000 without prior written consent of the other party." />
      <Clause num="10" text="Profit distributions shall be made quarterly, within fifteen (15) business days of the quarter end." />
      <Clause num="11" text="An independent annual audit shall be conducted at the close of each financial year. Costs shall be borne by the partnership." />
      <SectionTitle>Capital Contribution</SectionTitle>
      <div className="bg-gray-50 rounded p-3 text-[10px]">
        <p>Initial working capital: <strong>SGD 250,000</strong> (Partner)</p>
        <p>Operational know-how & licenses: <strong>Owner</strong></p>
        <p>Reinvestment quota: <strong>20% of quarterly net profit</strong></p>
      </div>
    </PageShell>,
    <PageShell key="p4" refNo={ref} title={`${t} (cont.)`} pageNum={4}>
      <SectionTitle>Confidentiality</SectionTitle>
      <Clause num="12" text="Both parties shall maintain strict confidentiality regarding worker records, employer contracts, and commercial terms during and after the term of this Agreement." />
      <Clause num="13" text="Breach of confidentiality shall constitute material default and grounds for immediate termination." />
      <SectionTitle>Dispute Resolution</SectionTitle>
      <Clause num="14" text="Any disputes arising from this agreement shall first be resolved through good-faith mediation between the parties." />
      <Clause num="15" text="If mediation fails within thirty (30) days, the matter shall be referred to arbitration under Singapore International Arbitration Centre (SIAC) rules." />
      <SectionTitle>Governing Law</SectionTitle>
      <p className="text-[10px] text-gray-700 mb-2">This Agreement shall be governed by and construed in accordance with the laws of the Republic of Singapore.</p>
      <SectionTitle>Force Majeure</SectionTitle>
      <Clause num="16" text="Neither party shall be liable for failure to perform obligations affected by events beyond reasonable control including, but not limited to, war, pandemic, or government-imposed restrictions." />
    </PageShell>,
    <PageShell key="p5" refNo={ref} title={`${t} — Execution`} pageNum={5}>
      <SectionTitle>Entire Agreement</SectionTitle>
      <Clause num="17" text="This agreement, together with any executed schedules, constitutes the entire understanding between the parties and supersedes all prior negotiations and agreements." />
      <Clause num="18" text="Any amendment shall be valid only if made in writing and signed by both parties." />
      <SectionTitle>Acknowledgement</SectionTitle>
      <p className="text-[10px] text-gray-700 mb-4">
        By signing below, both parties confirm they have read, understood and agreed to all terms of this Partnership Agreement.
      </p>
      <SignatureBlock names={[owner.name, partner.name]} />
      <div className="mt-8 grid grid-cols-2 gap-8">
        <div>
          <p className="text-[10px] text-gray-500">Witness 1</p>
          <div className="border-b border-gray-300 h-10 mt-2" />
        </div>
        <div>
          <p className="text-[10px] text-gray-500">Witness 2</p>
          <div className="border-b border-gray-300 h-10 mt-2" />
        </div>
      </div>
    </PageShell>,
  ];
}

// ==================== WORKER AGREEMENT (5 pages) ====================
export function WorkerAgreementPages(worker?: Worker): React.ReactNode[] {
  const w = worker || { firstName: 'Mohammad', lastName: 'Rahman', passport: 'B00312456', nationality: 'Bangladeshi', jobTitle: 'Construction Worker', destinationCountry: 'Singapore', internalId: 'WKR-2026-0001' };
  const ref = `AGR-WKR-${new Date().getFullYear()}-${(w.internalId || '0001').slice(-4)}`;
  const t = 'Worker Deployment Agreement';
  const fullName = `${w.firstName} ${w.lastName}`;
  return [
    <PageShell key="w1" refNo={ref} title={t} pageNum={1}>
      <DraftStamp />
      <p className="text-[10px] text-gray-600 mb-4">
        This Worker Deployment Agreement is entered into on <strong>{today}</strong> between the Agency and the Worker named below.
      </p>
      <SectionTitle>Worker Details</SectionTitle>
      <div className="bg-gray-50 rounded p-3 mb-4">
        <div className="grid grid-cols-2 gap-y-1 text-[10px]">
          <p><strong>Full Name:</strong> {fullName}</p>
          <p><strong>Passport:</strong> {w.passport}</p>
          <p><strong>Nationality:</strong> {w.nationality}</p>
          <p><strong>Internal ID:</strong> {w.internalId}</p>
          <p><strong>Job Title:</strong> {w.jobTitle}</p>
          <p><strong>Destination:</strong> {w.destinationCountry}</p>
        </div>
      </div>
      <SectionTitle>Agency</SectionTitle>
      <div className="bg-gray-50 rounded p-3 text-[10px]">
        <p><strong>VisaHOBe PTE. LTD.</strong></p>
        <p className="text-gray-500">Represented by: {owner.name} (Owner)</p>
        <p className="text-gray-500">License No: VHB-MOM-2025-001</p>
      </div>
    </PageShell>,
    <PageShell key="w2" refNo={ref} title={`${t} (cont.)`} pageNum={2}>
      <SectionTitle>Terms of Deployment</SectionTitle>
      <Clause num="1" text={`The Worker agrees to be deployed to ${w.destinationCountry} for the position of ${w.jobTitle} under the terms specified by the employer.`} />
      <Clause num="2" text="The Agency shall facilitate all visa processing, documentation, medical screening, and travel arrangements at the agreed service fee." />
      <Clause num="3" text="The Worker shall comply with all immigration laws and employment regulations of the destination country." />
      <Clause num="4" text="The deployment period shall be as specified in the employer's contract, typically twenty-four (24) months, renewable subject to employer approval." />
      <Clause num="5" text="The Worker authorises the Agency to process personal data as required for visa and employment processing." />
      <SectionTitle>Working Conditions</SectionTitle>
      <Clause num="6" text="Standard working hours, overtime rates and weekly rest day shall follow the destination country's prevailing labour law." />
      <Clause num="7" text="Accommodation, meals and transport to work shall be provided by the employer unless otherwise stated in the offer letter." />
    </PageShell>,
    <PageShell key="w3" refNo={ref} title={`${t} (cont.)`} pageNum={3}>
      <SectionTitle>Fees & Deductions</SectionTitle>
      <Clause num="8" text="The Worker shall pay the Agency a one-time service fee as detailed in the Fee Schedule attached. No additional charges shall be levied beyond those listed." />
      <Clause num="9" text="Refunds, where applicable due to visa rejection or employer cancellation, shall be processed within thirty (30) calendar days." />
      <SectionTitle>Health & Insurance</SectionTitle>
      <Clause num="10" text="The Worker shall undergo a pre-departure medical examination at an approved clinic. Cost is included in the service fee." />
      <Clause num="11" text="The employer shall provide statutory medical insurance and work injury compensation as per local regulations." />
      <SectionTitle>Code of Conduct</SectionTitle>
      <Clause num="12" text="The Worker shall maintain professional conduct, respect host-country culture, and shall not engage in unauthorised secondary employment." />
    </PageShell>,
    <PageShell key="w4" refNo={ref} title={`${t} (cont.)`} pageNum={4}>
      <SectionTitle>Repatriation</SectionTitle>
      <Clause num="13" text="Upon completion of contract, the employer shall bear the cost of return air ticket to the Worker's home country." />
      <Clause num="14" text="In the event of early termination by the Worker without just cause, repatriation costs shall be deducted from final dues." />
      <SectionTitle>Termination</SectionTitle>
      <Clause num="15" text="Either party may terminate the contract for material breach with thirty (30) days written notice. Immediate termination is permitted in case of misconduct, intoxication, or violation of host-country law." />
      <SectionTitle>Dispute Resolution</SectionTitle>
      <Clause num="16" text="Disputes shall first be referred to the Agency's grievance officer. Unresolved matters shall be escalated to the Ministry of Manpower of the destination country." />
    </PageShell>,
    <PageShell key="w5" refNo={ref} title={`${t} — Execution`} pageNum={5}>
      <SectionTitle>Worker Acknowledgement</SectionTitle>
      <p className="text-[10px] text-gray-700 mb-4">
        I, <strong>{fullName}</strong>, holder of passport <strong>{w.passport}</strong>, confirm that the contents of this Agreement have been read and explained to me in a language I understand. I willingly accept all terms.
      </p>
      <div className="bg-gray-50 rounded p-3 mb-6 text-[10px]">
        <p><strong>Internal File:</strong> {w.internalId}</p>
        <p><strong>Issuance Date:</strong> {today}</p>
      </div>
      <SignatureBlock names={[fullName, owner.name]} />
      <div className="mt-8">
        <p className="text-[10px] text-gray-500">Witness</p>
        <div className="border-b border-gray-300 h-10 mt-2 w-2/3" />
      </div>
    </PageShell>,
  ];
}

// ==================== EMPLOYER CONTRACT (5 pages) ====================
export function EmployerContractPages(project?: Project): React.ReactNode[] {
  const p = project || { name: 'Singapore Marina Bay Phase 3', employer: 'Hyundai E&C Singapore', country: 'Singapore', batchCode: 'SG_BATCH_01_2026', targetWorkers: 10 };
  const ref = `AGR-EMP-${new Date().getFullYear()}-${(p.batchCode || '001').slice(-3)}`;
  const t = 'Employer Service Contract';
  return [
    <PageShell key="e1" refNo={ref} title={t} pageNum={1}>
      <DraftStamp />
      <p className="text-[10px] text-gray-600 mb-4">
        This Employer Service Contract is entered into on <strong>{today}</strong> between the Agency and the Employer.
      </p>
      <SectionTitle>Employer Details</SectionTitle>
      <div className="bg-gray-50 rounded p-3 mb-4 text-[10px]">
        <p><strong>Company:</strong> {p.employer}</p>
        <p><strong>Project:</strong> {p.name}</p>
        <p><strong>Batch Code:</strong> {p.batchCode}</p>
        <p><strong>Country:</strong> {p.country}</p>
        <p><strong>Workers Required:</strong> {p.targetWorkers}</p>
      </div>
      <SectionTitle>Agency</SectionTitle>
      <div className="bg-gray-50 rounded p-3 text-[10px]">
        <p><strong>VisaHOBe PTE. LTD.</strong></p>
        <p className="text-gray-500">VisaMOTion Recruitment System</p>
      </div>
    </PageShell>,
    <PageShell key="e2" refNo={ref} title={`${t} (cont.)`} pageNum={2}>
      <SectionTitle>Scope of Services</SectionTitle>
      <Clause num="1" text={`The Agency shall recruit, screen, and deploy up to ${p.targetWorkers} qualified workers for the ${p.name} project.`} />
      <Clause num="2" text="The Agency guarantees that all workers will meet the employer's specified qualifications and medical fitness requirements." />
      <Clause num="3" text="Workers who fail to meet performance standards within the probation period shall be replaced at no additional cost." />
      <Clause num="4" text="The Employer shall provide work permits, accommodation, and transportation as per local labour regulations." />
      <SectionTitle>Recruitment Workflow</SectionTitle>
      <Clause num="5" text="The Agency shall provide CVs of pre-screened candidates within fourteen (14) days of contract signing." />
      <Clause num="6" text="The Employer shall conduct interviews via video call and provide selection decisions within seven (7) working days." />
    </PageShell>,
    <PageShell key="e3" refNo={ref} title={`${t} (cont.)`} pageNum={3}>
      <SectionTitle>Commercial Terms</SectionTitle>
      <Clause num="7" text="The service fee per worker shall be as agreed in Schedule A attached hereto." />
      <Clause num="8" text="Payment terms: 50% upon visa approval, 50% upon worker arrival at destination." />
      <Clause num="9" text="All payments shall be made via bank transfer to the Agency's nominated account in Singapore Dollars (SGD)." />
      <Clause num="10" text="Late payments beyond fifteen (15) days shall attract a 1.5% per month service charge." />
      <SectionTitle>Replacement Guarantee</SectionTitle>
      <Clause num="11" text="In the event a worker is medically unfit, absconds, or is terminated for cause within the first ninety (90) days, the Agency shall provide a free replacement subject to visa availability." />
    </PageShell>,
    <PageShell key="e4" refNo={ref} title={`${t} (cont.)`} pageNum={4}>
      <SectionTitle>Confidentiality & Data Protection</SectionTitle>
      <Clause num="12" text="Both parties shall maintain confidentiality of commercial and personal data exchanged in the course of this engagement, in compliance with applicable data protection laws." />
      <SectionTitle>Force Majeure</SectionTitle>
      <Clause num="13" text="Neither party shall be liable for delays caused by events beyond reasonable control including pandemics, embassy closures, or border restrictions." />
      <SectionTitle>Termination</SectionTitle>
      <Clause num="14" text="Either party may terminate this contract with sixty (60) days written notice. Workers already in transit shall be honoured to completion." />
      <SectionTitle>Governing Law</SectionTitle>
      <p className="text-[10px] text-gray-700">This contract is governed by the laws of the Republic of Singapore.</p>
    </PageShell>,
    <PageShell key="e5" refNo={ref} title={`${t} — Execution`} pageNum={5}>
      <SectionTitle>Acknowledgement</SectionTitle>
      <p className="text-[10px] text-gray-700 mb-4">
        Both parties confirm acceptance of all terms and schedules forming part of this Employer Service Contract.
      </p>
      <div className="bg-gray-50 rounded p-3 mb-6 text-[10px]">
        <p><strong>Reference:</strong> {ref}</p>
        <p><strong>Batch:</strong> {p.batchCode}</p>
        <p><strong>Effective Date:</strong> {today}</p>
      </div>
      <SignatureBlock names={[owner.name, `${p.employer} Representative`]} />
      <div className="mt-8 grid grid-cols-2 gap-8 text-[10px] text-gray-500">
        <div><p>Company Stamp:</p><div className="h-16 border border-dashed border-gray-300 rounded mt-1" /></div>
        <div><p>Agency Stamp:</p><div className="h-16 border border-dashed border-gray-300 rounded mt-1" /></div>
      </div>
    </PageShell>,
  ];
}

// ==================== PAYMENT RECEIPT (5 pages) ====================
export function PaymentReceiptPages(payment?: Payment): React.ReactNode[] {
  const pay = payment || { id: 'pay1', amount: 3500, currency: 'SGD', description: 'Processing fee', date: '2026-01-20', status: 'paid' as const, type: 'worker_fee' as const };
  const receiptNo = `RCP-${new Date().getFullYear()}-${(pay.id || '0001').slice(-4)}`;
  const t = 'Payment Receipt';
  return [
    <PageShell key="r1" refNo={receiptNo} title={t} pageNum={1}>
      <DraftStamp />
      <div className="bg-emerald-50 border border-emerald-200 rounded p-4 mb-6 text-center">
        <p className="text-[9px] text-emerald-600 uppercase font-semibold tracking-wider">Amount Received</p>
        <p className="text-2xl font-bold text-emerald-700 mt-1">{pay.currency} {pay.amount.toLocaleString()}</p>
        <p className="text-[10px] text-emerald-600 mt-1">Status: {pay.status.toUpperCase()}</p>
      </div>
      <SectionTitle>Payment Details</SectionTitle>
      <div className="bg-gray-50 rounded p-3 mb-4">
        <div className="grid grid-cols-2 gap-y-2 text-[10px]">
          <p><strong>Receipt No:</strong> {receiptNo}</p>
          <p><strong>Date:</strong> {pay.date}</p>
          <p><strong>Type:</strong> {pay.type.replace('_', ' ').toUpperCase()}</p>
          <p><strong>Currency:</strong> {pay.currency}</p>
          <p className="col-span-2"><strong>Description:</strong> {pay.description}</p>
        </div>
      </div>
      <SectionTitle>Issued By</SectionTitle>
      <div className="bg-gray-50 rounded p-3 text-[10px]">
        <p><strong>VisaHOBe PTE. LTD.</strong></p>
        <p className="text-gray-500">Authorised by: {owner.name}</p>
      </div>
    </PageShell>,
    <PageShell key="r2" refNo={receiptNo} title={`${t} — Breakdown`} pageNum={2}>
      <SectionTitle>Fee Breakdown</SectionTitle>
      <table className="w-full text-[10px] border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border border-gray-200">Item</th>
            <th className="p-2 border border-gray-200 text-right">Amount ({pay.currency})</th>
          </tr>
        </thead>
        <tbody>
          <tr><td className="p-2 border border-gray-200">Service charge</td><td className="p-2 border border-gray-200 text-right">{(pay.amount * 0.6).toLocaleString()}</td></tr>
          <tr><td className="p-2 border border-gray-200">Visa processing</td><td className="p-2 border border-gray-200 text-right">{(pay.amount * 0.25).toLocaleString()}</td></tr>
          <tr><td className="p-2 border border-gray-200">Medical & documentation</td><td className="p-2 border border-gray-200 text-right">{(pay.amount * 0.15).toLocaleString()}</td></tr>
          <tr className="font-bold bg-gray-50"><td className="p-2 border border-gray-200">Total</td><td className="p-2 border border-gray-200 text-right">{pay.amount.toLocaleString()}</td></tr>
        </tbody>
      </table>
    </PageShell>,
    <PageShell key="r3" refNo={receiptNo} title={`${t} — Payment Instrument`} pageNum={3}>
      <SectionTitle>Method of Payment</SectionTitle>
      <div className="bg-gray-50 rounded p-3 text-[10px] space-y-1">
        <p><strong>Mode:</strong> Bank Transfer</p>
        <p><strong>Bank:</strong> DBS Bank Singapore</p>
        <p><strong>Account Name:</strong> VisaHOBe PTE. LTD.</p>
        <p><strong>Account No:</strong> 0123-4567-8901 (last 4 visible)</p>
        <p><strong>Reference:</strong> {receiptNo}</p>
      </div>
      <SectionTitle>Tax Note</SectionTitle>
      <p className="text-[10px] text-gray-700">
        VisaHOBe PTE. LTD. is GST-registered (GST Reg No: 202312345X). Where applicable, GST has been included in the amount above.
      </p>
    </PageShell>,
    <PageShell key="r4" refNo={receiptNo} title={`${t} — Terms`} pageNum={4}>
      <SectionTitle>Refund Policy</SectionTitle>
      <Clause num="1" text="Service fees are non-refundable once visa processing has commenced, except where required by law." />
      <Clause num="2" text="Visa-rejection refunds shall be processed within thirty (30) calendar days, less actual incurred costs." />
      <SectionTitle>Confidentiality</SectionTitle>
      <Clause num="3" text="This receipt is issued for the named beneficiary and shall not be reproduced or shared without written consent." />
      <SectionTitle>Validity</SectionTitle>
      <Clause num="4" text="This receipt is system-generated and valid without a physical signature when accompanied by the original transaction reference." />
    </PageShell>,
    <PageShell key="r5" refNo={receiptNo} title={`${t} — Acknowledgement`} pageNum={5}>
      <p className="text-[10px] text-gray-700 mb-6">
        This is a system-generated receipt from the VisaMOTion Recruitment System. For queries, contact VisaHOBe PTE. LTD.
      </p>
      <div className="mt-2">
        <div className="border-b border-gray-300 h-10 w-48 mb-1" />
        <p className="text-[10px] font-semibold text-[#1a1f36]">Authorised Signatory</p>
        <p className="text-[9px] text-gray-500">{owner.name}</p>
      </div>
      <div className="mt-10 border border-dashed border-gray-300 rounded p-3 text-[9px] text-gray-500 text-center">
        Receipt verified electronically · {receiptNo} · {today}
      </div>
    </PageShell>,
  ];
}
