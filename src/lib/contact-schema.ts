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
    .min(2, "Vui lòng nhập họ tên đầy đủ.")
    .max(120, "Họ tên quá dài."),
  email: z.email("Email không hợp lệ.").max(160, "Email quá dài."),
  phone: z
    .string()
    .trim()
    .min(8, "Vui lòng nhập số điện thoại hợp lệ.")
    .max(30, "Số điện thoại quá dài.")
    .regex(/^[+()\d\s.-]+$/, "Số điện thoại chỉ được chứa số và ký tự cơ bản."),
  company: z
    .string()
    .trim()
    .min(2, "Vui lòng nhập tên công ty.")
    .max(160, "Tên công ty quá dài."),
  interest: z
    .string()
    .trim()
    .min(1, "Vui lòng chọn danh mục hoặc sản phẩm quan tâm.")
    .max(200, "Thông tin quan tâm quá dài."),
  message: z
    .string()
    .trim()
    .min(10, "Vui lòng mô tả nhu cầu cụ thể hơn.")
    .max(4000, "Nội dung vượt quá giới hạn cho phép."),
});

export type ContactSubmissionInput = z.infer<typeof contactSubmissionSchema>;