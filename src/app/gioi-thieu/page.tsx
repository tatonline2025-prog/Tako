import type { Metadata } from "next";
import Link from "next/link";
import { getSiteMetadata } from "@/data/site";
import { getRequestLocale, localizeText } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Giới thiệu | About",
  description:
    "TAKO Vietnam – đối tác phân phối thiết bị, sinh phẩm và giải pháp công nghệ sinh học cho y tế và nghiên cứu khoa học.",
};

const copy = {
  eyebrow: { en: "About Us", vi: "Giới thiệu" },
  h1: {
    en: "TAKO Vietnam — bringing biotechnology into real-world clinical and research practice",
    vi: "TAKO Vietnam — đưa công nghệ sinh học vào vận hành thực tế tại bệnh viện, phòng xét nghiệm và trung tâm nghiên cứu",
  },
  intro1: {
    en: "TAKO Vietnam was established amid a global biotechnology revolution becoming one of the strategic pillars of sustainable development, closely tied to food security and healthcare quality. The company positions itself as a distribution and solution integration partner for B2B clients in healthcare and scientific research.",
    vi: "TAKO Việt Nam ra đời trong bối cảnh cách mạng công nghệ sinh học đang trở thành một trong những trụ cột chiến lược của phát triển bền vững, gắn chặt với bảo đảm an ninh lương thực và nâng cao chất lượng chăm sóc sức khỏe. Doanh nghiệp định vị mình là đối tác phân phối và tích hợp giải pháp cho các đơn vị B2B trong y tế và nghiên cứu khoa học.",
  },
  intro2: {
    en: "TAKO Vietnam follows major orientations on science, technology, and innovation — particularly Resolution 57-NQ/TW and 36-NQ/TW — aiming to build a biotechnology ecosystem with real deployment capacity and long-term scalability.",
    vi: "Hướng phát triển của TAKO Vietnam bám theo các chủ trương lớn về khoa học công nghệ và đổi mới sáng tạo, đặc biệt là Nghị quyết 57-NQ/TW và 36-NQ/TW, với mục tiêu góp phần xây dựng một hệ sinh thái công nghệ sinh học có năng lực triển khai thực tế và khả năng mở rộng lâu dài.",
  },
  visionLabel: { en: "Vision & Mission", vi: "Tầm nhìn và sứ mệnh" },
  visionTitle: { en: "Vision", vi: "Tầm nhìn" },
  visionText: {
    en: "To become the preferred partner when healthcare units, laboratories, and research centers in Vietnam need a biotechnology solution ecosystem with real deployment capacity, up-to-date technologies, and sustainable supply.",
    vi: "Trở thành đối tác được ưu tiên khi các đơn vị y tế, phòng xét nghiệm và nghiên cứu tại Việt Nam cần một hệ sinh thái giải pháp công nghệ sinh học có khả năng triển khai thực tế, cập nhật và bền vững.",
  },
  missionTitle: { en: "Mission", vi: "Sứ mệnh" },
  missionText: {
    en: "Develop a distribution network covering the full chain from R&D and pilot production to routine diagnostics and industrial-scale manufacturing in biotechnology and molecular biomedicine.",
    vi: "Phát triển mạng lưới phân phối dịch vụ, sinh phẩm và thiết bị bao phủ từ nghiên cứu phát triển, sản xuất thử nghiệm đến chẩn đoán thường quy và sản xuất quy mô công nghiệp trong công nghệ sinh học và y sinh phân tử.",
  },
  strategyLabel: { en: "Strategic foundation", vi: "Nền tảng chiến lược" },
  capabilityEyebrow: { en: "Capabilities", vi: "Năng lực doanh nghiệp" },
  capabilityTitle: {
    en: "Solution groups organized clearly for B2B clients to quickly find the right technology",
    vi: "Các nhóm giải pháp được tổ chức rõ ràng để khách hàng B2B nhanh chóng tìm đúng công nghệ cần thiết",
  },
  capabilityDesc: {
    en: "TAKO Vietnam helps clients quickly understand which technology groups, partner brands, and applications best fit their diagnostic or research challenges.",
    vi: "TAKO Vietnam giúp khách hàng nhanh chóng hiểu được những nhóm công nghệ, hãng đối tác và ứng dụng nào phù hợp nhất với bài toán xét nghiệm hay nghiên cứu của mình.",
  },
  cta: { en: "Contact for partnership", vi: "Liên hệ hợp tác" },
};

const strategicContextItems = [
  {
    title: { en: "Formation context", vi: "Bối cảnh hình thành" },
    description: {
      en: "TAKO Vietnam was founded as biotechnology becomes a strategic pillar of sustainable development, linked to food security, healthcare quality, and national innovation capacity.",
      vi: "TAKO Việt Nam ra đời trong bối cảnh công nghệ sinh học trở thành một trụ cột chiến lược của phát triển bền vững, gắn với an ninh lương thực, chất lượng chăm sóc sức khỏe và năng lực đổi mới của quốc gia.",
    },
  },
  {
    title: { en: "Policy alignment", vi: "Định hướng chính sách" },
    description: {
      en: "The company's development aligns with Resolution 57-NQ/TW (Dec 22, 2024) and Resolution 36-NQ/TW (Jan 30, 2023) on science, technology, innovation, and biotechnology development.",
      vi: "Định hướng phát triển của công ty bám sát tinh thần của Nghị quyết 57-NQ/TW ngày 22/12/2024 và Nghị quyết 36-NQ/TW ngày 30/01/2023 về phát triển khoa học, công nghệ, đổi mới sáng tạo và công nghệ sinh học.",
    },
  },
  {
    title: { en: "Deployment model", vi: "Mô hình triển khai" },
    description: {
      en: "We prioritize building a distribution network of reagents, equipment, and services covering the full chain from research and pilot testing to routine diagnostics and industrial-scale manufacturing.",
      vi: "Chúng tôi ưu tiên xây dựng mạng lưới phân phối sinh phẩm, thiết bị và dịch vụ phục vụ toàn bộ chuỗi từ nghiên cứu, thử nghiệm đến chẩn đoán thường quy và sản xuất quy mô công nghiệp.",
    },
  },
];

const capabilityItems = [
  {
    title: { en: "Infectious disease & sepsis diagnostics", vi: "Chẩn đoán truyền nhiễm và sepsis" },
    description: {
      en: "TAKO focuses on microbial pathogens, bloodstream infection agents, antibiotic resistance genes, and bacteriophage solutions. Microbio's sepsis kit (Australia) on qPCR enables direct pathogen detection from whole blood, shortening result turnaround and supporting timely antibiotic selection.",
      vi: "TAKO tập trung vào các mầm bệnh vi sinh vật, tác nhân gây nhiễm khuẩn huyết, gene kháng kháng sinh và các giải pháp hỗ trợ thực khuẩn thể. Kit sepsis của Microbio (Úc) trên nền qPCR giúp phát hiện trực tiếp tác nhân gây bệnh từ máu toàn phần, rút ngắn thời gian trả kết quả và hỗ trợ lựa chọn kháng sinh kịp thời.",
    },
  },
  {
    title: { en: "NGS for oncology, genetics & epidemiology", vi: "NGS cho ung thư, di truyền và dịch tễ học" },
    description: {
      en: "The NGS catalog from NadigmBio and Igenetech supports oncology, genetic disease, prenatal screening, and epidemiological surveillance with variant detection thresholds down to 0.01%.",
      vi: "Danh mục NGS từ NadigmBio và Igenetech phục vụ ung thư, bệnh di truyền, sàng lọc trước sinh và giám sát dịch tễ, với ngưỡng phát hiện biến thể đến 0,01%.",
    },
  },
  {
    title: { en: "HLA typing & personalized medicine", vi: "HLA typing và y học cá thể hóa" },
    description: {
      en: "The company provides HLA typing panels at all loci for patients and donors at competitive costs, supporting transplantation and personalized medicine applications.",
      vi: "Công ty cung cấp các panel định typ HLA tại mọi locus cho bệnh nhân và người hiến tạng với chi phí cạnh tranh, phục vụ ghép tạng và các ứng dụng y học cá thể hóa.",
    },
  },
  {
    title: { en: "Next-generation proteomics", vi: "Proteomics thế hệ mới" },
    description: {
      en: "Partner Quantum-Si introduces next-generation proteomics with the Platinum® platform — the world's first single-molecule protein sequencing system using semiconductor chips, enabling amino acid identification and PTM detection at high resolution.",
      vi: "Đối tác Quantum-Si mở ra hướng tiếp cận proteomics thế hệ mới với nền tảng Platinum®, hệ thống giải trình tự protein đơn phân tử đầu tiên trên thế giới sử dụng chip bán dẫn, cho phép xác định axit amin và biến đổi sau dịch mã với độ phân giải rất cao.",
    },
  },
  {
    title: { en: "Routine PCR & lab infrastructure", vi: "PCR thường quy và hạ tầng phòng lab" },
    description: {
      en: "TAKO is the Vietnam distributor for PCR and Realtime PCR reagents and equipment. GDSBio supplies enzymes, kits, nucleic acid extraction and NGS library prep; Bioer provides durable PCR systems; Esco supplements with centrifuges, biosafety cabinets, CO2 incubators, and cell culture equipment.",
      vi: "TAKO là nhà phân phối tại Việt Nam của các sinh phẩm và thiết bị cho PCR, Realtime PCR và phòng thí nghiệm thường quy. GDSBio cung cấp enzyme, kit PCR/qPCR, tách chiết nucleic acid; Bioer cung cấp hệ máy PCR bền, ổn định; Esco bổ sung máy ly tâm, tủ an toàn sinh học và máy ủ CO2.",
    },
  },
];

export default async function AboutPage() {
  const locale = await getRequestLocale();
  const siteMetadata = getSiteMetadata(locale);

  return (
    <div className="section-shell py-12 sm:py-16">
      <section className="panel grid gap-8 px-6 py-8 lg:grid-cols-[1fr_0.9fr] lg:px-8 lg:py-10">
        <div className="space-y-5">
          <span className="eyebrow">{localizeText(copy.eyebrow, locale)}</span>
          <h1 className="section-title">{localizeText(copy.h1, locale)}</h1>
          <p className="section-copy">{siteMetadata.legalName} — {localizeText(copy.intro1, locale)}</p>
          <p className="section-copy">{localizeText(copy.intro2, locale)}</p>
        </div>

        <div className="rounded-[2rem] bg-[linear-gradient(160deg,#0d2d62,#165cbb)] p-6 text-white shadow-[0_30px_90px_rgba(13,45,98,0.24)]">
          <div className="text-sm uppercase tracking-[0.24em] text-white/70">
            {localizeText(copy.visionLabel, locale)}
          </div>
          <div className="mt-5 space-y-5">
            <div className="rounded-[1.5rem] border border-white/14 bg-white/8 p-5">
              <h2 className="font-[family:var(--font-display)] text-2xl font-semibold">{localizeText(copy.visionTitle, locale)}</h2>
              <p className="mt-3 text-sm leading-7 text-white/82">{localizeText(copy.visionText, locale)}</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/14 bg-white/8 p-5">
              <h2 className="font-[family:var(--font-display)] text-2xl font-semibold">{localizeText(copy.missionTitle, locale)}</h2>
              <p className="mt-3 text-sm leading-7 text-white/82">{localizeText(copy.missionText, locale)}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 py-16 lg:grid-cols-3">
        {strategicContextItems.map((item, i) => (
          <article key={i} className="panel px-6 py-6">
            <div className="text-xs uppercase tracking-[0.22em] text-[var(--color-primary)]">
              {localizeText(copy.strategyLabel, locale)}
            </div>
            <h2 className="mt-3 font-[family:var(--font-display)] text-2xl font-semibold text-[var(--color-ink)]">
              {localizeText(item.title, locale)}
            </h2>
            <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
              {localizeText(item.description, locale)}
            </p>
          </article>
        ))}
      </section>

      <section className="panel grid gap-8 px-6 py-8 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <div className="space-y-4">
          <span className="eyebrow">{localizeText(copy.capabilityEyebrow, locale)}</span>
          <h2 className="section-title">{localizeText(copy.capabilityTitle, locale)}</h2>
          <p className="section-copy">{localizeText(copy.capabilityDesc, locale)}</p>
          <Link
            href="/lien-he"
            className="inline-flex rounded-full bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white"
          >
            {localizeText(copy.cta, locale)}
          </Link>
        </div>

        <div className="grid gap-4">
          {capabilityItems.map((group, i) => (
            <div key={i} className="rounded-[1.5rem] border border-[var(--color-line)] bg-white px-5 py-5">
              <h3 className="font-[family:var(--font-display)] text-xl font-semibold text-[var(--color-ink)]">
                {localizeText(group.title, locale)}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                {localizeText(group.description, locale)}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
