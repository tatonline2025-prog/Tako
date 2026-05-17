import type { Locale } from "@/lib/i18n";

export type NavigationItem = {
  href: string;
  label: string;
};

export type Category = {
  slug: string;
  name: string;
  description: string;
  applications: string[];
};

export type Product = {
  slug: string;
  name: string;
  category: string;
  categoryName: string;
  subcategory: string;
  manufacturer: string;
  applications: string[];
  shortDescription: string;
  description: string;
  highlights: string[];
  imageLabel: string;
  imageTone: string;
  pdfPath: string;
  featured: boolean;
};

export type NewsArticle = {
  slug: string;
  title: string;
  excerpt: string;
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

export const companyHighlights = [
  "Định hướng theo Nghị quyết 57-NQ/TW và 36-NQ/TW về phát triển công nghệ chiến lược và khoa học sức khỏe.",
  "Tập trung B2B cho phòng xét nghiệm, bệnh viện, viện nghiên cứu, cơ sở kiểm định và doanh nghiệp dược sinh học.",
  "Kết nối thiết bị, sinh phẩm, workflow và dịch vụ hỗ trợ để rút ngắn thời gian đưa công nghệ vào vận hành.",
];

export const focusAreas = [
  "Proteomics độ phân giải cao",
  "Giải trình tự gene thế hệ mới",
  "Chẩn đoán sinh học phân tử cho bệnh viện và phòng lab",
  "Sinh phẩm cơ bản và vật tư tiêu hao",
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
    description:
      "Nền tảng giải trình tự và phân tích protein cho nghiên cứu thuốc và y học chính xác.",
    applications: ["Proteomics", "Y học chính xác", "Drug discovery"],
  },
  {
    slug: "ngs",
    name: "Giải trình tự gene thế hệ mới (NGS)",
    description:
      "Hệ thống giải trình tự, hóa chất và tự động hóa workflow cho chẩn đoán và nghiên cứu genomics.",
    applications: ["Ung thư", "Di truyền", "Sàng lọc trước sinh", "Dịch tễ học"],
  },
  {
    slug: "sinh-hoc-phan-tu",
    name: "Giải pháp xét nghiệm sinh học phân tử",
    description:
      "qPCR, PCR, sinh phẩm tách chiết và thiết bị phòng lab cho xét nghiệm lâm sàng và nghiên cứu.",
    applications: ["Truyền nhiễm", "Kháng kháng sinh", "HLA", "Chẩn đoán lâm sàng"],
  },
  {
    slug: "sinh-pham-co-ban",
    name: "Sinh phẩm cơ bản",
    description:
      "Enzyme, buffer và kit tách chiết phục vụ workflow sinh học phân tử cơ bản và mở rộng.",
    applications: ["PCR", "qPCR", "NGS"],
  },
  {
    slug: "khac",
    name: "Khác",
    description:
      "Phụ kiện, hóa chất và vật tư tiêu hao cho hoạt động thường quy của phòng thí nghiệm.",
    applications: ["Vật tư tiêu hao", "Hóa chất", "Phụ kiện phòng lab"],
  },
];

export const products: Product[] = [
  {
    slug: "platinum-pro-protein-sequencer",
    name: "Hệ thống phân tích protein Platinum Pro",
    category: "proteomics",
    categoryName: "Proteomics",
    subcategory: "Hệ thống phân tích protein Platinum Pro",
    manufacturer: "Quantum-Si",
    applications: ["Proteomics", "PTM", "Drug discovery", "Y học chính xác"],
    shortDescription:
      "Hệ thống giải trình tự protein đơn phân tử dựa trên chip bán dẫn, tự động hóa và kích thước nhỏ gọn.",
    description:
      "Quantum-Si cung cấp công nghệ giải trình tự protein đơn phân tử đầu tiên trên thế giới, cho phép xác định acid amin và các biến đổi sau dịch mã với độ phân giải cao. Nền tảng phù hợp cho phòng nghiên cứu cần dữ liệu protein nhanh, chi phí hợp lý và khả năng mở rộng để phục vụ phát hiện thuốc và chẩn đoán chính xác.",
    highlights: [
      "Chip bán dẫn cho phép đọc dữ liệu protein nhanh",
      "Hỗ trợ phát hiện PTM ở mức độ chi tiết",
      "Kích thước nhỏ gọn, dễ đưa vào phòng thí nghiệm hiện hữu",
    ],
    imageLabel: "Quantum-Si Platinum Pro",
    imageTone: "from-sky-500 to-cyan-300",
    pdfPath: "/api/catalog/platinum-pro-protein-sequencer",
    featured: true,
  },
  {
    slug: "mgi-sequencer",
    name: "Máy giải trình tự MGI",
    category: "ngs",
    categoryName: "Giải trình tự gene thế hệ mới (NGS)",
    subcategory: "Máy giải trình tự MGI",
    manufacturer: "MGI",
    applications: ["Ung thư", "Di truyền", "Sinh thiết lỏng", "Chẩn đoán thường quy"],
    shortDescription:
      "Nền tảng NGS cho chẩn đoán thường quy và phát hiện tổn thương di truyền với ngưỡng phát hiện đến 0,01%.",
    description:
      "Hệ thống MGI hướng tới workflow NGS cho phòng xét nghiệm lâm sàng, hỗ trợ phát hiện biến đổi di truyền từ mô ung thư và máu sinh thiết lỏng. Panel chẩn đoán được cập nhật theo khuyến cáo NCCN và ESMO, hỗ trợ đơn vị chẩn đoán mở rộng năng lực genomics thường quy.",
    highlights: [
      "Ngưỡng phát hiện xuống đến 0,01%",
      "Phù hợp cho mẫu mô ung thư và sinh thiết lỏng",
      "Có thể tích hợp vào quy trình chẩn đoán thường quy",
    ],
    imageLabel: "MGI Sequencer",
    imageTone: "from-blue-600 to-indigo-400",
    pdfPath: "/api/catalog/mgi-sequencer",
    featured: true,
  },
  {
    slug: "ngs-reagents",
    name: "Hóa chất phục vụ NGS",
    category: "ngs",
    categoryName: "Giải trình tự gene thế hệ mới (NGS)",
    subcategory: "Hóa chất phục vụ NGS",
    manufacturer: "NadigmBio / Igenetech",
    applications: ["Ung thư", "Di truyền", "Sàng lọc trước sinh", "Dịch tễ học"],
    shortDescription:
      "Hóa chất và workflow toàn diện từ chuẩn bị thư viện đến phân tích dữ liệu NGS.",
    description:
      "TAKO Vietnam nhập khẩu trực tiếp hóa chất và bộ kit từ NadigmBio và Igenetech, phục vụ quy trình NGS trọn vẹn. Giải pháp hỗ trợ ứng dụng trong ung thư, bệnh di truyền, sàng lọc trước sinh và giám sát dịch tễ học với mục tiêu tối ưu hóa độ ổn định và tính nhất quán của quy trình.",
    highlights: [
      "Đầy đủ thành phần cho workflow NGS",
      "Hỗ trợ nhiều bài toán lâm sàng và nghiên cứu",
      "Thích hợp để chuẩn hóa quy trình phòng xét nghiệm",
    ],
    imageLabel: "NGS Reagents",
    imageTone: "from-cyan-500 to-sky-300",
    pdfPath: "/api/catalog/ngs-reagents",
    featured: true,
  },
  {
    slug: "mgisp-library-prep",
    name: "Máy chuẩn bị thư viện tự động MGISP",
    category: "ngs",
    categoryName: "Giải trình tự gene thế hệ mới (NGS)",
    subcategory: "Máy chuẩn bị thư viện tự động (MGISP)",
    manufacturer: "MGI",
    applications: ["NGS", "Tự động hóa", "Phòng xét nghiệm"],
    shortDescription:
      "Hệ thống tự động hóa khâu chuẩn bị thư viện cho NGS, giảm sai số và tiết kiệm nhân lực.",
    description:
      "MGISP tự động hóa bước chuẩn bị thư viện cho NGS, giúp phòng xét nghiệm nâng cao tính đồng nhất kết quả và giải phóng nhân sự khỏi các thao tác lặp lại. Giải pháp phù hợp cho đơn vị cần mở rộng công suất mà vẫn kiểm soát được chất lượng quy trình.",
    highlights: [
      "Đồng nhất hóa thao tác lập thư viện",
      "Giảm thời gian thao tác thủ công",
      "Phù hợp cho phòng lab cần mở rộng công suất",
    ],
    imageLabel: "MGISP Automation",
    imageTone: "from-indigo-500 to-sky-400",
    pdfPath: "/api/catalog/mgisp-library-prep",
    featured: false,
  },
  {
    slug: "microbio-sepsis-qpcr",
    name: "Giải pháp bệnh truyền nhiễm và sepsis",
    category: "sinh-hoc-phan-tu",
    categoryName: "Giải pháp xét nghiệm sinh học phân tử",
    subcategory: "Bệnh truyền nhiễm",
    manufacturer: "Microbio",
    applications: ["Truyền nhiễm", "Sepsis", "Kháng kháng sinh", "Bacteriophage"],
    shortDescription:
      "Kit chẩn đoán nhanh sepsis trên hệ thống qPCR, phát hiện trực tiếp tác nhân gây bệnh từ máu toàn phần.",
    description:
      "Giải pháp của Microbio giúp rút ngắn thời gian trả kết quả trong bệnh cảnh sepsis bằng cách phát hiện trực tiếp tác nhân gây bệnh từ máu toàn phần trên nền tảng qPCR. Bên cạnh đó, TAKO cung cấp sinh phẩm phục vụ sàng tìm, phân tích và định danh bacteriophage cho nghiên cứu và điều trị.",
    highlights: [
      "Rút ngắn thời gian trả kết quả trong sepsis",
      "Hỗ trợ ra quyết định kháng sinh kịp thời",
      "Mở rộng cho nghiên cứu bacteriophage",
    ],
    imageLabel: "Microbio Sepsis",
    imageTone: "from-slate-700 to-sky-500",
    pdfPath: "/api/catalog/microbio-sepsis-qpcr",
    featured: true,
  },
  {
    slug: "bioer-pcr-realtime-pcr",
    name: "Máy PCR / Realtime PCR Bioer",
    category: "sinh-hoc-phan-tu",
    categoryName: "Giải pháp xét nghiệm sinh học phân tử",
    subcategory: "Máy PCR / Realtime PCR",
    manufacturer: "Bioer",
    applications: ["PCR", "qPCR", "Chẩn đoán lâm sàng", "Phòng lab thường quy"],
    shortDescription:
      "Hệ thống PCR và realtime PCR bền bỉ, kinh tế và vận hành ổn định trong nhiều điều kiện phòng lab.",
    description:
      "Bioer Technology là nhà sản xuất thiết bị PCR nổi tiếng nhờ độ bền, tính kinh tế và giao diện thân thiện. Giải pháp thích hợp cho phòng xét nghiệm cần một nền tảng vận hành ổn định, dễ đào tạo và dễ tích hợp vào workflow thường quy.",
    highlights: [
      "Độ bền cao trong môi trường vận hành liên tục",
      "Chi phí đầu tư hợp lý",
      "Phù hợp cho phòng xét nghiệm và trung tâm nghiên cứu",
    ],
    imageLabel: "Bioer PCR",
    imageTone: "from-blue-500 to-cyan-400",
    pdfPath: "/api/catalog/bioer-pcr-realtime-pcr",
    featured: false,
  },
  {
    slug: "gdsbio-reagents",
    name: "Sinh phẩm PCR, qPCR, tách chiết GDSBio",
    category: "sinh-hoc-phan-tu",
    categoryName: "Giải pháp xét nghiệm sinh học phân tử",
    subcategory: "Sinh phẩm PCR, qPCR, tách chiết",
    manufacturer: "GDSBio",
    applications: ["PCR", "qPCR", "Tách chiết", "NGS"],
    shortDescription:
      "Enzyme, kit PCR/qPCR, tách chiết nucleic acid và chuẩn bị thư viện NGS đạt chuẩn ISO 9001 và ISO 13485.",
    description:
      "GDSBio cung cấp hệ sinh thái sinh phẩm đa dạng cho sinh học phân tử và chẩn đoán lâm sàng, bao gồm enzyme chất lượng cao, kit PCR/qPCR, kit tách chiết acid nucleic và thành phần chuẩn bị thư viện NGS. Danh mục phù hợp cho đơn vị cần nguồn cung cấp ổn định và dễ chuẩn hóa.",
    highlights: [
      "Chứng nhận ISO 9001 và ISO 13485",
      "Danh mục trải dài từ PCR đến NGS",
      "Phù hợp cho chẩn đoán lâm sàng và nghiên cứu",
    ],
    imageLabel: "GDSBio Reagents",
    imageTone: "from-cyan-600 to-blue-400",
    pdfPath: "/api/catalog/gdsbio-reagents",
    featured: true,
  },
  {
    slug: "esco-lab-equipment",
    name: "Thiết bị phòng lab cơ bản Esco",
    category: "sinh-hoc-phan-tu",
    categoryName: "Giải pháp xét nghiệm sinh học phân tử",
    subcategory: "Thiết bị phòng lab cơ bản",
    manufacturer: "Esco",
    applications: ["Phòng lab", "Tế bào", "An toàn sinh học"],
    shortDescription:
      "Máy ly tâm, tủ an toàn sinh học, máy ủ CO₂ và các thiết bị nền tảng cho phòng lab hiện đại.",
    description:
      "Danh mục Esco bổ sung các thiết bị cơ bản cho vận hành phòng thí nghiệm và khu vực nuôi cấy tế bào, từ máy ly tâm đến tủ an toàn sinh học và máy ủ CO₂. Giải pháp giúp đơn vị đồng bộ hạ tầng cho xét nghiệm, nghiên cứu và sản xuất quy mô nhỏ.",
    highlights: [
      "Đầy đủ các thiết bị nền tảng cho phòng lab",
      "Phù hợp cho khu vực nuôi cấy tế bào",
      "Hỗ trợ đồng bộ hạ tầng vận hành",
    ],
    imageLabel: "Esco Lab",
    imageTone: "from-slate-600 to-cyan-500",
    pdfPath: "/api/catalog/esco-lab-equipment",
    featured: false,
  },
  {
    slug: "hla-typing-panels",
    name: "Giải pháp HLA typing",
    category: "sinh-hoc-phan-tu",
    categoryName: "Giải pháp xét nghiệm sinh học phân tử",
    subcategory: "HLA typing",
    manufacturer: "Igenetech",
    applications: ["HLA", "Ghép tạng", "Y học cá thể hóa"],
    shortDescription:
      "Panel định typ HLA tại mọi locus cho bệnh nhân và người hiến tạng với chi phí cạnh tranh.",
    description:
      "Danh mục HLA typing hỗ trợ định typ tại nhiều locus phục vụ ghép tạng và y học cá thể hóa. Giải pháp được định hướng cho đơn vị cần quy trình có độ phủ cao, chi phí cạnh tranh và khả năng triển khai phù hợp với năng lực hiện tại.",
    highlights: [
      "Hỗ trợ đầy đủ locus HLA",
      "Phục vụ ghép tạng và y học cá thể hóa",
      "Chi phí cạnh tranh cho đơn vị lâm sàng",
    ],
    imageLabel: "HLA Typing",
    imageTone: "from-sky-700 to-blue-500",
    pdfPath: "/api/catalog/hla-typing-panels",
    featured: false,
  },
  {
    slug: "basic-reagents",
    name: "Enzyme, buffer, kit tách chiết",
    category: "sinh-pham-co-ban",
    categoryName: "Sinh phẩm cơ bản",
    subcategory: "Enzyme, buffer, kit tách chiết",
    manufacturer: "GDSBio",
    applications: ["PCR", "qPCR", "Tách chiết"],
    shortDescription:
      "Enzyme Taq DNA Polymerase và bộ kit PCR chuyên dụng cho sinh học phân tử thường quy.",
    description:
      "GDSBio cung cấp enzyme Taq DNA Polymerase chất lượng cao và các bộ kit PCR được thiết kế cho chẩn đoán lâm sàng và nghiên cứu thường quy. Danh mục bao gồm enzyme thường và enzyme hot-start, buffer tối ưu và kit ready-to-use.",
    highlights: [
      "Enzyme độ nhạy cao, ít nhiễu nền",
      "Có lựa chọn hot-start cho PCR đặc hiệu",
      "Kit ready-to-use, dễ chuẩn hóa quy trình",
    ],
    imageLabel: "Basic Reagents",
    imageTone: "from-slate-500 to-sky-300",
    pdfPath: "/api/catalog/basic-reagents",
    featured: false,
  },
  {
    slug: "lab-consumables",
    name: "Phụ kiện, hóa chất, vật tư tiêu hao",
    category: "khac",
    categoryName: "Khác",
    subcategory: "Phụ kiện, hóa chất, vật tư tiêu hao",
    manufacturer: "Đa hãng",
    applications: ["Vật tư tiêu hao", "Hóa chất", "Phòng lab"],
    shortDescription:
      "Danh mục sản phẩm hỗ trợ phòng lab không thuộc các nhóm chính, phục vụ mua sắm đồng bộ.",
    description:
      "TAKO Vietnam duy trì nhóm sản phẩm phụ trợ để đáp ứng nhu cầu đồng bộ vật tư, hóa chất và phụ kiện không nằm trong các nhóm giải pháp chính. Khách hàng có thể liên hệ trực tiếp để được tư vấn danh mục phù hợp với quy trình hiện hữu.",
    highlights: [
      "Hỗ trợ mua sắm đồng bộ cho phòng lab",
      "Tư vấn theo nhu cầu vận hành thực tế",
      "Bổ sung nhanh theo danh mục hàng hóa phát sinh",
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
    shortDescription:
      "Chip bán dẫn và cartridge kit chính hãng cho hệ thống Platinum® Pro, đảm bảo kết quả phân tích protein chính xác.",
    description:
      "Chip Platinum® của Quantum-Si là thành phần cốt lõi cho giải trình tự protein đơn phân tử. Mỗi chip được thiết kế để chạy hàng triệu phân tử cùng lúc, cung cấp tín hiệu đơn phân tử thực sự. Cartridge kit đi kèm giúp chuẩn bị mẫu và tải mẫu lên chip một cách ổn định và nhất quán.",
    highlights: [
      "Chip tích hợp hàng triệu lỗ nanophotonic",
      "Cartridge giúp tải mẫu ổn định",
      "Chính hãng Quantum-Si, bảo đảm chất lượng",
    ],
    imageLabel: "Platinum Chip",
    imageTone: "from-sky-400 to-teal-300",
    pdfPath: "/api/catalog/quantum-si-chip-cartridge",
    featured: false,
  },
  {
    slug: "proteomics-sample-prep-kit",
    name: "Kit chuẩn bị mẫu Proteomics",
    category: "proteomics",
    categoryName: "Proteomics",
    subcategory: "Chuẩn bị mẫu",
    manufacturer: "Quantum-Si",
    applications: ["Proteomics", "Sample prep", "Drug discovery"],
    shortDescription:
      "Bộ kit tách chiết và chuẩn bị mẫu protein tối ưu cho hệ thống giải trình tự Platinum® Pro.",
    description:
      "Bộ kit chuẩn bị mẫu của Quantum-Si giúp tách chiết và làm sạch protein từ các loại mẫu sinh học khác nhau, bao gồm mô, tế bào và dịch sinh học. Quy trình được tối ưu cho hệ Platinum® Pro, giảm tối thiểu nhiễu nền và tối đa hóa hiệu suất đọc protein.",
    highlights: [
      "Tương thích tối ưu với Platinum® Pro",
      "Đa dạng loại mẫu đầu vào",
      "Quy trình chuẩn hóa, tái lập được",
    ],
    imageLabel: "Proteomics Prep",
    imageTone: "from-teal-500 to-cyan-300",
    pdfPath: "/api/catalog/proteomics-sample-prep-kit",
    featured: false,
  },
  // --- Additional sinh-pham-co-ban products ---
  {
    slug: "rna-extraction-kit",
    name: "Kit tách chiết RNA",
    category: "sinh-pham-co-ban",
    categoryName: "Sinh phẩm cơ bản",
    subcategory: "Kit tách chiết",
    manufacturer: "GDSBio",
    applications: ["Tách chiết RNA", "qRT-PCR", "Nghiên cứu"],
    shortDescription:
      "Kit tách chiết RNA tổng số từ máu, mô và tế bào, hiệu suất cao và ổn định.",
    description:
      "GDSBio RNA Extraction Kit cung cấp quy trình nhanh và ổn định để tách chiết RNA tổng số từ nhiều loại mẫu sinh học. Sản phẩm sử dụng nguyên lý cột silica kết hợp đệm ức chế RNase, cho sản phẩm RNA toàn vẹn phù hợp cho qRT-PCR, sequencing và các ứng dụng nghiên cứu biểu hiện gen.",
    highlights: [
      "RNA toàn vẹn, OD 260/280 ổn định",
      "Phù hợp mẫu máu, mô, tế bào nuôi",
      "Không cần phenol/chloroform, an toàn hơn",
    ],
    imageLabel: "RNA Extraction",
    imageTone: "from-emerald-500 to-cyan-400",
    pdfPath: "/api/catalog/rna-extraction-kit",
    featured: false,
  },
  // --- Additional khac products ---
  {
    slug: "pcr-tubes-tips",
    name: "Ống PCR và đầu côn",
    category: "khac",
    categoryName: "Khác",
    subcategory: "Vật tư tiêu hao",
    manufacturer: "Đa hãng",
    applications: ["PCR", "Phòng lab", "Vật tư tiêu hao"],
    shortDescription:
      "Ống PCR 0.2ml, đầu côn các cỡ có và không lọc, phù hợp cho nhiều dòng máy PCR và pipette phổ biến.",
    description:
      "TAKO Vietnam cung cấp ống PCR và đầu côn chất lượng từ các nhà cung cấp uy tín, bao gồm ống strip 8 và 12, ống đơn 0.2ml, đầu côn 10µl/200µl/1000µl có lọc và không lọc. Sản phẩm DNase/RNase-free, tương thích với các dòng máy và pipette phổ biến trên thị trường.",
    highlights: [
      "DNase/RNase-free, không nhiễm DNA/RNA ngoại lai",
      "Tương thích nhiều dòng máy PCR và pipette",
      "Có lựa chọn đầu côn có lọc cho thao tác nhạy cảm",
    ],
    imageLabel: "PCR Tubes & Tips",
    imageTone: "from-slate-400 to-sky-300",
    pdfPath: "/api/catalog/pcr-tubes-tips",
    featured: false,
  },
  {
    slug: "ppe-lab-safety",
    name: "Vật tư bảo hộ phòng lab",
    category: "khac",
    categoryName: "Khác",
    subcategory: "Vật tư bảo hộ",
    manufacturer: "Đa hãng",
    applications: ["An toàn phòng lab", "Vật tư tiêu hao"],
    shortDescription:
      "Găng tay nitrile, khẩu trang, kính bảo hộ và vật tư bảo hộ cá nhân cho phòng thí nghiệm.",
    description:
      "TAKO Vietnam cung cấp vật tư bảo hộ cá nhân (PPE) cho phòng thí nghiệm, bao gồm găng tay nitrile không bột, khẩu trang y tế và N95, kính bảo hộ và áo blouse. Sản phẩm đáp ứng tiêu chuẩn an toàn sinh học cho phòng lab cấp độ BSL-1 và BSL-2.",
    highlights: [
      "Đáp ứng tiêu chuẩn BSL-1 và BSL-2",
      "Găng tay nitrile không bột, ít gây dị ứng",
      "Đa dạng kích cỡ và số lượng đặt hàng",
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
    title: "Proteomics đơn phân tử đang thay đổi tốc độ giải mã cơ chế bệnh học",
    excerpt:
      "Từ sequencing protein đến PTM, các nền tảng mới đang mở rộng khả năng phát hiện biomarker cho y học chính xác.",
    date: "2026-05-10",
    tag: "Proteomics",
  },
  {
    slug: "ngs-trong-chan-doan-ung-thu-thuong-quy",
    title: "NGS trong chẩn đoán ung thư thường quy: bài toán độ nhạy, panel và vận hành",
    excerpt:
      "Áp lực từ lâm sàng đang đẩy nhanh nhu cầu tự động hóa, chuẩn hóa panel và gắn kết phân tích dữ liệu với điều trị đích.",
    date: "2026-05-06",
    tag: "NGS",
  },
  {
    slug: "sepsis-va-cuoc-dua-rut-ngan-thoi-gian-tra-ket-qua",
    title: "Sepsis và cuộc đua rút ngắn thời gian trả kết quả trong hồi sức cấp cứu",
    excerpt:
      "Chẩn đoán nhanh tác nhân gây bệnh và thông tin kháng kháng sinh là biến số có thể thay đổi phác đồ điều trị sớm.",
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