import { z } from "zod";
import { categories, products } from "@/data/site";

export const contactInterestOptions = Array.from(
  new Set([
    ...categories.map((category) => category.name),
    ...products.map((product) => product.name),
  ]),
);

export const contactSubmissionSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Vui long nhap ho ten day du.")
    .max(120, "Ho ten qua dai."),
  email: z.email("Email khong hop le.").max(160, "Email qua dai."),
  phone: z
    .string()
    .trim()
    .min(8, "Vui long nhap so dien thoai hop le.")
    .max(30, "So dien thoai qua dai.")
    .regex(/^[+()\d\s.-]+$/, "So dien thoai chi duoc chua so va ky tu co ban."),
  company: z
    .string()
    .trim()
    .min(2, "Vui long nhap ten cong ty.")
    .max(160, "Ten cong ty qua dai."),
  interest: z
    .string()
    .trim()
    .min(1, "Vui long chon danh muc hoac san pham quan tam.")
    .max(200, "Thong tin quan tam qua dai."),
  message: z
    .string()
    .trim()
    .min(10, "Vui long mo ta nhu cau cu the hon.")
    .max(4000, "Noi dung vuot qua gioi han cho phep."),
});

export type ContactSubmissionInput = z.infer<typeof contactSubmissionSchema>;