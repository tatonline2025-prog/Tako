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
    name: "He thong phan tich protein Platinum Pro",
    category: "proteomics",
    categoryName: "Proteomics",
    subcategory: "He thong phan tich protein Platinum Pro",
    manufacturer: "Quantum-Si",
    applications: ["Proteomics", "PTM", "Drug discovery", "Y hoc chinh xac"],
    shortDescription:
      "He thong giai trinh tu protein don phan tu dua tren chip ban dan, tu dong hoa va kich thuoc nho gon.",
    description:
      "Quantum-Si cung cap cong nghe giai trinh tu protein don phan tu dau tien tren the gioi, cho phep xac dinh acid amin va cac bien doi sau dich ma voi do phan giai cao. Nen tang phu hop cho phong nghien cuu can du lieu protein nhanh, chi phi hop ly va kha nang mo rong de phuc vu phat hien thuoc va chan doan chinh xac.",
    highlights: [
      "Chip ban dan cho phep doc du lieu protein nhanh",
      "Ho tro phat hien PTM o muc do chi tiet",
      "Kich thuoc nho gon, de dua vao phong thí nghiem hien huu",
    ],
    imageLabel: "Quantum-Si Platinum Pro",
    imageTone: "from-sky-500 to-cyan-300",
    pdfPath: "/api/catalog/platinum-pro-protein-sequencer",
    featured: true,
  },
  {
    slug: "mgi-sequencer",
    name: "May giai trinh tu MGI",
    category: "ngs",
    categoryName: "Giai trinh tu Gene the he moi (NGS)",
    subcategory: "May giai trinh tu MGI",
    manufacturer: "MGI",
    applications: ["Ung thu", "Di truyen", "Sinh thiet long", "Chan doan thuong quy"],
    shortDescription:
      "Nen tang NGS cho chan doan thuong quy va phat hien ton thuong di truyen voi nguong phat hien den 0,01%.",
    description:
      "He thong MGI huong toi workflow NGS cho phong xet nghiem lam sang, ho tro phat hien bien doi di truyen tu mo ung thu va mau sinh thiet long. Panel chan doan duoc cap nhat theo khuyen cao NCCN va ESMO, ho tro don vi chan doan mo rong nang luc genomics thuong quy.",
    highlights: [
      "Nguong phat hien xuong den 0,01%",
      "Phu hop cho mau mo ung thu va sinh thiet long",
      "Co the tich hop vao quy trinh chan doan thuong quy",
    ],
    imageLabel: "MGI Sequencer",
    imageTone: "from-blue-600 to-indigo-400",
    pdfPath: "/api/catalog/mgi-sequencer",
    featured: true,
  },
  {
    slug: "ngs-reagents",
    name: "Hoa chat phuc vu cho NGS",
    category: "ngs",
    categoryName: "Giai trinh tu Gene the he moi (NGS)",
    subcategory: "Hoa chat phuc vu cho NGS",
    manufacturer: "NadigmBio / Igenetech",
    applications: ["Ung thu", "Di truyen", "San loc truoc sinh", "Dich te hoc"],
    shortDescription:
      "Hoa chat va workflow toan dien tu chuan bi thu vien den phan tich du lieu NGS.",
    description:
      "TAKO Vietnam nhap khau truc tiep hoa chat va bo kit tu NadigmBio va Igenetech, phuc vu quy trinh NGS tron ven. Giai phap ho tro ung dung trong ung thu, benh di truyen, san loc truoc sinh va giam sat dich te hoc voi muc tieu toi uu hoa do on dinh va tinh nhat quan cua quy trinh.",
    highlights: [
      "Day du thanh phan cho workflow NGS",
      "Ho tro nhieu bai toan lam sang va nghien cuu",
      "Thich hop de chuan hoa quy trinh phong xet nghiem",
    ],
    imageLabel: "NGS Reagents",
    imageTone: "from-cyan-500 to-sky-300",
    pdfPath: "/api/catalog/ngs-reagents",
    featured: true,
  },
  {
    slug: "mgisp-library-prep",
    name: "May chuan bi thu vien tu dong MGISP",
    category: "ngs",
    categoryName: "Giai trinh tu Gene the he moi (NGS)",
    subcategory: "May chuan bi thu vien tu dong (MGISP)",
    manufacturer: "MGI",
    applications: ["NGS", "Tu dong hoa", "Phong xet nghiem"],
    shortDescription:
      "He thong tu dong hoa khau chuan bi thu vien cho NGS, giam sai so va tiet kiem nhan luc.",
    description:
      "MGISP tu dong hoa buoc chuan bi thu vien cho NGS, giup phong xet nghiem nang cao tinh dong nhat ket qua va giai phong nhan su khoi cac thao tac lap lai. Giai phap phu hop cho don vi can mo rong cong suat ma van kiem soat duoc chat luong quy trinh.",
    highlights: [
      "Dong nhat hoa thao tac lap thu vien",
      "Giam thoi gian thao tac thu cong",
      "Phu hop cho phong lab can mo rong cong suat",
    ],
    imageLabel: "MGISP Automation",
    imageTone: "from-indigo-500 to-sky-400",
    pdfPath: "/api/catalog/mgisp-library-prep",
    featured: false,
  },
  {
    slug: "microbio-sepsis-qpcr",
    name: "Giai phap benh truyen nhiem va sepsis",
    category: "sinh-hoc-phan-tu",
    categoryName: "Giai phap xet nghiem sinh hoc phan tu",
    subcategory: "Benh truyen nhiem",
    manufacturer: "Microbio",
    applications: ["Truyen nhiem", "Sepsis", "Khang khang sinh", "Bacteriophage"],
    shortDescription:
      "Kit chan doan nhanh sepsis tren he thong qPCR, phat hien truc tiep tac nhan gay benh tu mau toan phan.",
    description:
      "Giai phap cua Microbio giup rut ngan thoi gian tra ket qua trong benh canh sepsis bang cach phat hien truc tiep tac nhan gay benh tu mau toan phan tren nen tang qPCR. Ben canh do, TAKO cung cap sinh pham phuc vu san tim, phan tich va dinh danh bacteriophage cho nghien cuu va dieu tri.",
    highlights: [
      "Rut ngan thoi gian tra ket qua trong sepsis",
      "Ho tro ra quyet dinh khang sinh kip thoi",
      "Mo rong cho nghien cuu bacteriophage",
    ],
    imageLabel: "Microbio Sepsis",
    imageTone: "from-slate-700 to-sky-500",
    pdfPath: "/api/catalog/microbio-sepsis-qpcr",
    featured: true,
  },
  {
    slug: "bioer-pcr-realtime-pcr",
    name: "May PCR / Realtime PCR Bioer",
    category: "sinh-hoc-phan-tu",
    categoryName: "Giai phap xet nghiem sinh hoc phan tu",
    subcategory: "May PCR / Realtime PCR",
    manufacturer: "Bioer",
    applications: ["PCR", "qPCR", "Chan doan lam sang", "Phong lab thuong quy"],
    shortDescription:
      "He thong PCR va realtime PCR ben bi, kinh te va van hanh on dinh trong nhieu dieu kien phong lab.",
    description:
      "Bioer Technology la nha san xuat thiet bi PCR noi tieng nhờ do ben, tinh kinh te va giao dien than thien. Giai phap thich hop cho phong xet nghiem can mot nen tang van hanh on dinh, de dao tao va de tich hop vao workflow thuong quy.",
    highlights: [
      "Do ben cao trong moi truong van hanh lien tuc",
      "Chi phi dau tu hop ly",
      "Phu hop cho phong xet nghiem va trung tam nghien cuu",
    ],
    imageLabel: "Bioer PCR",
    imageTone: "from-blue-500 to-cyan-400",
    pdfPath: "/api/catalog/bioer-pcr-realtime-pcr",
    featured: false,
  },
  {
    slug: "gdsbio-reagents",
    name: "Sinh pham PCR, qPCR, tach chiet GDSBio",
    category: "sinh-hoc-phan-tu",
    categoryName: "Giai phap xet nghiem sinh hoc phan tu",
    subcategory: "Sinh pham PCR, qPCR, tach chiet",
    manufacturer: "GDSBio",
    applications: ["PCR", "qPCR", "Tach chiet", "NGS"],
    shortDescription:
      "Enzyme, kit PCR/qPCR, tach chiet nucleic acid va chuan bi thu vien NGS dat chuan ISO 9001 va ISO 13485.",
    description:
      "GDSBio cung cap he sinh thai sinh pham da dang cho sinh hoc phan tu va chan doan lam sang, bao gom enzyme chat luong cao, kit PCR/qPCR, kit tach chiet acid nucleic va thanh phan chuan bi thu vien NGS. Danh muc phu hop cho don vi can nguon cung cap on dinh va de chuan hoa.",
    highlights: [
      "Chung nhan ISO 9001 va ISO 13485",
      "Danh muc trai dai tu PCR den NGS",
      "Phu hop cho chan doan lam sang va nghien cuu",
    ],
    imageLabel: "GDSBio Reagents",
    imageTone: "from-cyan-600 to-blue-400",
    pdfPath: "/api/catalog/gdsbio-reagents",
    featured: true,
  },
  {
    slug: "esco-lab-equipment",
    name: "Thiet bi phong lab co ban Esco",
    category: "sinh-hoc-phan-tu",
    categoryName: "Giai phap xet nghiem sinh hoc phan tu",
    subcategory: "Thiet bi phong lab co ban",
    manufacturer: "Esco",
    applications: ["Phong lab", "Te bao", "An toan sinh hoc"],
    shortDescription:
      "May ly tam, tu an toan sinh hoc, may u CO2 va cac thiet bi nen tang cho phong lab hien dai.",
    description:
      "Danh muc Esco bo sung cac thiet bi co ban cho van hanh phong thí nghiem va khu vuc nuoi cay te bao, tu may ly tam den tu an toan sinh hoc va may u CO2. Giai phap giup don vi dong bo ha tang cho xet nghiem, nghien cuu va san xuat quy mo nho.",
    highlights: [
      "Day du cac thiet bi nen tang cho phong lab",
      "Phu hop cho khu vuc nuoi cay te bao",
      "Ho tro dong bo ha tang van hanh",
    ],
    imageLabel: "Esco Lab",
    imageTone: "from-slate-600 to-cyan-500",
    pdfPath: "/api/catalog/esco-lab-equipment",
    featured: false,
  },
  {
    slug: "hla-typing-panels",
    name: "Giai phap HLA typing",
    category: "sinh-hoc-phan-tu",
    categoryName: "Giai phap xet nghiem sinh hoc phan tu",
    subcategory: "HLA typing",
    manufacturer: "Igenetech",
    applications: ["HLA", "Ghep tang", "Y hoc ca the hoa"],
    shortDescription:
      "Panel dinh typ HLA tai moi locus cho benh nhan va nguoi hien tang voi chi phi canh tranh.",
    description:
      "Danh muc HLA typing ho tro dinh typ tai nhieu locus phuc vu ghep tang va y hoc ca the hoa. Giai phap duoc dinh huong cho don vi can quy trinh co do phu cao, chi phi canh tranh va kha nang trien khai phu hop voi nang luc hien tai.",
    highlights: [
      "Ho tro day du locus HLA",
      "Phuc vu ghep tang va y hoc ca the hoa",
      "Chi phi canh tranh cho don vi lam sang",
    ],
    imageLabel: "HLA Typing",
    imageTone: "from-sky-700 to-blue-500",
    pdfPath: "/api/catalog/hla-typing-panels",
    featured: false,
  },
  {
    slug: "basic-reagents",
    name: "Enzyme, buffer, kit tach chiet",
    category: "sinh-pham-co-ban",
    categoryName: "Sinh pham co ban",
    subcategory: "Enzyme, buffer, kit tach chiet",
    manufacturer: "GDSBio",
    applications: ["PCR", "qPCR", "Tach chiet"],
    shortDescription:
      "Danh muc dang duoc bo sung de dong bo hoa nguon cung cap sinh pham co ban cho phong lab.",
    description:
      "Danh muc sinh pham co ban duoc giu san cau truc de cap nhat them thong tin san pham, thong so va tai lieu khi du lieu catalog chinh thuc duoc cung cap. Giai doan demo tap trung vao kha nang phan loai va tim kiem.",
    highlights: [
      "San sang de bo sung theo catalog thuc te",
      "Phu hop cho workflow sinh hoc phan tu co ban",
      "Cho phep mo rong nhanh khi co them du lieu",
    ],
    imageLabel: "Basic Reagents",
    imageTone: "from-slate-500 to-sky-300",
    pdfPath: "/api/catalog/basic-reagents",
    featured: false,
  },
  {
    slug: "lab-consumables",
    name: "Phu kien, hoa chat, vat tu tieu hao",
    category: "khac",
    categoryName: "Khac",
    subcategory: "Phu kien, hoa chat, vat tu tieu hao",
    manufacturer: "Da hang",
    applications: ["Vat tu tieu hao", "Hoa chat", "Phong lab"],
    shortDescription:
      "Danh muc san pham ho tro phong lab khong thuoc cac nhom chinh, phuc vu mua sam dong bo.",
    description:
      "TAKO Vietnam duy tri nhom san pham phu tro de dap ung nhu cau dong bo vat tu, hoa chat va phu kien khong nam trong cac nhom giai phap chinh. Khach hang co the lien he truc tiep de duoc tu van danh muc phu hop voi quy trinh hien huu.",
    highlights: [
      "Ho tro mua sam dong bo cho phong lab",
      "Tu van theo nhu cau van hanh thuc te",
      "Bo sung nhanh theo danh muc hang hoa phat sinh",
    ],
    imageLabel: "Consumables",
    imageTone: "from-zinc-600 to-sky-400",
    pdfPath: "/api/catalog/lab-consumables",
    featured: false,
  },
];

export const newsArticles: NewsArticle[] = [
  {
    slug: "cong-nghe-proteomics-trong-y-hoc-chinh-xac",
    title: "Proteomics don phan tu dang thay doi toc do giai ma co che benh hoc",
    excerpt:
      "Tu sequencing protein den PTM, cac nen tang moi dang mo rong kha nang phat hien biomarker cho y hoc chinh xac.",
    date: "2026-05-10",
    tag: "Proteomics",
  },
  {
    slug: "ngs-trong-chan-doan-ung-thu-thuong-quy",
    title: "NGS trong chan doan ung thu thuong quy: bai toan do nhay, panel va van hanh",
    excerpt:
      "Ap luc tu lam sang dang day nhanh nhu cau tu dong hoa, chuan hoa panel va gan ket phan tich du lieu voi dieu tri dich.",
    date: "2026-05-06",
    tag: "NGS",
  },
  {
    slug: "sepsis-va-cuoc-dua-rut-ngan-thoi-gian-tra-ket-qua",
    title: "Sepsis va cuoc dua rut ngan thoi gian tra ket qua trong hoi suc cap cuu",
    excerpt:
      "Chan doan nhanh tac nhan gay benh va thong tin khang khang sinh la bien so co the thay doi phac do dieu tri som.",
    date: "2026-04-30",
    tag: "Truyen nhiem",
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