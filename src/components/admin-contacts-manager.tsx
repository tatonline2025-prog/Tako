"use client";

import { useMemo, useState } from "react";
import { Pagination } from "@/components/pagination";
import type { StoredContact } from "@/lib/contact-repository";

type AdminContactsManagerProps = {
  initialContacts: StoredContact[];
};

export function AdminContactsManager({ initialContacts }: AdminContactsManagerProps) {
  const [searchFilter, setSearchFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredContacts = useMemo(() => {
    const query = searchFilter.trim().toLowerCase();
    if (!query) {
      return initialContacts;
    }

    return initialContacts.filter((item) => {
      return [item.fullName, item.email, item.phone, item.company, item.interest, item.message]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
  }, [initialContacts, searchFilter]);

  const paginatedContacts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredContacts.slice(start, start + itemsPerPage);
  }, [currentPage, filteredContacts]);

  return (
    <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Danh sách liên hệ ({filteredContacts.length})</h2>
          <p className="text-sm text-gray-600">Mỗi liên hệ đều được lưu trong CRM, kể cả khi gửi email bị lỗi.</p>
        </div>
      </div>

      <input
        type="text"
        value={searchFilter}
        onChange={(event) => {
          setSearchFilter(event.target.value);
          setCurrentPage(1);
        }}
        placeholder="Tìm theo tên, email, công ty, số điện thoại..."
        className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm"
      />

      <Pagination currentPage={currentPage} totalItems={filteredContacts.length} itemsPerPage={itemsPerPage} onPageChange={setCurrentPage} />

      <div className="space-y-3">
        {paginatedContacts.map((contact) => (
          <div key={contact.id} className="rounded-xl border border-gray-200 bg-slate-50 p-4">
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <p className="text-sm font-semibold text-gray-900">{contact.fullName}</p>
                <p className="text-sm text-gray-700">{contact.company}</p>
              </div>
              <div className="text-sm text-gray-700 md:text-right">
                <p>{new Date(contact.createdAt).toLocaleString("vi-VN")}</p>
                <p className="font-medium uppercase tracking-wide text-emerald-700">{contact.status}</p>
              </div>
            </div>

            <div className="mt-3 grid gap-2 text-sm text-gray-700 md:grid-cols-2">
              <p>
                <span className="font-semibold">Email:</span> {contact.email}
              </p>
              <p>
                <span className="font-semibold">Điện thoại:</span> {contact.phone}
              </p>
              <p className="md:col-span-2">
                <span className="font-semibold">Quan tâm:</span> {contact.interest}
              </p>
              <p className="md:col-span-2 whitespace-pre-wrap">
                <span className="font-semibold">Nội dung:</span> {contact.message}
              </p>
            </div>
          </div>
        ))}
      </div>

      <Pagination currentPage={currentPage} totalItems={filteredContacts.length} itemsPerPage={itemsPerPage} onPageChange={setCurrentPage} />
    </div>
  );
}
