import type { Metadata } from "next";
import Link from "next/link";
import { siteMetadata } from "@/data/site";

export const metadata: Metadata = {
  title: "Gioi thieu",
  description:
    "Tong quan ve TAKO Vietnam, boi canh hinh thanh doanh nghiep, dinh huong cong nghe sinh hoc va cac nhom giai phap trong y sinh phan tu.",
};

const strategicContext = [
  {
    title: "Bối cảnh hình thành",
    description:
      "TAKO Việt Nam ra đời trong bối cảnh công nghệ sinh học trở thành một trụ cột chiến lược của phát triển bền vững, gắn với an ninh lương thực, chất lượng chăm sóc sức khỏe và năng lực đổi mới của quốc gia.",
  },
  {
    title: "Định hướng chính sách",
    description:
      "Định hướng phát triển của công ty bám sát tinh thần của Nghị quyết 57-NQ/TW ngày 22/12/2024 và Nghị quyết 36-NQ/TW ngày 30/01/2023 về phát triển khoa học, công nghệ, đổi mới sáng tạo và công nghệ sinh học.",
  },
  {
    title: "Mô hình triển khai",
    description:
      "Chúng tôi ưu tiên xây dựng mạng lưới phân phối sinh phẩm, thiết bị và dịch vụ phục vụ toàn bộ chuỗi từ nghiên cứu, thử nghiệm đến chẩn đoán thường quy và sản xuất quy mô công nghiệp.",
  },
];

const capabilityGroups = [
  {
    title: "Chẩn đoán truyền nhiễm và sepsis",
    description:
      "TAKO tập trung vào các mầm bệnh vi sinh vật, tác nhân gây nhiễm khuẩn huyết, gene kháng kháng sinh và các giải pháp hỗ trợ thực khuẩn thể. Kit sepsis của Microbio (Úc) trên nền qPCR giúp phát hiện trực tiếp tác nhân gây bệnh từ máu toàn phần, rút ngắn thời gian trả kết quả và hỗ trợ lựa chọn kháng sinh kịp thời.",
  },
  {
    title: "NGS cho ung thư, di truyền và dịch tễ học",
    description:
      "Danh mục NGS được nhập khẩu trực tiếp từ NadigmBio và Igenetech, tối ưu từ chuẩn bị thư viện đến phân tích dữ liệu. Hệ giải pháp này phục vụ mạnh cho ung thư, bệnh di truyền, sàng lọc trước sinh và giám sát dịch tễ, với khả năng phát hiện biến thể ở ngưỡng đến 0,01% và panel luôn được cập nhật theo NCCN, ESMO.",
  },
  {
    title: "HLA typing và y học cá thể hóa",
    description:
      "Công ty đồng thời cung cấp các panel định typ HLA tại mọi locus cho bệnh nhân và người hiến tạng với chi phí cạnh tranh, phục vụ ghép tạng và các ứng dụng y học cá thể hóa.",
  },
  {
    title: "Proteomics thế hệ mới",
    description:
      "Đối tác Quantum-Si mở ra hướng tiếp cận proteomics thế hệ mới với nền tảng Platinum®, hệ thống giải trình tự protein đơn phân tử đầu tiên trên thế giới sử dụng chip bán dẫn. Công nghệ này cho phép xác định axit amin và biến đổi sau dịch mã với độ phân giải rất cao, đồng thời giúp tăng tốc phát hiện thuốc và chẩn đoán y học chính xác.",
  },
  {
    title: "PCR thường quy và hạ tầng phòng lab",
    description:
      "TAKO là nhà phân phối tại Việt Nam của các sinh phẩm và thiết bị cho PCR, Realtime PCR và phòng thí nghiệm thường quy. GDSBio cung cấp enzyme, kit PCR/qPCR, tách chiết nucleic acid và chuẩn bị thư viện NGS; Bioer cung cấp hệ máy PCR bền, ổn định; Esco bổ sung hạ tầng cơ bản như máy ly tâm, tủ an toàn sinh học, máy ủ CO2 và thiết bị nuôi cấy tế bào.",
  },
];

export default function AboutPage() {
  return (
    <div className="section-shell py-12 sm:py-16">
      <section className="panel grid gap-8 px-6 py-8 lg:grid-cols-[1fr_0.9fr] lg:px-8 lg:py-10">
        <div className="space-y-5">
          <span className="eyebrow">Gioi thieu</span>
          <h1 className="section-title">TAKO Vietnam được xây dựng để đưa công nghệ sinh học vào vận hành thực tế tại bệnh viện, phòng xét nghiệm và trung tâm nghiên cứu</h1>
          <p className="section-copy">
            {siteMetadata.legalName} ra đời trong bối cảnh cách mạng công nghiệp sinh học đang trở thành một trong những trụ cột chiến lược của phát triển bền vững, gắn chặt với bảo đảm an ninh lương thực và nâng cao chất lượng chăm sóc sức khỏe. Trong bối cảnh đó, doanh nghiệp định vị mình là đối tác phân phối và tích hợp giải pháp cho các đơn vị B2B trong y tế và nghiên cứu khoa học.
          </p>
          <p className="section-copy">
            Hướng phát triển của TAKO Vietnam bám theo các chủ trương lớn về khoa học công nghệ và đổi mới sáng tạo, đặc biệt là Nghị quyết 57-NQ/TW và 36-NQ/TW, với mục tiêu góp phần xây dựng một hệ sinh thái công nghệ sinh học có năng lực triển khai thực tế, có giá trị ứng dụng rõ ràng và có khả năng mở rộng lâu dài.
          </p>
        </div>

        <div className="rounded-[2rem] bg-[linear-gradient(160deg,#0d2d62,#165cbb)] p-6 text-white shadow-[0_30px_90px_rgba(13,45,98,0.24)]">
          <div className="text-sm uppercase tracking-[0.24em] text-white/70">
            Tam nhin va su menh
          </div>
          <div className="mt-5 space-y-5">
            <div className="rounded-[1.5rem] border border-white/14 bg-white/8 p-5">
              <h2 className="font-[family:var(--font-display)] text-2xl font-semibold">Tầm nhìn</h2>
              <p className="mt-3 text-sm leading-7 text-white/82">
                Trở thành đối tác được ưu tiên khi các đơn vị y tế, phòng xét nghiệm và nghiên cứu tại Việt Nam cần một hệ sinh thái giải pháp công nghệ sinh học có khả năng triển khai thực tế, cập nhật và bền vững.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-white/14 bg-white/8 p-5">
              <h2 className="font-[family:var(--font-display)] text-2xl font-semibold">Sứ mệnh</h2>
              <p className="mt-3 text-sm leading-7 text-white/82">
                Phát triển mạng lưới phân phối dịch vụ, sinh phẩm và thiết bị bao phủ từ nghiên cứu phát triển, sản xuất thử nghiệm đến chẩn đoán thường quy và sản xuất quy mô công nghiệp trong công nghệ sinh học và y sinh phân tử.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 py-16 lg:grid-cols-3">
        {strategicContext.map((value) => (
          <article key={value.title} className="panel px-6 py-6">
            <div className="text-xs uppercase tracking-[0.22em] text-[var(--color-primary)]">Nen tang chien luoc</div>
            <h2 className="mt-3 font-[family:var(--font-display)] text-2xl font-semibold text-[var(--color-ink)]">
              {value.title}
            </h2>
            <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
              {value.description}
            </p>
          </article>
        ))}
      </section>

      <section className="panel grid gap-8 px-6 py-8 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <div className="space-y-4">
          <span className="eyebrow">Nang luc doanh nghiep</span>
          <h2 className="section-title">Nội dung từ hồ sơ giới thiệu được chuyển thành các nhóm giải pháp rõ ràng để khách hàng B2B dễ tra cứu</h2>
          <p className="section-copy">
            Website không chỉ giới thiệu doanh nghiệp mà còn giúp khách hàng nhanh chóng hiểu được TAKO đang mạnh ở những nhóm công nghệ nào, hãng đối tác nào và các ứng dụng nào phù hợp với từng bài toán xét nghiệm hay nghiên cứu.
          </p>
          <Link
            href="/lien-he"
            className="inline-flex rounded-full bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white"
          >
            Lien he hop tac
          </Link>
        </div>

        <div className="grid gap-4">
          {capabilityGroups.map((group) => (
            <div key={group.title} className="rounded-[1.5rem] border border-[var(--color-line)] bg-white px-5 py-5">
              <h3 className="font-[family:var(--font-display)] text-xl font-semibold text-[var(--color-ink)]">
                {group.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                {group.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}