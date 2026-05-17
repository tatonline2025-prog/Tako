import { getMongoDatabase } from "@/lib/mongodb";

export type LocalizedText = { en: string; vi: string };

export type HomeContent = {
  eyebrow: LocalizedText;
  subhead: LocalizedText;
  heroDesc: LocalizedText;
  featuredProductsTitle: LocalizedText;
  newsTitle: LocalizedText;
};

export type AboutContent = {
  h1: LocalizedText;
  intro1: LocalizedText;
  intro2: LocalizedText;
  visionText: LocalizedText;
  missionText: LocalizedText;
  capabilityTitle: LocalizedText;
  capabilityDesc: LocalizedText;
};

type SiteContentDocument = {
  _id: "home" | "about";
  value: HomeContent | AboutContent;
  updatedAt: Date;
};

export const defaultHomeContent: HomeContent = {
  eyebrow: {
    en: "B2B biotechnology solutions",
    vi: "Giải pháp công nghệ sinh học B2B",
  },
  subhead: {
    en: "TAKO Vietnam connects equipment, reagents, and workflows for laboratories, hospitals, research centers, institutes, and biotech enterprises.",
    vi: "TAKO Vietnam kết nối thiết bị, sinh phẩm và workflow ứng dụng cho phòng xét nghiệm, bệnh viện, trung tâm nghiên cứu, viện kiểm định và doanh nghiệp dược sinh học.",
  },
  heroDesc: {
    en: "Our catalog-first approach focuses on technical descriptions, downloadable documents, and direct quote requests — built for B2B biotech procurement.",
    vi: "Hướng tiếp cận tập trung vào mô tả kỹ thuật, tài liệu tải xuống và liên hệ báo giá — xây dựng cho mua sắm B2B công nghệ sinh học.",
  },
  featuredProductsTitle: {
    en: "Highlighted solutions presented in technical catalog format",
    vi: "Các giải pháp nổi bật được trình bày theo catalog kỹ thuật",
  },
  newsTitle: {
    en: "Content for lab leaders, hospitals and R&D units",
    vi: "Nội dung dành cho lãnh đạo phòng lab, bệnh viện và đơn vị R&D",
  },
};

export const defaultAboutContent: AboutContent = {
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
  visionText: {
    en: "To become the preferred partner when healthcare units, laboratories, and research centers in Vietnam need a biotechnology solution ecosystem with real deployment capacity, up-to-date technologies, and sustainable supply.",
    vi: "Trở thành đối tác được ưu tiên khi các đơn vị y tế, phòng xét nghiệm và nghiên cứu tại Việt Nam cần một hệ sinh thái giải pháp công nghệ sinh học có khả năng triển khai thực tế, cập nhật và bền vững.",
  },
  missionText: {
    en: "Develop a distribution network covering the full chain from R&D and pilot production to routine diagnostics and industrial-scale manufacturing in biotechnology and molecular biomedicine.",
    vi: "Phát triển mạng lưới phân phối dịch vụ, sinh phẩm và thiết bị bao phủ từ nghiên cứu phát triển, sản xuất thử nghiệm đến chẩn đoán thường quy và sản xuất quy mô công nghiệp trong công nghệ sinh học và y sinh phân tử.",
  },
  capabilityTitle: {
    en: "Solution groups organized clearly for B2B clients to quickly find the right technology",
    vi: "Các nhóm giải pháp được tổ chức rõ ràng để khách hàng B2B nhanh chóng tìm đúng công nghệ cần thiết",
  },
  capabilityDesc: {
    en: "TAKO Vietnam helps clients quickly understand which technology groups, partner brands, and applications best fit their diagnostic or research challenges.",
    vi: "TAKO Vietnam giúp khách hàng nhanh chóng hiểu được những nhóm công nghệ, hãng đối tác và ứng dụng nào phù hợp nhất với bài toán xét nghiệm hay nghiên cứu của mình.",
  },
};

async function getCollection() {
  const database = await getMongoDatabase();
  return database.collection<SiteContentDocument>("site_content");
}

export async function getHomeContent(): Promise<HomeContent> {
  try {
    const collection = await getCollection();
    const doc = await collection.findOne({ _id: "home" });
    if (!doc) return defaultHomeContent;
    return {
      ...defaultHomeContent,
      ...(doc.value as Partial<HomeContent>),
    };
  } catch {
    return defaultHomeContent;
  }
}

export async function getAboutContent(): Promise<AboutContent> {
  try {
    const collection = await getCollection();
    const doc = await collection.findOne({ _id: "about" });
    if (!doc) return defaultAboutContent;
    return {
      ...defaultAboutContent,
      ...(doc.value as Partial<AboutContent>),
    };
  } catch {
    return defaultAboutContent;
  }
}

export async function saveHomeContent(value: HomeContent) {
  const collection = await getCollection();
  await collection.updateOne(
    { _id: "home" },
    {
      $set: {
        _id: "home",
        updatedAt: new Date(),
        value,
      },
    },
    { upsert: true },
  );
}

export async function saveAboutContent(value: AboutContent) {
  const collection = await getCollection();
  await collection.updateOne(
    { _id: "about" },
    {
      $set: {
        _id: "about",
        updatedAt: new Date(),
        value,
      },
    },
    { upsert: true },
  );
}
