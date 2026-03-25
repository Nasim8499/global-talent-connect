import type { Agreement, Worker, Payment, Project } from '@/types';
import { owner, partner } from '@/data/demo';

const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });

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

function PdfFooter({ pageNum, totalPages }: { pageNum: number; totalPages: number }) {
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

// ==================== PARTNERSHIP AGREEMENT ====================
export function PartnershipAgreementPages(agreement?: Agreement): React.ReactNode[] {
  const ref = agreement?.referenceNo || 'AGR-PARTNER-2025-001';
  return [
    // Page 1
    <div key="p1" className="px-10 pt-8 pb-16 text-[10px] relative h-full">
      <PdfHeader refNo={ref} title="Partnership Agreement" />
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
      <SectionTitle>Terms & Conditions</SectionTitle>
      <Clause num="1" text="Both parties agree to jointly operate the manpower recruitment business under the name VisaHOBe PTE. LTD. and its associated VisaMOTion Recruitment System." />
      <Clause num="2" text="The profit-sharing ratio shall be 60% (Owner) and 40% (Partner) of net profits after deduction of all operational expenses." />
      <Clause num="3" text="Each party shall contribute to business operations as agreed upon in the operational addendum attached hereto." />
      <Clause num="4" text="This agreement shall be effective from the date of signing and shall remain in force for a period of twenty-four (24) months, renewable by mutual consent." />
      <Clause num="5" text="Either party may terminate this agreement with ninety (90) days written notice. Upon termination, assets and liabilities shall be divided proportionally." />
      <PdfFooter pageNum={1} totalPages={2} />
    </div>,
    // Page 2
    <div key="p2" className="px-10 pt-8 pb-16 text-[10px] relative h-full">
      <PdfHeader refNo={ref} title="Partnership Agreement (cont.)" />
      <SectionTitle>Financial Obligations</SectionTitle>
      <Clause num="6" text="All financial transactions must be recorded in the VisaMOTion system and reconciled monthly by both parties." />
      <Clause num="7" text="Neither party shall incur debts or financial obligations exceeding SGD 10,000 without prior written consent of the other party." />
      <Clause num="8" text="Profit distributions shall be made quarterly, within fifteen (15) business days of the quarter end." />
      <SectionTitle>Dispute Resolution</SectionTitle>
      <Clause num="9" text="Any disputes arising from this agreement shall first be resolved through mediation. If mediation fails, the matter shall be referred to arbitration under Singapore law." />
      <Clause num="10" text="This agreement constitutes the entire understanding between the parties and supersedes all prior negotiations and agreements." />
      <SectionTitle>Governing Law</SectionTitle>
      <p className="text-[10px] text-gray-700 mb-6">This Agreement shall be governed by and construed in accordance with the laws of the Republic of Singapore.</p>
      <SignatureBlock names={[owner.name, partner.name]} />
      <PdfFooter pageNum={2} totalPages={2} />
    </div>,
  ];
}

// ==================== WORKER AGREEMENT ====================
export function WorkerAgreementPages(worker?: Worker): React.ReactNode[] {
  const w = worker || { firstName: 'Mohammad', lastName: 'Rahman', passport: 'B00312456', nationality: 'Bangladeshi', jobTitle: 'Construction Worker', destinationCountry: 'Singapore', internalId: 'WKR-2026-0001' };
  const ref = `AGR-WKR-${new Date().getFullYear()}-${Math.floor(Math.random() * 999).toString().padStart(3, '0')}`;
  return [
    <div key="w1" className="px-10 pt-8 pb-16 text-[10px] relative h-full">
      <PdfHeader refNo={ref} title="Worker Deployment Agreement" />
      <p className="text-[10px] text-gray-600 mb-4">
        This Worker Deployment Agreement is entered into on <strong>{today}</strong> between the Agency and the Worker named below.
      </p>
      <SectionTitle>Worker Details</SectionTitle>
      <div className="bg-gray-50 rounded p-3 mb-4">
        <div className="grid grid-cols-2 gap-y-1 text-[10px]">
          <p><strong>Full Name:</strong> {w.firstName} {w.lastName}</p>
          <p><strong>Passport:</strong> {w.passport}</p>
          <p><strong>Nationality:</strong> {w.nationality}</p>
          <p><strong>Internal ID:</strong> {w.internalId}</p>
          <p><strong>Job Title:</strong> {w.jobTitle}</p>
          <p><strong>Destination:</strong> {w.destinationCountry}</p>
        </div>
      </div>
      <SectionTitle>Agency</SectionTitle>
      <div className="bg-gray-50 rounded p-3 mb-4 text-[10px]">
        <p><strong>VisaHOBe PTE. LTD.</strong></p>
        <p className="text-gray-500">Represented by: {owner.name} (Owner)</p>
      </div>
      <SectionTitle>Terms of Deployment</SectionTitle>
      <Clause num="1" text={`The Worker agrees to be deployed to ${w.destinationCountry} for the position of ${w.jobTitle} under the terms specified by the employer.`} />
      <Clause num="2" text="The Agency shall facilitate all visa processing, documentation, and travel arrangements at the agreed service fee." />
      <Clause num="3" text="The Worker shall comply with all immigration laws and employment regulations of the destination country." />
      <Clause num="4" text="The deployment period shall be as specified in the employer's contract, typically twenty-four (24) months." />
      <Clause num="5" text="The Worker authorizes the Agency to process personal data as required for visa and employment processing." />
      <SignatureBlock names={[`${w.firstName} ${w.lastName}`, owner.name]} />
      <PdfFooter pageNum={1} totalPages={1} />
    </div>,
  ];
}

// ==================== EMPLOYER CONTRACT ====================
export function EmployerContractPages(project?: Project): React.ReactNode[] {
  const p = project || { name: 'Singapore Marina Bay Phase 3', employer: 'Hyundai E&C Singapore', country: 'Singapore', batchCode: 'SG_BATCH_01_2026', targetWorkers: 10 };
  const ref = `AGR-EMP-${new Date().getFullYear()}-${Math.floor(Math.random() * 999).toString().padStart(3, '0')}`;
  return [
    <div key="e1" className="px-10 pt-8 pb-16 text-[10px] relative h-full">
      <PdfHeader refNo={ref} title="Employer Service Contract" />
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
      <div className="bg-gray-50 rounded p-3 mb-4 text-[10px]">
        <p><strong>VisaHOBe PTE. LTD.</strong></p>
        <p className="text-gray-500">VisaMOTion Recruitment System</p>
      </div>
      <SectionTitle>Scope of Services</SectionTitle>
      <Clause num="1" text={`The Agency shall recruit, screen, and deploy up to ${p.targetWorkers} qualified workers for the ${p.name} project.`} />
      <Clause num="2" text="The Agency guarantees that all workers will meet the employer's specified qualifications and medical fitness requirements." />
      <Clause num="3" text="Workers who fail to meet performance standards within the probation period shall be replaced at no additional cost." />
      <Clause num="4" text="The Employer shall provide work permits, accommodation, and transportation as per local labor regulations." />
      <SectionTitle>Commercial Terms</SectionTitle>
      <Clause num="5" text="The service fee per worker shall be as agreed in Schedule A attached hereto." />
      <Clause num="6" text="Payment terms: 50% upon visa approval, 50% upon worker arrival at destination." />
      <Clause num="7" text="This contract is governed by the laws of the Republic of Singapore." />
      <SignatureBlock names={[owner.name, `${p.employer} Representative`]} />
      <PdfFooter pageNum={1} totalPages={1} />
    </div>,
  ];
}

// ==================== PAYMENT RECEIPT ====================
export function PaymentReceiptPages(payment?: Payment): React.ReactNode[] {
  const pay = payment || { id: 'pay1', amount: 3500, currency: 'SGD', description: 'Processing fee', date: '2026-01-20', status: 'paid' as const, type: 'worker_fee' as const };
  const receiptNo = `RCP-${new Date().getFullYear()}-${Math.floor(Math.random() * 9999).toString().padStart(4, '0')}`;
  return [
    <div key="r1" className="px-10 pt-8 pb-16 text-[10px] relative h-full">
      <PdfHeader refNo={receiptNo} title="Payment Receipt" />
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
      <div className="bg-gray-50 rounded p-3 mb-4 text-[10px]">
        <p><strong>VisaHOBe PTE. LTD.</strong></p>
        <p className="text-gray-500">Authorized by: {owner.name}</p>
      </div>
      <div className="mt-8 border-t border-gray-200 pt-4">
        <p className="text-[9px] text-gray-500 text-center italic">
          This is a system-generated receipt from the VisaMOTion Recruitment System. For queries, contact VisaHOBe PTE. LTD.
        </p>
      </div>
      <div className="mt-6">
        <div className="border-b border-gray-300 h-10 w-48 mb-1" />
        <p className="text-[10px] font-semibold text-[#1a1f36]">Authorized Signatory</p>
      </div>
      <PdfFooter pageNum={1} totalPages={1} />
    </div>,
  ];
}
