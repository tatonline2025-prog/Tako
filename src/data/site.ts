import type { Locale } from "@/lib/i18n";

export type NavigationItem = {
  href: string;
  label: string;
};

export type Category = {
  slug: string;
  name: string;
  description: { en: string; vi: string };
  applications: string[];
};

export type Product = {
  slug: string;
  name: { en: string; vi: string };
  category: string;
  categoryName: { en: string; vi: string };
  subcategory: string;
  manufacturer: string;
  applications: string[];
  shortDescription: { en: string; vi: string };
  description: { en: string; vi: string };
  highlights: { en: string; vi: string }[];
  imageLabel: string;
  imageTone: string;
  pdfPath: string;
  featured: boolean;
};

export type NewsArticle = {
  slug: string;
  title: { en: string; vi: string };
  excerpt: { en: string; vi: string };
  date: string;
  tag: string;
};

type SiteMetadata = {
  companyName: string;
  legalName: string;
  tagline: string;
  description: string;
  address: string;
  hotline: string;
  email: string;
  zaloUrl: string;
};

const localizedSiteMetadata: Record<Locale, SiteMetadata> = {
  en: {
    companyName: "TAKO Vietnam",
    legalName: "TAKO Vietnam Trading Joint Stock Company",
    tagline: "Integrated technology solutions for healthcare and scientific research",
    description:
      "TAKO Vietnam distributes biotechnology equipment, reagents, and solutions for laboratories, hospitals, research centers, and biotech enterprises.",
    address: "Hanoi, Vietnam",
    hotline: "+84 868 946 894",
    email: "contact@takovietnam.vn",
    zaloUrl: "https://zalo.me/0868946894",
  },
  vi: {
    companyName: "TAKO Vietnam",
    legalName: "Công ty Cổ phần Thương mại TAKO Việt Nam",
    tagline: "Giải pháp công nghệ toàn diện cho y tế và nghiên cứu khoa học",
    description:
      "TAKO Vietnam phân phối thiết bị, sinh phẩm và giải pháp công nghệ sinh học cho phòng xét nghiệm, bệnh viện, trung tâm nghiên cứu và doanh nghiệp dược sinh học.",
    address: "Hà Nội, Việt Nam",
    hotline: "+84 868 946 894",
    email: "contact@takovietnam.vn",
    zaloUrl: "https://zalo.me/0868946894",
  },
};

const localizedNavigation: Record<Locale, NavigationItem[]> = {
  en: [
    { href: "/", label: "Home" },
    { href: "/gioi-thieu", label: "About" },
    { href: "/san-pham", label: "Products & Solutions" },
    { href: "/tin-tuc", label: "News" },
    { href: "/lien-he", label: "Contact" },
  ],
  vi: [
    { href: "/", label: "Trang chủ" },
    { href: "/gioi-thieu", label: "Giới thiệu" },
    { href: "/san-pham", label: "Sản phẩm / Giải pháp" },
    { href: "/tin-tuc", label: "Tin tức" },
    { href: "/lien-he", label: "Liên hệ" },
  ],
};

export function getSiteMetadata(locale: Locale) {
  return localizedSiteMetadata[locale];
}

export function getNavigationItems(locale: Locale) {
  return localizedNavigation[locale];
}

export const siteMetadata = getSiteMetadata("vi");

export const navigationItems: NavigationItem[] = getNavigationItems("vi");

export const companyHighlights: { en: string; vi: string }[] = [
  {
    en: "Aligned with Resolution 57-NQ/TW and 36-NQ/TW on strategic technology development and health sciences.",
    vi: "Định hướng theo Nghị quyết 57-NQ/TW và 36-NQ/TW về phát triển công nghệ chiến lược và khoa học sức khỏe.",
  },
  {
    en: "B2B-focused for laboratories, hospitals, research institutes, quality control centers and biotech enterprises.",
    vi: "Tập trung B2B cho phòng xét nghiệm, bệnh viện, viện nghiên cứu, cơ sở kiểm định và doanh nghiệp dược sinh học.",
  },
  {
    en: "Integrating equipment, reagents, workflows and support services to shorten time-to-deployment of new technologies.",
    vi: "Kết nối thiết bị, sinh phẩm, workflow và dịch vụ hỗ trợ để rút ngắn thời gian đưa công nghệ vào vận hành.",
  },
];

export const focusAreas: { en: string; vi: string }[] = [
  { en: "High-resolution Proteomics", vi: "Proteomics độ phân giải cao" },
  { en: "Next-generation gene sequencing (NGS)", vi: "Giải trình tự gene thế hệ mới" },
  { en: "Molecular diagnostics for hospitals and labs", vi: "Chẩn đoán sinh học phân tử cho bệnh viện và phòng lab" },
  { en: "Basic reagents and consumables", vi: "Sinh phẩm cơ bản và vật tư tiêu hao" },
];

export const partnerManufacturers = [
  "Quantum-Si",
  "MGI",
  "NadigmBio",
  "Igenetech",
  "Microbio",
  "Bioer",
  "GDSBio",
  "Esco",
];

export const categories: Category[] = [
  {
    slug: "proteomics",
    name: "Proteomics",
    description: {
      en: "Protein sequencing and analysis platforms for drug discovery and precision medicine.",
      vi: "Nền tảng giải trình tự và phân tích protein cho nghiên cứu thuốc và y học chính xác.",
    },
    applications: ["Proteomics", "Y học chính xác", "Drug discovery"],
  },
  {
    slug: "ngs",
    name: "NGS",
    description: {
      en: "Sequencing systems, chemistries and workflow automation for genomics diagnostics and research.",
      vi: "Hệ thống giải trình tự, hóa chất và tự động hóa workflow cho chẩn đoán và nghiên cứu genomics.",
    },
    applications: ["Ung thư", "Di truyền", "Sàng lọc trước sinh", "Dịch tễ học"],
  },
  {
    slug: "sinh-hoc-phan-tu",
    name: "Molecular Diagnostics",
    description: {
      en: "qPCR, PCR, extraction reagents and lab equipment for clinical testing and research.",
      vi: "qPCR, PCR, sinh phẩm tách chiết và thiết bị phòng lab cho xét nghiệm lâm sàng và nghiên cứu.",
    },
    applications: ["Truyền nhiễm", "Kháng kháng sinh", "HLA", "Chẩn đoán lâm sàng"],
  },
  {
    slug: "sinh-pham-co-ban",
    name: "Basic Reagents",
    description: {
      en: "Enzymes, buffers and extraction kits for routine and advanced molecular biology workflows.",
      vi: "Enzyme, buffer và kit tách chiết phục vụ workflow sinh học phân tử cơ bản và mở rộng.",
    },
    applications: ["PCR", "qPCR", "NGS"],
  },
  {
    slug: "khac",
    name: "Others",
    description: {
      en: "Accessories, chemicals and consumables for routine laboratory operations.",
      vi: "Phụ kiện, hóa chất và vật tư tiêu hao cho hoạt động thường quy của phòng thí nghiệm.",
    },
    applications: ["Vật tư tiêu hao", "Hóa chất", "Phụ kiện phòng lab"],
  },
];

export const products: Product[] = [
  {
    slug: "platinum-pro-protein-sequencer",
    name: { en: "Platinum Pro Protein Analysis System", vi: "Hệ thống phân tích protein Platinum Pro" },
    category: "proteomics",
    categoryName: { en: "Proteomics", vi: "Proteomics" },
    subcategory: "Hệ thống phân tích protein Platinum Pro",
    manufacturer: "Quantum-Si",
    applications: ["Proteomics", "PTM", "Drug discovery", "Y học chính xác"],
    shortDescription: {
      en: "Single-molecule protein sequencing system based on semiconductor chip, automated and compact.",
      vi: "Hệ thống giải trình tự protein đơn phân tử dựa trên chip bán dẫn, tự động hóa và kích thước nhỏ gọn.",
    },
    description: {
      en: "Quantum-Si provides the world's first single-molecule protein sequencing technology, enabling amino acid identification and post-translational modifications at high resolution. The platform is ideal for research labs needing fast protein data at an affordable cost, with scalability for drug discovery and precision diagnostics.",
      vi: "Quantum-Si cung cấp công nghệ giải trình tự protein đơn phân tử đầu tiên trên thế giới, cho phép xác định acid amin và các biến đổi sau dịch mã với độ phân giải cao. Nền tảng phù hợp cho phòng nghiên cứu cần dữ liệu protein nhanh, chi phí hợp lý và khả năng mở rộng để phục vụ phát hiện thuốc và chẩn đoán chính xác.",
    },
    highlights: [
      { en: "Semiconductor chip enables fast protein data readout", vi: "Chip bán dẫn cho phép đọc dữ liệu protein nhanh" },
      { en: "Supports PTM detection at high resolution", vi: "Hỗ trợ phát hiện PTM ở mức độ chi tiết" },
      { en: "Compact design, easy to integrate into existing labs", vi: "Kích thước nhỏ gọn, dễ đưa vào phòng thí nghiệm hiện hữu" },
    ],
    imageLabel: "Quantum-Si Platinum Pro",
    imageTone: "from-sky-500 to-cyan-300",
    pdfPath: "/api/catalog/platinum-pro-protein-sequencer",
    featured: true,
  },
  {
    slug: "mgi-sequencer",
    name: { en: "MGI DNA Sequencer", vi: "Máy giải trình tự MGI" },
    category: "ngs",
    categoryName: { en: "NGS", vi: "Giải trình tự gene thế hệ mới (NGS)" },
    subcategory: "Máy giải trình tự MGI",
    manufacturer: "MGI",
    applications: ["Ung thư", "Di truyền", "Sinh thiết lỏng", "Chẩn đoán thường quy"],
    shortDescription: {
      en: "NGS platform for routine diagnostics and genetic variant detection with sensitivity down to 0.01%.",
      vi: "Nền tảng NGS cho chẩn đoán thường quy và phát hiện tổn thương di truyền với ngưỡng phát hiện đến 0,01%.",
    },
    description: {
      en: "MGI systems target NGS workflows for clinical laboratories, supporting detection of genetic alterations from tumor tissue and liquid biopsy samples. Diagnostic panels are updated per NCCN and ESMO guidelines, helping diagnostic centers expand routine genomics capabilities.",
      vi: "Hệ thống MGI hướng tới workflow NGS cho phòng xét nghiệm lâm sàng, hỗ trợ phát hiện biến đổi di truyền từ mô ung thư và máu sinh thiết lỏng. Panel chẩn đoán được cập nhật theo khuyến cáo NCCN và ESMO, hỗ trợ đơn vị chẩn đoán mở rộng năng lực genomics thường quy.",
    },
    highlights: [
      { en: "Detection sensitivity down to 0.01%", vi: "Ngưỡng phát hiện xuống đến 0,01%" },
      { en: "Compatible with tumor tissue and liquid biopsy samples", vi: "Phù hợp cho mẫu mô ung thư và sinh thiết lỏng" },
      { en: "Integrable into routine diagnostic workflows", vi: "Có thể tích hợp vào quy trình chẩn đoán thường quy" },
    ],
    imageLabel: "MGI Sequencer",
    imageTone: "from-blue-600 to-indigo-400",
    pdfPath: "/api/catalog/mgi-sequencer",
    featured: true,
  },
  {
    slug: "ngs-reagents",
    name: { en: "NGS Reagents & Workflow Kits", vi: "Hóa chất phục vụ NGS" },
    category: "ngs",
    categoryName: { en: "NGS", vi: "Giải trình tự gene thế hệ mới (NGS)" },
    subcategory: "Hóa chất phục vụ NGS",
    manufacturer: "NadigmBio / Igenetech",
    applications: ["Ung thư", "Di truyền", "Sàng lọc trước sinh", "Dịch tễ học"],
    shortDescription: {
      en: "Complete reagents and workflow from library preparation to NGS data analysis.",
      vi: "Hóa chất và workflow toàn diện từ chuẩn bị thư viện đến phân tích dữ liệu NGS.",
    },
    description: {
      en: "TAKO Vietnam directly imports reagents and kits from NadigmBio and Igenetech to support end-to-end NGS workflows. The solution covers oncology, hereditary disease, prenatal screening and epidemiological surveillance, with optimized process stability and consistency.",
      vi: "TAKO Vietnam nhập khẩu trực tiếp hóa chất và bộ kit từ NadigmBio và Igenetech, phục vụ quy trình NGS trọn vẹn. Giải pháp hỗ trợ ứng dụng trong ung thư, bệnh di truyền, sàng lọc trước sinh và giám sát dịch tễ học với mục tiêu tối ưu hóa độ ổn định và tính nhất quán của quy trình.",
    },
    highlights: [
      { en: "Complete components for full NGS workflow", vi: "Đầy đủ thành phần cho workflow NGS" },
      { en: "Supports diverse clinical and research applications", vi: "Hỗ trợ nhiều bài toán lâm sàng và nghiên cứu" },
      { en: "Designed for laboratory workflow standardization", vi: "Thích hợp để chuẩn hóa quy trình phòng xét nghiệm" },
    ],
    imageLabel: "NGS Reagents",
    imageTone: "from-cyan-500 to-sky-300",
    pdfPath: "/api/catalog/ngs-reagents",
    featured: true,
  },
  {
    slug: "mgisp-library-prep",
    name: { en: "MGISP Automated Library Preparation System", vi: "Máy chuẩn bị thư viện tự động MGISP" },
    category: "ngs",
    categoryName: { en: "NGS", vi: "Giải trình tự gene thế hệ mới (NGS)" },
    subcategory: "Máy chuẩn bị thư viện tự động (MGISP)",
    manufacturer: "MGI",
    applications: ["NGS", "Tự động hóa", "Phòng xét nghiệm"],
    shortDescription: {
      en: "Automated library preparation system for NGS, reducing errors and saving lab personnel time.",
      vi: "Hệ thống tự động hóa khâu chuẩn bị thư viện cho NGS, giảm sai số và tiết kiệm nhân lực.",
    },
    description: {
      en: "MGISP automates the library preparation step for NGS, helping labs improve result consistency and free staff from repetitive manual tasks. Ideal for facilities that need to scale throughput while maintaining quality control.",
      vi: "MGISP tự động hóa bước chuẩn bị thư viện cho NGS, giúp phòng xét nghiệm nâng cao tính đồng nhất kết quả và giải phóng nhân sự khỏi các thao tác lặp lại. Giải pháp phù hợp cho đơn vị cần mở rộng công suất mà vẫn kiểm soát được chất lượng quy trình.",
    },
    highlights: [
      { en: "Standardized library preparation process", vi: "Đồng nhất hóa thao tác lập thư viện" },
      { en: "Reduces manual operation time", vi: "Giảm thời gian thao tác thủ công" },
      { en: "Suitable for labs scaling up capacity", vi: "Phù hợp cho phòng lab cần mở rộng công suất" },
    ],
    imageLabel: "MGISP Automation",
    imageTone: "from-indigo-500 to-sky-400",
    pdfPath: "/api/catalog/mgisp-library-prep",
    featured: false,
  },
  {
    slug: "microbio-sepsis-qpcr",
    name: { en: "Infectious Disease & Sepsis Molecular Solution", vi: "Giải pháp bệnh truyền nhiễm và sepsis" },
    category: "sinh-hoc-phan-tu",
    categoryName: { en: "Molecular Diagnostics", vi: "Giải pháp xét nghiệm sinh học phân tử" },
    subcategory: "Bệnh truyền nhiễm",
    manufacturer: "Microbio",
    applications: ["Truyền nhiễm", "Sepsis", "Kháng kháng sinh", "Bacteriophage"],
    shortDescription: {
      en: "Rapid sepsis diagnostic kit on qPCR platform, detecting pathogens directly from whole blood.",
      vi: "Kit chẩn đoán nhanh sepsis trên hệ thống qPCR, phát hiện trực tiếp tác nhân gây bệnh từ máu toàn phần.",
    },
    description: {
      en: "Microbio's solution shortens turnaround time in sepsis by directly detecting pathogens from whole blood on a qPCR platform. TAKO also provides reagents for bacteriophage isolation, identification and analysis for research and therapeutic applications.",
      vi: "Giải pháp của Microbio giúp rút ngắn thời gian trả kết quả trong bệnh cảnh sepsis bằng cách phát hiện trực tiếp tác nhân gây bệnh từ máu toàn phần trên nền tảng qPCR. Bên cạnh đó, TAKO cung cấp sinh phẩm phục vụ sàng tìm, phân tích và định danh bacteriophage cho nghiên cứu và điều trị.",
    },
    highlights: [
      { en: "Shortened turnaround time for sepsis diagnosis", vi: "Rút ngắn thời gian trả kết quả trong sepsis" },
      { en: "Supports timely antimicrobial decision-making", vi: "Hỗ trợ ra quyết định kháng sinh kịp thời" },
      { en: "Extended to bacteriophage research applications", vi: "Mở rộng cho nghiên cứu bacteriophage" },
    ],
    imageLabel: "Microbio Sepsis",
    imageTone: "from-slate-700 to-sky-500",
    pdfPath: "/api/catalog/microbio-sepsis-qpcr",
    featured: true,
  },
  {
    slug: "bioer-pcr-realtime-pcr",
    name: { en: "Bioer PCR / Real-time PCR System", vi: "Máy PCR / Realtime PCR Bioer" },
    category: "sinh-hoc-phan-tu",
    categoryName: { en: "Molecular Diagnostics", vi: "Giải pháp xét nghiệm sinh học phân tử" },
    subcategory: "Máy PCR / Realtime PCR",
    manufacturer: "Bioer",
    applications: ["PCR", "qPCR", "Chẩn đoán lâm sàng", "Phòng lab thường quy"],
    shortDescription: {
      en: "Durable, cost-effective PCR and real-time PCR system with stable performance across lab conditions.",
      vi: "Hệ thống PCR và realtime PCR bền bỉ, kinh tế và vận hành ổn định trong nhiều điều kiện phòng lab.",
    },
    description: {
      en: "Bioer Technology is a leading PCR equipment manufacturer known for durability, cost-effectiveness and user-friendly interfaces. Ideal for labs needing a stable, easy-to-train platform that integrates smoothly into routine workflows.",
      vi: "Bioer Technology là nhà sản xuất thiết bị PCR nổi tiếng nhờ độ bền, tính kinh tế và giao diện thân thiện. Giải pháp thích hợp cho phòng xét nghiệm cần một nền tảng vận hành ổn định, dễ đào tạo và dễ tích hợp vào workflow thường quy.",
    },
    highlights: [
      { en: "High durability for continuous operation environments", vi: "Độ bền cao trong môi trường vận hành liên tục" },
      { en: "Cost-effective investment", vi: "Chi phí đầu tư hợp lý" },
      { en: "Suitable for diagnostic labs and research centers", vi: "Phù hợp cho phòng xét nghiệm và trung tâm nghiên cứu" },
    ],
    imageLabel: "Bioer PCR",
    imageTone: "from-blue-500 to-cyan-400",
    pdfPath: "/api/catalog/bioer-pcr-realtime-pcr",
    featured: false,
  },
  {
    slug: "gdsbio-reagents",
    name: { en: "GDSBio PCR, qPCR & Extraction Reagents", vi: "Sinh phẩm PCR, qPCR, tách chiết GDSBio" },
    category: "sinh-hoc-phan-tu",
    categoryName: { en: "Molecular Diagnostics", vi: "Giải pháp xét nghiệm sinh học phân tử" },
    subcategory: "Sinh phẩm PCR, qPCR, tách chiết",
    manufacturer: "GDSBio",
    applications: ["PCR", "qPCR", "Tách chiết", "NGS"],
    shortDescription: {
      en: "ISO 9001 and ISO 13485 certified enzymes, PCR/qPCR kits, nucleic acid extraction and NGS library prep components.",
      vi: "Enzyme, kit PCR/qPCR, tách chiết nucleic acid và chuẩn bị thư viện NGS đạt chuẩn ISO 9001 và ISO 13485.",
    },
    description: {
      en: "GDSBio provides a comprehensive reagent ecosystem for molecular biology and clinical diagnostics, including high-quality enzymes, PCR/qPCR kits, nucleic acid extraction kits and NGS library preparation components. Suitable for labs requiring a stable supply chain and easy workflow standardization.",
      vi: "GDSBio cung cấp hệ sinh thái sinh phẩm đa dạng cho sinh học phân tử và chẩn đoán lâm sàng, bao gồm enzyme chất lượng cao, kit PCR/qPCR, kit tách chiết acid nucleic và thành phần chuẩn bị thư viện NGS. Danh mục phù hợp cho đơn vị cần nguồn cung cấp ổn định và dễ chuẩn hóa.",
    },
    highlights: [
      { en: "ISO 9001 and ISO 13485 certified", vi: "Chứng nhận ISO 9001 và ISO 13485" },
      { en: "Product range spanning PCR to NGS", vi: "Danh mục trải dài từ PCR đến NGS" },
      { en: "Suitable for clinical diagnostics and research", vi: "Phù hợp cho chẩn đoán lâm sàng và nghiên cứu" },
    ],
    imageLabel: "GDSBio Reagents",
    imageTone: "from-cyan-600 to-blue-400",
    pdfPath: "/api/catalog/gdsbio-reagents",
    featured: true,
  },
  {
    slug: "esco-lab-equipment",
    name: { en: "Esco Essential Laboratory Equipment", vi: "Thiết bị phòng lab cơ bản Esco" },
    category: "sinh-hoc-phan-tu",
    categoryName: { en: "Molecular Diagnostics", vi: "Giải pháp xét nghiệm sinh học phân tử" },
    subcategory: "Thiết bị phòng lab cơ bản",
    manufacturer: "Esco",
    applications: ["Phòng lab", "Tế bào", "An toàn sinh học"],
    shortDescription: {
      en: "Centrifuges, biosafety cabinets, CO₂ incubators and core instruments for modern laboratories.",
      vi: "Máy ly tâm, tủ an toàn sinh học, máy ủ CO₂ và các thiết bị nền tảng cho phòng lab hiện đại.",
    },
    description: {
      en: "Esco's catalog covers essential equipment for laboratory operations and cell culture areas, from centrifuges to biosafety cabinets and CO₂ incubators. The solution helps facilities synchronize infrastructure for testing, research and small-scale production.",
      vi: "Danh mục Esco bổ sung các thiết bị cơ bản cho vận hành phòng thí nghiệm và khu vực nuôi cấy tế bào, từ máy ly tâm đến tủ an toàn sinh học và máy ủ CO₂. Giải pháp giúp đơn vị đồng bộ hạ tầng cho xét nghiệm, nghiên cứu và sản xuất quy mô nhỏ.",
    },
    highlights: [
      { en: "Complete core equipment for laboratory operations", vi: "Đầy đủ các thiết bị nền tảng cho phòng lab" },
      { en: "Suitable for cell culture environments", vi: "Phù hợp cho khu vực nuôi cấy tế bào" },
      { en: "Supports infrastructure synchronization", vi: "Hỗ trợ đồng bộ hạ tầng vận hành" },
    ],
    imageLabel: "Esco Lab",
    imageTone: "from-slate-600 to-cyan-500",
    pdfPath: "/api/catalog/esco-lab-equipment",
    featured: false,
  },
  {
    slug: "hla-typing-panels",
    name: { en: "HLA Typing Solution", vi: "Giải pháp HLA typing" },
    category: "sinh-hoc-phan-tu",
    categoryName: { en: "Molecular Diagnostics", vi: "Giải pháp xét nghiệm sinh học phân tử" },
    subcategory: "HLA typing",
    manufacturer: "Igenetech",
    applications: ["HLA", "Ghép tạng", "Y học cá thể hóa"],
    shortDescription: {
      en: "Full-locus HLA typing panels for patients and organ donors at competitive cost.",
      vi: "Panel định typ HLA tại mọi locus cho bệnh nhân và người hiến tạng với chi phí cạnh tranh.",
    },
    description: {
      en: "The HLA typing catalog supports multi-locus typing for organ transplantation and personalized medicine. The solution is designed for facilities needing high-coverage workflows, competitive pricing and deployment suited to their current capabilities.",
      vi: "Danh mục HLA typing hỗ trợ định typ tại nhiều locus phục vụ ghép tạng và y học cá thể hóa. Giải pháp được định hướng cho đơn vị cần quy trình có độ phủ cao, chi phí cạnh tranh và khả năng triển khai phù hợp với năng lực hiện tại.",
    },
    highlights: [
      { en: "Full HLA locus coverage", vi: "Hỗ trợ đầy đủ locus HLA" },
      { en: "Supports organ transplantation and personalized medicine", vi: "Phục vụ ghép tạng và y học cá thể hóa" },
      { en: "Competitive pricing for clinical facilities", vi: "Chi phí cạnh tranh cho đơn vị lâm sàng" },
    ],
    imageLabel: "HLA Typing",
    imageTone: "from-sky-700 to-blue-500",
    pdfPath: "/api/catalog/hla-typing-panels",
    featured: false,
  },
  {
    slug: "basic-reagents",
    name: { en: "Enzymes, Buffers & Extraction Kits", vi: "Enzyme, buffer, kit tách chiết" },
    category: "sinh-pham-co-ban",
    categoryName: { en: "Basic Reagents", vi: "Sinh phẩm cơ bản" },
    subcategory: "Enzyme, buffer, kit tách chiết",
    manufacturer: "GDSBio",
    applications: ["PCR", "qPCR", "Tách chiết"],
    shortDescription: {
      en: "High-quality Taq DNA Polymerase and PCR kits for routine molecular biology applications.",
      vi: "Enzyme Taq DNA Polymerase và bộ kit PCR chuyên dụng cho sinh học phân tử thường quy.",
    },
    description: {
      en: "GDSBio provides high-quality Taq DNA Polymerase and PCR kits designed for clinical diagnostics and routine research. The catalog includes standard and hot-start enzymes, optimized buffers and ready-to-use kits.",
      vi: "GDSBio cung cấp enzyme Taq DNA Polymerase chất lượng cao và các bộ kit PCR được thiết kế cho chẩn đoán lâm sàng và nghiên cứu thường quy. Danh mục bao gồm enzyme thường và enzyme hot-start, buffer tối ưu và kit ready-to-use.",
    },
    highlights: [
      { en: "High-sensitivity enzyme with low background signal", vi: "Enzyme độ nhạy cao, ít nhiễu nền" },
      { en: "Hot-start option for specific PCR", vi: "Có lựa chọn hot-start cho PCR đặc hiệu" },
      { en: "Ready-to-use kits for easy workflow standardization", vi: "Kit ready-to-use, dễ chuẩn hóa quy trình" },
    ],
    imageLabel: "Basic Reagents",
    imageTone: "from-slate-500 to-sky-300",
    pdfPath: "/api/catalog/basic-reagents",
    featured: false,
  },
  {
    slug: "lab-consumables",
    name: { en: "Lab Accessories, Chemicals & Consumables", vi: "Phụ kiện, hóa chất, vật tư tiêu hao" },
    category: "khac",
    categoryName: { en: "Others", vi: "Khác" },
    subcategory: "Phụ kiện, hóa chất, vật tư tiêu hao",
    manufacturer: "Đa hãng",
    applications: ["Vật tư tiêu hao", "Hóa chất", "Phòng lab"],
    shortDescription: {
      en: "Supporting lab products outside main categories, for consolidated procurement.",
      vi: "Danh mục sản phẩm hỗ trợ phòng lab không thuộc các nhóm chính, phục vụ mua sắm đồng bộ.",
    },
    description: {
      en: "TAKO Vietnam maintains a range of auxiliary products to meet consolidated procurement needs for consumables, chemicals and accessories not covered by main solution groups. Contact us for tailored catalog recommendations matching your current workflows.",
      vi: "TAKO Vietnam duy trì nhóm sản phẩm phụ trợ để đáp ứng nhu cầu đồng bộ vật tư, hóa chất và phụ kiện không nằm trong các nhóm giải pháp chính. Khách hàng có thể liên hệ trực tiếp để được tư vấn danh mục phù hợp với quy trình hiện hữu.",
    },
    highlights: [
      { en: "Consolidated procurement for laboratories", vi: "Hỗ trợ mua sắm đồng bộ cho phòng lab" },
      { en: "Consulting based on actual operational needs", vi: "Tư vấn theo nhu cầu vận hành thực tế" },
      { en: "Rapid catalog additions for emerging requirements", vi: "Bổ sung nhanh theo danh mục hàng hóa phát sinh" },
    ],
    imageLabel: "Consumables",
    imageTone: "from-zinc-600 to-sky-400",
    pdfPath: "/api/catalog/lab-consumables",
    featured: false,
  },
  // --- Additional proteomics products ---
  {
    slug: "quantum-si-chip-cartridge",
    name: "Chip Platinum® & Cartridge Kit",
    category: "proteomics",
    categoryName: "Proteomics",
    subcategory: "Vật tư tiêu hao Platinum®",
    manufacturer: "Quantum-Si",
    applications: ["Proteomics", "Protein sequencing", "PTM"],
    shortDescription: {
      en: "Original semiconductor chip and cartridge kit for the Platinum\u00ae Pro system, ensuring accurate protein analysis.",
      vi: "Chip bán dẫn và cartridge kit chính hãng cho hệ thống Platinum\u00ae Pro, đảm bảo kết quả phân tích protein chính xác.",
    },
    description: {
      en: "Quantum-Si's Platinum\u00ae Chip is the core component for single-molecule protein sequencing. Each chip is engineered to run millions of molecules simultaneously, providing true single-molecule signals. The cartridge kit enables stable and consistent sample preparation and loading onto the chip.",
      vi: "Chip Platinum\u00ae của Quantum-Si là thành phần cốt lõi cho giải trình tự protein đơn phân tử. Mỗi chip được thiết kế để chạy hàng triệu phân tử cùng lúc, cung cấp tín hiệu đơn phân tử thực sự. Cartridge kit đi kèm giúp chuẩn bị mẫu và tải mẫu lên chip một cách ổn định và nhất quán.",
    },
    highlights: [
      { en: "Chip integrating millions of nanophotonic wells", vi: "Chip tích hợp hàng triệu lỗ nanophotonic" },
      { en: "Cartridge ensures stable sample loading", vi: "Cartridge giúp tải mẫu ổn định" },
      { en: "Genuine Quantum-Si, guaranteed quality", vi: "Chính hãng Quantum-Si, bảo đảm chất lượng" },
    ],
    imageLabel: "Platinum Chip",
    imageTone: "from-sky-400 to-teal-300",
    pdfPath: "/api/catalog/quantum-si-chip-cartridge",
    featured: false,
  },
  {
    slug: "proteomics-sample-prep-kit",
    name: { en: "Proteomics Sample Preparation Kit", vi: "Kit chuẩn bị mẫu Proteomics" },
    category: "proteomics",
    categoryName: { en: "Proteomics", vi: "Proteomics" },
    subcategory: "Chuẩn bị mẫu",
    manufacturer: "Quantum-Si",
    applications: ["Proteomics", "Sample prep", "Drug discovery"],
    shortDescription: {
      en: "Protein extraction and sample preparation kit optimized for the Platinum\u00ae Pro sequencing system.",
      vi: "Bộ kit tách chiết và chuẩn bị mẫu protein tối ưu cho hệ thống giải trình tự Platinum\u00ae Pro.",
    },
    description: {
      en: "Quantum-Si's sample preparation kit enables protein extraction and purification from various biological samples including tissue, cells and biological fluids. The workflow is optimized for the Platinum\u00ae Pro system, minimizing background noise and maximizing protein readout efficiency.",
      vi: "Bộ kit chuẩn bị mẫu của Quantum-Si giúp tách chiết và làm sạch protein từ các loại mẫu sinh học khác nhau, bao gồm mô, tế bào và dịch sinh học. Quy trình được tối ưu cho hệ Platinum\u00ae Pro, giảm tối thiểu nhiễu nền và tối đa hóa hiệu suất đọc protein.",
    },
    highlights: [
      { en: "Optimally compatible with Platinum\u00ae Pro", vi: "Tương thích tối ưu với Platinum\u00ae Pro" },
      { en: "Wide range of input sample types", vi: "Đa dạng loại mẫu đầu vào" },
      { en: "Standardized, reproducible workflow", vi: "Quy trình chuẩn hóa, tái lập được" },
    ],
    imageLabel: "Proteomics Prep",
    imageTone: "from-teal-500 to-cyan-300",
    pdfPath: "/api/catalog/proteomics-sample-prep-kit",
    featured: false,
  },
  // --- Additional sinh-pham-co-ban products ---
  {
    slug: "rna-extraction-kit",
    name: { en: "RNA Extraction Kit", vi: "Kit tách chiết RNA" },
    category: "sinh-pham-co-ban",
    categoryName: { en: "Basic Reagents", vi: "Sinh phẩm cơ bản" },
    subcategory: "Kit tách chiết",
    manufacturer: "GDSBio",
    applications: ["Tách chiết RNA", "qRT-PCR", "Nghiên cứu"],
    shortDescription: {
      en: "High-performance total RNA extraction kit from blood, tissue and cells with stable yield.",
      vi: "Kit tách chiết RNA tổng số từ máu, mô và tế bào, hiệu suất cao và ổn định.",
    },
    description: {
      en: "GDSBio RNA Extraction Kit provides a fast and stable workflow for total RNA extraction from multiple biological sample types. The product uses a silica column principle with RNase-inhibiting buffer, yielding intact RNA suitable for qRT-PCR, sequencing and gene expression research.",
      vi: "GDSBio RNA Extraction Kit cung cấp quy trình nhanh và ổn định để tách chiết RNA tổng số từ nhiều loại mẫu sinh học. Sản phẩm sử dụng nguyên lý cột silica kết hợp đệm ức chế RNase, cho sản phẩm RNA toàn vẹn phù hợp cho qRT-PCR, sequencing và các ứng dụng nghiên cứu biểu hiện gen.",
    },
    highlights: [
      { en: "Intact RNA with stable OD 260/280 ratio", vi: "RNA toàn vẹn, OD 260/280 ổn định" },
      { en: "Compatible with blood, tissue and cultured cells", vi: "Phù hợp mẫu máu, mô, tế bào nuôi" },
      { en: "No phenol/chloroform required, safer to use", vi: "Không cần phenol/chloroform, an toàn hơn" },
    ],
    imageLabel: "RNA Extraction",
    imageTone: "from-emerald-500 to-cyan-400",
    pdfPath: "/api/catalog/rna-extraction-kit",
    featured: false,
  },
  // --- Additional khac products ---
  {
    slug: "pcr-tubes-tips",
    name: { en: "PCR Tubes & Pipette Tips", vi: "Ống PCR và đầu côn" },
    category: "khac",
    categoryName: { en: "Others", vi: "Khác" },
    subcategory: "Vật tư tiêu hao",
    manufacturer: "Đa hãng",
    applications: ["PCR", "Phòng lab", "Vật tư tiêu hao"],
    shortDescription: {
      en: "0.2ml PCR tubes, filtered and non-filtered tips in multiple sizes, compatible with popular PCR machines and pipettes.",
      vi: "Ống PCR 0.2ml, đầu côn các cỡ có và không lọc, phù hợp cho nhiều dòng máy PCR và pipette phổ biến.",
    },
    description: {
      en: "TAKO Vietnam supplies quality PCR tubes and pipette tips from reputable manufacturers, including 8-strip and 12-strip tubes, single 0.2ml tubes, and filtered/non-filtered 10µl/200µl/1000µl tips. All products are DNase/RNase-free and compatible with popular PCR machines and pipettes.",
      vi: "TAKO Vietnam cung cấp ống PCR và đầu côn chất lượng từ các nhà cung cấp uy tín, bao gồm ống strip 8 và 12, ống đơn 0.2ml, đầu côn 10µl/200µl/1000µl có lọc và không lọc. Sản phẩm DNase/RNase-free, tương thích với các dòng máy và pipette phổ biến trên thị trường.",
    },
    highlights: [
      { en: "DNase/RNase-free, no exogenous contamination", vi: "DNase/RNase-free, không nhiễm DNA/RNA ngoại lai" },
      { en: "Compatible with major PCR machines and pipettes", vi: "Tương thích nhiều dòng máy PCR và pipette" },
      { en: "Filtered tip options for sensitive applications", vi: "Có lựa chọn đầu côn có lọc cho thao tác nhạy cảm" },
    ],
    imageLabel: "PCR Tubes & Tips",
    imageTone: "from-slate-400 to-sky-300",
    pdfPath: "/api/catalog/pcr-tubes-tips",
    featured: false,
  },
  {
    slug: "ppe-lab-safety",
    name: { en: "Laboratory Personal Protective Equipment", vi: "Vật tư bảo hộ phòng lab" },
    category: "khac",
    categoryName: { en: "Others", vi: "Khác" },
    subcategory: "Vật tư bảo hộ",
    manufacturer: "Đa hãng",
    applications: ["An toàn phòng lab", "Vật tư tiêu hao"],
    shortDescription: {
      en: "Nitrile gloves, masks, safety glasses and personal protective equipment for laboratory use.",
      vi: "Găng tay nitrile, khẩu trang, kính bảo hộ và vật tư bảo hộ cá nhân cho phòng thí nghiệm.",
    },
    description: {
      en: "TAKO Vietnam supplies personal protective equipment (PPE) for laboratories, including powder-free nitrile gloves, medical and N95 masks, safety glasses and lab coats. Products meet biosafety standards for BSL-1 and BSL-2 laboratory environments.",
      vi: "TAKO Vietnam cung cấp vật tư bảo hộ cá nhân (PPE) cho phòng thí nghiệm, bao gồm găng tay nitrile không bột, khẩu trang y tế và N95, kính bảo hộ và áo blouse. Sản phẩm đáp ứng tiêu chuẩn an toàn sinh học cho phòng lab cấp độ BSL-1 và BSL-2.",
    },
    highlights: [
      { en: "Meets BSL-1 and BSL-2 standards", vi: "Đáp ứng tiêu chuẩn BSL-1 và BSL-2" },
      { en: "Powder-free nitrile gloves, low allergenicity", vi: "Găng tay nitrile không bột, ít gây dị ứng" },
      { en: "Range of sizes and order quantities available", vi: "Đa dạng kích cỡ và số lượng đặt hàng" },
    ],
    imageLabel: "Lab Safety",
    imageTone: "from-amber-500 to-orange-300",
    pdfPath: "/api/catalog/ppe-lab-safety",
    featured: false,
  },
];

export const newsArticles: NewsArticle[] = [
  {
    slug: "cong-nghe-proteomics-trong-y-hoc-chinh-xac",
    title: {
      en: "Single-molecule proteomics is transforming the speed of disease mechanism discovery",
      vi: "Proteomics đơn phân tử đang thay đổi tốc độ giải mã cơ chế bệnh học",
    },
    excerpt: {
      en: "From protein sequencing to PTM analysis, new platforms are expanding biomarker discovery for precision medicine.",
      vi: "Từ sequencing protein đến PTM, các nền tảng mới đang mở rộng khả năng phát hiện biomarker cho y học chính xác.",
    },
    date: "2026-05-10",
    tag: "Proteomics",
  },
  {
    slug: "ngs-trong-chan-doan-ung-thu-thuong-quy",
    title: {
      en: "NGS in routine oncology diagnostics: sensitivity, panel design and operational challenges",
      vi: "NGS trong chẩn đoán ung thư thường quy: bài toán độ nhạy, panel và vận hành",
    },
    excerpt: {
      en: "Clinical pressure is accelerating demand for automation, panel standardization and integration of data analysis with targeted therapy.",
      vi: "Áp lực từ lâm sàng đang đẩy nhanh nhu cầu tự động hóa, chuẩn hóa panel và gắn kết phân tích dữ liệu với điều trị đích.",
    },
    date: "2026-05-06",
    tag: "NGS",
  },
  {
    slug: "sepsis-va-cuoc-dua-rut-ngan-thoi-gian-tra-ket-qua",
    title: {
      en: "Sepsis and the race to reduce turnaround time in critical care",
      vi: "Sepsis và cuộc đua rút ngắn thời gian trả kết quả trong hồi sức cấp cứu",
    },
    excerpt: {
      en: "Rapid identification of pathogens and antimicrobial resistance data are variables that can reshape early treatment protocols.",
      vi: "Chẩn đoán nhanh tác nhân gây bệnh và thông tin kháng kháng sinh là biến số có thể thay đổi phác đồ điều trị sớm.",
    },
    date: "2026-04-30",
    tag: "Truyền nhiễm",
  },
];

export const featuredProducts = products.filter((product) => product.featured);

export const allManufacturers = Array.from(
  new Set(products.map((product) => product.manufacturer)),
);

export const allApplications = Array.from(
  new Set(products.flatMap((product) => product.applications)),
);

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}