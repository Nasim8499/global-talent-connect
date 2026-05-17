export interface VisaType {
  name: string;
  category: "Tourist" | "Work" | "Work Permit" | "Residency" | "Investor" | "Student" | "Family";
  processingDays: string;
  govtFee: string;
  serviceFee: string;
  successRate: number;
  validity: string;
  stayDuration: string;
  summary: string;
}

export interface CountryInfo {
  slug: string;
  name: string;
  flag: string;
  region: string;
  capital: string;
  currency: string;
  language: string;
  tagline: string;
  heroGradient: string;
  popular?: boolean;
  riskScore: number; // 1-10 (10 = safest path)
  avgProcessing: string;
  embassy: { city: string; phone: string; email: string };
  overview: string;
  visaTypes: VisaType[];
  requiredDocs: string[];
  steps: { title: string; desc: string }[];
  faqs: { q: string; a: string }[];
  news: { title: string; date: string; summary: string }[];
}

const f = (name: string, args: Partial<VisaType>): VisaType => ({
  name,
  category: "Work",
  processingDays: "21-45 days",
  govtFee: "$180",
  serviceFee: "$350",
  successRate: 92,
  validity: "2 years",
  stayDuration: "Full validity",
  summary: "",
  ...args,
});

export const COUNTRIES: CountryInfo[] = [
  {
    slug: "singapore",
    name: "Singapore",
    flag: "🇸🇬",
    region: "Southeast Asia",
    capital: "Singapore",
    currency: "SGD",
    language: "English",
    tagline: "The world's most efficient work visa pipeline",
    heroGradient: "from-[#E63946] via-[#F1573D] to-[#003B73]",
    popular: true,
    riskScore: 9,
    avgProcessing: "14-21 days",
    embassy: { city: "Dhaka", phone: "+880-2-988-1077", email: "consular@sgembassy.bd" },
    overview:
      "Singapore offers a structured framework for foreign workers across construction, marine, manufacturing and services. Our team handles MOM submissions, IPA approvals and arrival formalities end-to-end.",
    visaTypes: [
      f("Work Permit (WP)", { category: "Work Permit", processingDays: "7-14 days", govtFee: "S$35", serviceFee: "$420", successRate: 96, validity: "2 years", stayDuration: "Up to 2 years", summary: "For semi-skilled migrant workers in approved sectors." }),
      f("S Pass", { category: "Work", processingDays: "14-21 days", govtFee: "S$105", serviceFee: "$550", successRate: 88, validity: "2 years", stayDuration: "Renewable", summary: "Mid-skilled technicians earning ≥ S$3,150/mo." }),
      f("Employment Pass (EP)", { category: "Work", processingDays: "21-30 days", govtFee: "S$225", serviceFee: "$780", successRate: 84, validity: "2 years", stayDuration: "Renewable up to 3 years", summary: "Professional, managerial roles ≥ S$5,000/mo." }),
      f("Dependant Pass", { category: "Family", processingDays: "7-10 days", govtFee: "S$225", serviceFee: "$280", successRate: 95, validity: "Tied to main pass", stayDuration: "Same as sponsor", summary: "For spouse & children of EP/S Pass holders." }),
      f("Tourist Visa", { category: "Tourist", processingDays: "3-5 days", govtFee: "S$30", serviceFee: "$60", successRate: 98, validity: "Up to 30 days", stayDuration: "30 days", summary: "Short visit for tourism or family." }),
    ],
    requiredDocs: ["Valid passport (6+ months)", "Passport-size photos", "Educational certificates", "Medical fitness report", "Police clearance certificate", "Skills assessment / trade test", "Employer IPA letter"],
    steps: [
      { title: "Profile & assessment", desc: "Upload passport, certificates, photos. Our OCR engine builds your file instantly." },
      { title: "Employer matching", desc: "We submit your profile to verified MOM-licensed employers." },
      { title: "IPA issued", desc: "Once selected, IPA arrives within 14-21 days." },
      { title: "Pre-departure", desc: "Medical, orientation, ticket and SG arrival card." },
      { title: "Arrival & SPass card", desc: "Fingerprint, photo and physical card collected in Singapore." },
    ],
    faqs: [
      { q: "How long does a Work Permit take?", a: "Typically 14-21 days from employer submission to IPA approval." },
      { q: "Can I bring my family?", a: "Only EP and S Pass holders earning above the threshold can sponsor dependants." },
      { q: "What is the minimum salary?", a: "S$1,600 for WP construction, S$3,150 for S Pass, S$5,000 for EP." },
    ],
    news: [
      { title: "MOM raises S Pass minimum salary to S$3,150", date: "2026-01-04", summary: "Effective Sept 2026, the qualifying salary increases." },
      { title: "New quick-track for marine sector workers", date: "2025-12-18", summary: "MOM cuts processing to 7 days for approved marine yards." },
    ],
  },
  {
    slug: "canada",
    name: "Canada",
    flag: "🇨🇦",
    region: "North America",
    capital: "Ottawa",
    currency: "CAD",
    language: "English / French",
    tagline: "PR pathways through Express Entry & PNP",
    heroGradient: "from-[#E63946] via-[#F1573D] to-[#177BBB]",
    popular: true,
    riskScore: 8,
    avgProcessing: "3-6 months",
    embassy: { city: "Dhaka", phone: "+880-2-5566-8444", email: "dhaka@international.gc.ca" },
    overview: "Canada continues to lead OECD nations in immigration intake with multiple pathways for skilled workers, students and entrepreneurs.",
    visaTypes: [
      f("Express Entry (FSW)", { category: "Residency", processingDays: "6 months", govtFee: "CA$1,365", serviceFee: "$1,200", successRate: 78, validity: "Permanent", stayDuration: "Indefinite", summary: "Federal Skilled Worker permanent residency." }),
      f("LMIA Work Permit", { category: "Work Permit", processingDays: "8-12 weeks", govtFee: "CA$1,000", serviceFee: "$950", successRate: 81, validity: "2-3 years", stayDuration: "Per LMIA", summary: "Employer-sponsored closed work permit." }),
      f("Study Permit", { category: "Student", processingDays: "8-12 weeks", govtFee: "CA$150", serviceFee: "$650", successRate: 72, validity: "Course duration", stayDuration: "Program + 90 days", summary: "For DLI-approved programs." }),
      f("Visitor Visa", { category: "Tourist", processingDays: "4-8 weeks", govtFee: "CA$100", serviceFee: "$180", successRate: 86, validity: "10 years", stayDuration: "6 months/visit", summary: "Multi-entry tourist visa." }),
    ],
    requiredDocs: ["Passport (6+ months)", "IELTS / TEF scores", "ECA from WES", "Proof of funds (CA$13,757+)", "Police certificate", "Medical exam (panel)"],
    steps: [
      { title: "Eligibility & CRS", desc: "We calculate your Express Entry CRS score." },
      { title: "Profile creation", desc: "Submit ECA, IELTS and create EE profile." },
      { title: "ITA & PR application", desc: "Once invited, submit full PR app within 60 days." },
      { title: "Biometrics & medicals", desc: "Complete at panel clinic and VFS Dhaka." },
      { title: "COPR & landing", desc: "Receive COPR and book your flight to Canada." },
    ],
    faqs: [
      { q: "What CRS score do I need?", a: "Recent draws have ranged between 481-530 for FSW." },
      { q: "Can I include my family?", a: "Yes, spouse and dependent children under 22." },
    ],
    news: [{ title: "IRCC announces 485,000 PR target for 2026", date: "2026-02-01", summary: "Levels Plan confirms steady intake." }],
  },
  {
    slug: "australia",
    name: "Australia",
    flag: "🇦🇺",
    region: "Oceania",
    capital: "Canberra",
    currency: "AUD",
    language: "English",
    tagline: "Skilled migration & 482 sponsored work visas",
    heroGradient: "from-[#177BBB] via-[#003B73] to-[#E63946]",
    popular: true,
    riskScore: 8,
    avgProcessing: "2-5 months",
    embassy: { city: "Dhaka", phone: "+880-2-881-3105", email: "ahc.dhaka@dfat.gov.au" },
    overview: "Australia's points-based skilled migration program and employer-sponsored TSS 482 stream remain top routes for trades and professionals.",
    visaTypes: [
      f("Subclass 482 TSS", { category: "Work", processingDays: "60-90 days", govtFee: "A$1,495", serviceFee: "$1,100", successRate: 79, validity: "2-4 years", stayDuration: "Per nomination", summary: "Employer-sponsored temporary skill shortage." }),
      f("Subclass 189 Skilled Independent", { category: "Residency", processingDays: "6-12 months", govtFee: "A$4,640", serviceFee: "$1,800", successRate: 65, validity: "Permanent", stayDuration: "Indefinite", summary: "Points-tested PR without sponsor." }),
      f("Subclass 500 Student", { category: "Student", processingDays: "4-6 weeks", govtFee: "A$710", serviceFee: "$680", successRate: 74, validity: "Course duration", stayDuration: "Course + 60 days", summary: "For CRICOS-registered courses." }),
    ],
    requiredDocs: ["Passport", "IELTS 6.0+", "Skills assessment (TRA/VETASSESS)", "Police checks", "Health insurance (OVHC)"],
    steps: [
      { title: "Skills assessment", desc: "Lodge with TRA / VETASSESS / ACS." },
      { title: "EOI in SkillSelect", desc: "Submit Expression of Interest." },
      { title: "Visa application", desc: "Lodge within 60 days of invitation." },
      { title: "Health & character", desc: "Bupa medical and AFP-equivalent PCC." },
      { title: "Grant & travel", desc: "Receive grant letter, book flight." },
    ],
    faqs: [{ q: "What is the points cutoff?", a: "Most invitations require 85+ points in 2026 rounds." }],
    news: [{ title: "189 invitation rounds resume monthly", date: "2026-01-12", summary: "DOHA confirms monthly SkillSelect rounds." }],
  },
  {
    slug: "uk",
    name: "United Kingdom",
    flag: "🇬🇧",
    region: "Europe",
    capital: "London",
    currency: "GBP",
    language: "English",
    tagline: "Skilled Worker & Health & Care Worker routes",
    heroGradient: "from-[#003B73] via-[#177BBB] to-[#E63946]",
    popular: true,
    riskScore: 7,
    avgProcessing: "3-8 weeks",
    embassy: { city: "Dhaka", phone: "+880-2-985-7423", email: "ukinbangladesh@fco.gov.uk" },
    overview: "The UK Skilled Worker route requires a Certificate of Sponsorship from a Home Office licensed sponsor.",
    visaTypes: [
      f("Skilled Worker", { category: "Work", processingDays: "3 weeks", govtFee: "£719-£1,500", serviceFee: "$1,250", successRate: 83, validity: "5 years", stayDuration: "Renewable", summary: "Requires CoS from licensed sponsor." }),
      f("Health & Care Worker", { category: "Work", processingDays: "3 weeks", govtFee: "£284", serviceFee: "$890", successRate: 91, validity: "5 years", stayDuration: "Renewable", summary: "Reduced fee, exempt from IHS." }),
      f("Student Visa", { category: "Student", processingDays: "3 weeks", govtFee: "£490", serviceFee: "$650", successRate: 88, validity: "Course duration", stayDuration: "Course + 4 months", summary: "Requires CAS from UK university." }),
      f("Visitor Visa", { category: "Tourist", processingDays: "3 weeks", govtFee: "£115", serviceFee: "$160", successRate: 84, validity: "6 months", stayDuration: "6 months", summary: "Standard tourist & business visit." }),
    ],
    requiredDocs: ["Passport", "Certificate of Sponsorship", "English proof (IELTS UKVI/B1)", "TB test certificate", "Maintenance funds (£1,270)"],
    steps: [
      { title: "Sponsor & CoS", desc: "Employer issues Certificate of Sponsorship." },
      { title: "Online application", desc: "Complete UKVI application and pay IHS." },
      { title: "Biometrics at VFS", desc: "Attend Dhaka VFS for fingerprints." },
      { title: "Decision", desc: "Standard decision within 3 weeks." },
      { title: "BRP collection", desc: "Collect BRP within 10 days of arrival." },
    ],
    faqs: [{ q: "Do I need IELTS?", a: "Yes, B1 CEFR for most Skilled Worker routes unless exempt." }],
    news: [{ title: "Salary threshold raised to £38,700", date: "2026-04-04", summary: "New minimums for Skilled Worker route in effect." }],
  },
  { slug: "usa", name: "United States", flag: "🇺🇸", region: "North America", capital: "Washington D.C.", currency: "USD", language: "English", tagline: "H-1B, H-2B, EB & B1/B2 pathways", heroGradient: "from-[#003B73] via-[#E63946] to-[#F1573D]", popular: true, riskScore: 6, avgProcessing: "2-6 months", embassy: { city: "Dhaka", phone: "+880-2-5566-2000", email: "dhakaconsular@state.gov" }, overview: "The US offers temporary work (H), employment-based PR (EB) and visitor (B1/B2) categories with strong demand from tech, healthcare and agriculture.", visaTypes: [f("H-1B Specialty Occupation", { category: "Work", processingDays: "3-6 months", govtFee: "$780+", serviceFee: "$1,800", successRate: 62, validity: "3 years", stayDuration: "Renewable to 6", summary: "Annual lottery, requires bachelor's." }), f("H-2B Non-agricultural", { category: "Work", processingDays: "60-90 days", govtFee: "$460", serviceFee: "$1,100", successRate: 71, validity: "Up to 1 year", stayDuration: "Seasonal", summary: "Seasonal/peak load workers." }), f("EB-3 Skilled Worker", { category: "Residency", processingDays: "18-36 months", govtFee: "$1,225", serviceFee: "$2,800", successRate: 58, validity: "Permanent", stayDuration: "Indefinite", summary: "Employment-based green card." }), f("B1/B2 Visitor", { category: "Tourist", processingDays: "2-4 weeks", govtFee: "$185", serviceFee: "$220", successRate: 67, validity: "10 years", stayDuration: "6 months/visit", summary: "Tourism + business." })], requiredDocs: ["Passport", "DS-160 confirmation", "I-797 approval (work)", "Employer support letter", "Financial proof"], steps: [{ title: "Petition filing", desc: "Employer files I-129 (work) or I-140 (EB)." }, { title: "Approval & DS-160", desc: "Once approved, complete DS-160 online." }, { title: "Embassy interview", desc: "Attend Dhaka embassy interview." }, { title: "Visa stamping", desc: "Passport returned with visa stamp." }, { title: "Port of entry", desc: "CBP inspection upon arrival." }], faqs: [{ q: "What is the H-1B lottery?", a: "USCIS conducts an annual electronic registration in March." }], news: [{ title: "H-1B registration fee rises to $215", date: "2026-03-10", summary: "USCIS updates electronic registration fee." }] },
  { slug: "italy", name: "Italy", flag: "🇮🇹", region: "Europe", capital: "Rome", currency: "EUR", language: "Italian", tagline: "Decreto Flussi work quotas & seasonal permits", heroGradient: "from-[#177BBB] via-[#E63946] to-[#F1573D]", popular: true, riskScore: 7, avgProcessing: "3-8 months", embassy: { city: "Dhaka", phone: "+880-2-988-2734", email: "ambasciata.dhaka@esteri.it" }, overview: "Italy's annual Decreto Flussi allocates work permit quotas across sectors. Bangladeshi workers compete for both seasonal and non-seasonal slots.", visaTypes: [f("Decreto Flussi Work Permit", { category: "Work Permit", processingDays: "4-8 months", govtFee: "€116", serviceFee: "$900", successRate: 64, validity: "2 years", stayDuration: "Per contract", summary: "Non-seasonal subordinate work." }), f("Seasonal Work Visa", { category: "Work", processingDays: "2-4 months", govtFee: "€116", serviceFee: "$650", successRate: 76, validity: "9 months", stayDuration: "Seasonal", summary: "Agriculture & tourism sectors." }), f("Student Visa", { category: "Student", processingDays: "1-2 months", govtFee: "€50", serviceFee: "$520", successRate: 81, validity: "Course duration", stayDuration: "Course", summary: "Italian university enrollment." }), f("Schengen Tourist", { category: "Tourist", processingDays: "15 days", govtFee: "€90", serviceFee: "$140", successRate: 78, validity: "90 days", stayDuration: "90/180 days", summary: "Schengen short-stay." })], requiredDocs: ["Passport", "Nulla Osta (work)", "Contract draft", "Accommodation proof", "Insurance"], steps: [{ title: "Nulla Osta from employer", desc: "Employer files at Sportello Unico." }, { title: "Visa application", desc: "Submit at Italian embassy Dhaka." }, { title: "Travel & Permesso", desc: "Within 8 days request Permesso di Soggiorno." }, { title: "Codice Fiscale", desc: "Obtain tax code in Italy." }], faqs: [{ q: "What is Click Day?", a: "The day applications open for Decreto Flussi quotas." }], news: [{ title: "Decreto Flussi 2026 quotas: 165,000 slots", date: "2025-12-27", summary: "Government confirms three click days." }] },
  { slug: "uae", name: "United Arab Emirates", flag: "🇦🇪", region: "Middle East", capital: "Abu Dhabi", currency: "AED", language: "Arabic / English", tagline: "Golden Visa & employment work permits", heroGradient: "from-[#003B73] via-[#177BBB] to-[#F1573D]", popular: true, riskScore: 9, avgProcessing: "10-20 days", embassy: { city: "Dhaka", phone: "+880-2-882-2273", email: "dhaka@mofa.gov.ae" }, overview: "The UAE issues employment, investor and golden visas through MoHRE and ICA. Fast turnaround and digital workflows make it the top choice for South Asian workers.", visaTypes: [f("Employment Visa", { category: "Work", processingDays: "10-15 days", govtFee: "AED 350+", serviceFee: "$420", successRate: 94, validity: "2 years", stayDuration: "Renewable", summary: "Standard employment residence." }), f("Golden Visa", { category: "Residency", processingDays: "30 days", govtFee: "AED 2,800", serviceFee: "$1,400", successRate: 88, validity: "10 years", stayDuration: "Long-term", summary: "Investors, talents & specialists." }), f("Tourist Visa 30/60-day", { category: "Tourist", processingDays: "3-5 days", govtFee: "AED 350", serviceFee: "$95", successRate: 97, validity: "60 days", stayDuration: "60 days", summary: "Single-entry tourist." })], requiredDocs: ["Passport", "Photos", "Medical fitness", "Emirates ID application", "Tawjeeh certificate"], steps: [{ title: "Entry permit", desc: "Employer applies via MoHRE." }, { title: "Travel to UAE", desc: "Enter on pink permit, 60-day validity." }, { title: "Medical & Emirates ID", desc: "Complete at preventive medicine centre." }, { title: "Visa stamping", desc: "Passport stamped at GDRFA." }], faqs: [{ q: "Can I switch employers?", a: "Yes, after probation with NOC or after contract end." }], news: [{ title: "UAE launches blue visa for environment workers", date: "2026-01-30", summary: "10-year blue visa for sustainability talent." }] },
  { slug: "saudi-arabia", name: "Saudi Arabia", flag: "🇸🇦", region: "Middle East", capital: "Riyadh", currency: "SAR", language: "Arabic", tagline: "Iqama work visas through Musaned", heroGradient: "from-[#003B73] via-[#177BBB] to-[#E63946]", riskScore: 8, avgProcessing: "15-30 days", embassy: { city: "Dhaka", phone: "+880-2-988-2147", email: "bdemb@mofa.gov.sa" }, overview: "Saudi Arabia uses the Musaned platform for domestic workers and Qiwa for general employment. Vision 2030 has expanded job opportunities significantly.", visaTypes: [f("Work Visa (Qiwa)", { category: "Work", processingDays: "15-25 days", govtFee: "SAR 2,000", serviceFee: "$380", successRate: 90, validity: "1-2 years", stayDuration: "Renewable", summary: "General employment iqama." }), f("Domestic Worker (Musaned)", { category: "Work", processingDays: "20-30 days", govtFee: "SAR 1,500", serviceFee: "$260", successRate: 92, validity: "2 years", stayDuration: "Renewable", summary: "Household workers." }), f("Umrah Visa", { category: "Tourist", processingDays: "3-5 days", govtFee: "SAR 300", serviceFee: "$80", successRate: 99, validity: "30 days", stayDuration: "30 days", summary: "Pilgrimage visa." })], requiredDocs: ["Passport", "Medical (GAMCA)", "Trade test", "Power of attorney", "Enjaz application"], steps: [{ title: "Visa stamping at Enjaz", desc: "After GAMCA medical and trade test." }, { title: "Travel & arrival", desc: "Fingerprint at Saudi airport." }, { title: "Iqama issuance", desc: "Employer issues within 90 days." }], faqs: [{ q: "What is GAMCA?", a: "Mandatory medical screening for Gulf countries." }], news: [{ title: "Saudi opens tourism visa for Bangladesh", date: "2025-11-15", summary: "eVisa now available to BD passport holders." }] },
  { slug: "qatar", name: "Qatar", flag: "🇶🇦", region: "Middle East", capital: "Doha", currency: "QAR", language: "Arabic", tagline: "Post-WC infrastructure & service sector demand", heroGradient: "from-[#003B73] via-[#E63946] to-[#177BBB]", riskScore: 8, avgProcessing: "20-30 days", embassy: { city: "Dhaka", phone: "+880-2-988-1102", email: "dhaka@mofa.gov.qa" }, overview: "Qatar continues to recruit skilled labour for hospitality, healthcare and infrastructure projects.", visaTypes: [f("Work Visa", { category: "Work", processingDays: "20-30 days", govtFee: "QAR 200", serviceFee: "$380", successRate: 88, validity: "1-3 years", stayDuration: "Renewable", summary: "Employer-sponsored work residence." }), f("Family Visa", { category: "Family", processingDays: "30 days", govtFee: "QAR 200", serviceFee: "$420", successRate: 85, validity: "Tied to sponsor", stayDuration: "Renewable", summary: "Dependants of QID holders." })], requiredDocs: ["Passport", "Medical (GAMCA)", "Educational attestation", "Police clearance"], steps: [{ title: "Visa quota & approval", desc: "Employer obtains MoL approval." }, { title: "Medical & fingerprint", desc: "Complete pre-departure & post-arrival." }, { title: "QID issuance", desc: "Within 90 days of arrival." }], faqs: [], news: [] },
  { slug: "kuwait", name: "Kuwait", flag: "🇰🇼", region: "Middle East", capital: "Kuwait City", currency: "KWD", language: "Arabic", tagline: "Article 18 private sector visas", heroGradient: "from-[#003B73] via-[#177BBB] to-[#E63946]", riskScore: 7, avgProcessing: "30-45 days", embassy: { city: "Dhaka", phone: "+880-2-988-2778", email: "embkwt.dhaka@mofa.gov.kw" }, overview: "Kuwait's Article 18 (private) and Article 20 (domestic) visas remain primary routes for migrant workers.", visaTypes: [f("Article 18 Work Visa", { category: "Work", processingDays: "30-45 days", govtFee: "KWD 10", serviceFee: "$340", successRate: 84, validity: "1 year", stayDuration: "Renewable", summary: "Private sector employment." }), f("Article 20 Domestic", { category: "Work", processingDays: "30 days", govtFee: "KWD 10", serviceFee: "$280", successRate: 90, validity: "1 year", stayDuration: "Renewable", summary: "Domestic workers." })], requiredDocs: ["Passport", "Medical", "Attested certificates"], steps: [{ title: "Manpower approval", desc: "Employer gets PAM clearance." }, { title: "Visa stamping", desc: "At Kuwait embassy Dhaka." }, { title: "Civil ID", desc: "Issued within 60 days." }], faqs: [], news: [] },
  { slug: "malaysia", name: "Malaysia", flag: "🇲🇾", region: "Southeast Asia", capital: "Kuala Lumpur", currency: "MYR", language: "Malay / English", tagline: "Plantation, manufacturing & services", heroGradient: "from-[#177BBB] via-[#003B73] to-[#E63946]", riskScore: 7, avgProcessing: "30-60 days", embassy: { city: "Dhaka", phone: "+880-2-988-3043", email: "mwdhaka@imi.gov.my" }, overview: "Malaysia recruits foreign workers under FWCMS for plantation, manufacturing, services and construction.", visaTypes: [f("PLKS Work Visa", { category: "Work Permit", processingDays: "30-60 days", govtFee: "MYR 125", serviceFee: "$420", successRate: 80, validity: "1 year", stayDuration: "Renewable up to 10", summary: "Standard foreign worker permit." }), f("Tourist Visa", { category: "Tourist", processingDays: "5-7 days", govtFee: "MYR 50", serviceFee: "$60", successRate: 96, validity: "3 months", stayDuration: "30 days", summary: "Single-entry tourist." })], requiredDocs: ["Passport", "Medical (FOMEMA)", "FWCMS approval"], steps: [{ title: "Calling visa", desc: "Employer obtains VDR." }, { title: "Travel & FOMEMA", desc: "Post-arrival medical." }, { title: "PLKS issuance", desc: "Permit affixed in passport." }], faqs: [], news: [] },
  { slug: "japan", name: "Japan", flag: "🇯🇵", region: "East Asia", capital: "Tokyo", currency: "JPY", language: "Japanese", tagline: "SSW & Technical Intern Trainee programs", heroGradient: "from-[#E63946] via-[#F1573D] to-[#003B73]", riskScore: 9, avgProcessing: "2-4 months", embassy: { city: "Dhaka", phone: "+880-2-984-0011", email: "consular@dh.mofa.go.jp" }, overview: "Japan's Specified Skilled Worker (SSW) program offers long-term employment in 14 high-demand sectors.", visaTypes: [f("SSW (i) Specified Skilled", { category: "Work", processingDays: "2-3 months", govtFee: "¥4,000", serviceFee: "$1,200", successRate: 76, validity: "5 years", stayDuration: "Total 5 years", summary: "Test-based skilled worker." }), f("Technical Intern Trainee", { category: "Work", processingDays: "3-4 months", govtFee: "¥4,000", serviceFee: "$1,400", successRate: 82, validity: "3-5 years", stayDuration: "Per program", summary: "TITP under OTIT." }), f("Student Visa", { category: "Student", processingDays: "2 months", govtFee: "¥3,000", serviceFee: "$780", successRate: 71, validity: "Course duration", stayDuration: "Course", summary: "Language school or university." })], requiredDocs: ["Passport", "JLPT N4+ / SSW exam pass", "COE from sponsor", "Financial proof"], steps: [{ title: "JLPT & skill test", desc: "Pass JFT-Basic + sector skills test." }, { title: "COE issuance", desc: "Sponsor applies at Immigration Bureau." }, { title: "Visa stamping", desc: "At Japanese embassy Dhaka." }, { title: "Residence card", desc: "Issued at Japanese port of entry." }], faqs: [{ q: "Is JLPT mandatory?", a: "JFT-Basic A2 is accepted for most SSW sectors." }], news: [{ title: "SSW expanded to logistics & forestry", date: "2026-03-29", summary: "Government adds new sectors to SSW(i)." }] },
  { slug: "south-korea", name: "South Korea", flag: "🇰🇷", region: "East Asia", capital: "Seoul", currency: "KRW", language: "Korean", tagline: "EPS-TOPIK roster for manufacturing & agriculture", heroGradient: "from-[#003B73] via-[#177BBB] to-[#E63946]", riskScore: 8, avgProcessing: "3-6 months", embassy: { city: "Dhaka", phone: "+880-2-5566-2891", email: "embbgd@mofa.go.kr" }, overview: "South Korea's Employment Permit System (EPS) requires TOPIK and CBT passage. BMET manages the Bangladeshi roster.", visaTypes: [f("E-9 EPS", { category: "Work", processingDays: "3-6 months", govtFee: "KRW 60,000", serviceFee: "$680", successRate: 70, validity: "4 yr 10 mo", stayDuration: "Renewable", summary: "EPS-TOPIK roster placement." }), f("D-2 Student", { category: "Student", processingDays: "1-2 months", govtFee: "KRW 60,000", serviceFee: "$640", successRate: 78, validity: "Course duration", stayDuration: "Course", summary: "University study." })], requiredDocs: ["Passport", "EPS-TOPIK pass", "Skills test", "Medical"], steps: [{ title: "Register with BMET", desc: "Apply for EPS-TOPIK roster." }, { title: "Test & roster", desc: "Pass TOPIK + skill test." }, { title: "Job matching", desc: "Korean employer selects from roster." }, { title: "Visa & travel", desc: "Visa issued, fly out via HRD Korea." }], faqs: [], news: [] },
  { slug: "serbia", name: "Serbia", flag: "🇷🇸", region: "Europe", capital: "Belgrade", currency: "RSD", language: "Serbian", tagline: "Affordable EU-adjacent work permits", heroGradient: "from-[#003B73] via-[#E63946] to-[#177BBB]", riskScore: 7, avgProcessing: "30-60 days", embassy: { city: "New Delhi", phone: "+91-11-2611-2521", email: "embassy.newdelhi@mfa.rs" }, overview: "Serbia issues unified residence + work permits with relatively low thresholds, popular for construction and IT.", visaTypes: [f("Unified Work Permit", { category: "Work Permit", processingDays: "30-60 days", govtFee: "€100", serviceFee: "$650", successRate: 82, validity: "1-3 years", stayDuration: "Renewable", summary: "Combined residence + work." }), f("D Visa Long-stay", { category: "Residency", processingDays: "30 days", govtFee: "€60", serviceFee: "$320", successRate: 85, validity: "180 days entry", stayDuration: "Per permit", summary: "Long-stay national visa." })], requiredDocs: ["Passport", "Employment contract", "Accommodation proof", "Health insurance"], steps: [{ title: "Employer permit", desc: "Employer obtains work permit approval." }, { title: "D-visa from New Delhi", desc: "Apply at Serbian embassy India." }, { title: "Residence permit", desc: "Apply within 30 days of arrival." }], faqs: [], news: [] },
  { slug: "moldova", name: "Moldova", flag: "🇲🇩", region: "Europe", capital: "Chișinău", currency: "MDL", language: "Romanian", tagline: "EU border country with simple work permits", heroGradient: "from-[#177BBB] via-[#003B73] to-[#F1573D]", riskScore: 6, avgProcessing: "45-75 days", embassy: { city: "New Delhi", phone: "+91-11-2611-1801", email: "newdelhi@mfa.md" }, overview: "Moldova offers gateway access to Eastern Europe with growing demand for construction and agri workers.", visaTypes: [f("Work Permit", { category: "Work Permit", processingDays: "45-75 days", govtFee: "€280", serviceFee: "$720", successRate: 74, validity: "1 year", stayDuration: "Renewable", summary: "Employer-sponsored." })], requiredDocs: ["Passport", "Employer invitation", "Medical", "Police clearance"], steps: [{ title: "Invitation by employer", desc: "Approved by Migration Bureau." }, { title: "D-visa from New Delhi", desc: "Single-entry long stay." }, { title: "Residence permit", desc: "Issued in Chișinău." }], faqs: [], news: [] },
  { slug: "lithuania", name: "Lithuania", flag: "🇱🇹", region: "Europe (EU)", capital: "Vilnius", currency: "EUR", language: "Lithuanian", tagline: "Schengen EU member with quick D-visas", heroGradient: "from-[#003B73] via-[#177BBB] to-[#E63946]", riskScore: 8, avgProcessing: "30-45 days", embassy: { city: "New Delhi", phone: "+91-11-4310-0900", email: "amb.in@urm.lt" }, overview: "Lithuania is a popular EU destination for South Asian workers via the National D visa scheme.", visaTypes: [f("National D Visa (Work)", { category: "Work", processingDays: "30-45 days", govtFee: "€120", serviceFee: "$850", successRate: 78, validity: "1 year", stayDuration: "Per contract", summary: "Long-stay national visa." }), f("Schengen Tourist", { category: "Tourist", processingDays: "15 days", govtFee: "€90", serviceFee: "$140", successRate: 80, validity: "90 days", stayDuration: "90/180", summary: "Short stay Schengen." })], requiredDocs: ["Passport", "Mediation letter (UTPB)", "Accommodation", "Medical insurance"], steps: [{ title: "Mediation letter", desc: "Employer obtains from Employment Service." }, { title: "Visa at New Delhi", desc: "Submit at VFS New Delhi." }, { title: "Residence permit (TLP)", desc: "Apply within 3 months of arrival." }], faqs: [], news: [] },
  { slug: "estonia", name: "Estonia", flag: "🇪🇪", region: "Europe (EU)", capital: "Tallinn", currency: "EUR", language: "Estonian", tagline: "Digital-first Schengen residency", heroGradient: "from-[#177BBB] via-[#003B73] to-[#E63946]", riskScore: 8, avgProcessing: "30-60 days", embassy: { city: "New Delhi", phone: "+91-11-4948-8650", email: "embassy.newdelhi@mfa.ee" }, overview: "Estonia's e-Residency and short-term employment registration system are renowned for transparency and speed.", visaTypes: [f("D Visa Employment", { category: "Work", processingDays: "30-60 days", govtFee: "€100", serviceFee: "$880", successRate: 76, validity: "1 year", stayDuration: "Per contract", summary: "Short-term employment registration." }), f("Digital Nomad Visa", { category: "Residency", processingDays: "30 days", govtFee: "€100", serviceFee: "$640", successRate: 82, validity: "1 year", stayDuration: "1 year", summary: "Remote workers." })], requiredDocs: ["Passport", "Employment registration", "Salary proof (≥ EE avg)"], steps: [{ title: "Employer registration", desc: "Register at PBGB." }, { title: "Visa at New Delhi", desc: "Apply at VFS." }, { title: "Residence card", desc: "Within 90 days of arrival." }], faqs: [], news: [] },
];

export const getCountryBySlug = (slug: string) => COUNTRIES.find((c) => c.slug === slug);
