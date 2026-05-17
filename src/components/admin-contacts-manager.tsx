"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { Pagination } from "@/components/pagination";
import type { StoredContact } from "@/lib/contact-repository";

type AdminContactsManagerProps = {
  initialContacts: StoredContact[];
};

export function AdminContactsManager({ initialContacts }: AdminContactsManagerProps) {
  const [contacts, setContacts] = useState(initialContacts);
  const [searchFilter, setSearchFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState<StoredContact | null>(null);
  const itemsPerPage = 10;
  const deferredSearchFilter = useDeferredValue(searchFilter);

  const filteredContacts = useMemo(() => {
    const query = deferredSearchFilter.trim().toLowerCase();
    if (!query) {
      return contacts;
    }

    return contacts.filter((item) => {
      return [item.fullName, item.email, item.phone, item.company, item.interest, item.message]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
  }, [contacts, deferredSearchFilter]);

  const paginatedContacts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredContacts.slice(start, start + itemsPerPage);
  }, [currentPage, filteredContacts]);

  const allFilteredIds = useMemo(
    () => filteredContacts.map((item) => item.id),
    [filteredContacts],
  );

  const selectedCountInFilter = useMemo(
    () => allFilteredIds.filter((id) => selectedIds.includes(id)).length,
    [allFilteredIds, selectedIds],
  );

  const isAllFilteredSelected =
    allFilteredIds.length > 0 && selectedCountInFilter === allFilteredIds.length;

  function toggleSelect(id: string) {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  function toggleSelectAllFiltered() {
    setSelectedIds((current) => {
      const currentSet = new Set(current);

      if (isAllFilteredSelected) {
        return current.filter((id) => !allFilteredIds.includes(id));
      }

      allFilteredIds.forEach((id) => currentSet.add(id));
      return Array.from(currentSet);
    });
  }

  function startEdit(contact: StoredContact) {
    setEditingId(contact.id);
    setExpandedId(contact.id);
    setDraft(contact);
    setFeedback("");
  }

  function formatContactDate(value: string) {
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      hour: "2-digit",
      hour12: false,
      minute: "2-digit",
      month: "2-digit",
      timeZone: "Asia/Ho_Chi_Minh",
      year: "numeric",
    }).format(new Date(value));
  }

  async function saveEdit() {
    if (!editingId || !draft) {
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/admin/contacts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingId,
          fullName: draft.fullName,
          email: draft.email,
          phone: draft.phone,
          company: draft.company,
          interest: draft.interest,
          message: draft.message,
          status: draft.status,
        }),
      });

      const payload = (await response.json()) as { message?: string };
      if (!response.ok) {
        setFeedback(payload.message || "Không thể cập nhật liên hệ.");
        return;
      }

      setContacts((current) =>
        current.map((item) => (item.id === editingId ? draft : item)),
      );
      setEditingId(null);
      setDraft(null);
      setFeedback("Đã cập nhật liên hệ.");
    } finally {
      setSaving(false);
    }
  }

  async function removeOne(id: string) {
    if (!confirm("Xóa liên hệ này?")) {
      return;
    }

    const response = await fetch(`/api/admin/contacts?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    const payload = (await response.json()) as { message?: string };

    if (!response.ok) {
      setFeedback(payload.message || "Không thể xóa liên hệ.");
      return;
    }

    setContacts((current) => current.filter((item) => item.id !== id));
    setSelectedIds((current) => current.filter((item) => item !== id));
    setFeedback("Đã xóa liên hệ.");
  }

  async function removeSelected() {
    if (selectedIds.length === 0) {
      return;
    }

    if (!confirm(`Xóa ${selectedIds.length} liên hệ đã chọn?`)) {
      return;
    }

    const response = await fetch("/api/admin/contacts", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: selectedIds }),
    });
    const payload = (await response.json()) as { message?: string };

    if (!response.ok) {
      setFeedback(payload.message || "Không thể xóa hàng loạt.");
      return;
    }

    const deleting = new Set(selectedIds);
    setContacts((current) => current.filter((item) => !deleting.has(item.id)));
    setSelectedIds([]);
    setFeedback("Đã xóa các liên hệ đã chọn.");
  }

  async function updateStatus(id: string, status: "new" | "handled") {
    setSaving(true);
    try {
      const response = await fetch("/api/admin/contacts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const payload = (await response.json()) as { message?: string };

      if (!response.ok) {
        setFeedback(payload.message || "Không thể cập nhật trạng thái.");
        return;
      }

      setContacts((current) =>
        current.map((item) => (item.id === id ? { ...item, status } : item)),
      );
      setFeedback(status === "handled" ? "Đã đánh dấu liên hệ đã xử lý." : "Đã chuyển lại trạng thái liên hệ mới.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Danh sách liên hệ ({filteredContacts.length})</h2>
          <p className="text-sm text-gray-600">Mỗi liên hệ đều được lưu trong CRM, kể cả khi gửi email bị lỗi.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleSelectAllFiltered}
            disabled={filteredContacts.length === 0}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50"
          >
            {isAllFilteredSelected ? "Bỏ chọn tất cả" : "Chọn tất cả"} ({selectedCountInFilter}/{filteredContacts.length})
          </button>

          <button
            type="button"
            onClick={removeSelected}
            disabled={selectedIds.length === 0}
            className="rounded-lg border border-rose-300 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 disabled:opacity-50"
          >
            Xóa đã chọn ({selectedIds.length})
          </button>
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
            <div className="flex flex-wrap items-start justify-between gap-3">
              <label className="inline-flex items-center gap-2 text-xs font-medium text-gray-600">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(contact.id)}
                  onChange={() => toggleSelect(contact.id)}
                />
                Chọn
              </label>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <p className="text-sm font-semibold text-gray-900">{contact.fullName}</p>
                  <span className="text-sm text-gray-600">{contact.company || "Chưa có công ty"}</span>
                  <span className="text-xs text-gray-500" suppressHydrationWarning>
                    {formatContactDate(contact.createdAt)}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${
                    contact.status === "handled"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}>
                    {contact.status === "handled" ? "Đã xử lý" : "Mới"}
                  </span>
                  <span className="text-xs text-gray-600">{contact.email}</span>
                  <span className="text-xs text-gray-500">{contact.phone}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-sm">
                <button
                  type="button"
                  onClick={() => setExpandedId((current) => (current === contact.id ? null : contact.id))}
                  className="rounded border border-gray-300 px-2.5 py-1 text-xs font-semibold text-gray-700"
                >
                  {expandedId === contact.id ? "Ẩn" : "Chi tiết"}
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => void updateStatus(contact.id, contact.status === "new" ? "handled" : "new")}
                  className="rounded border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 disabled:opacity-50"
                >
                  {contact.status === "new" ? "Đánh dấu đã xử lý" : "Chuyển về mới"}
                </button>
                <button type="button" onClick={() => startEdit(contact)} className="font-semibold text-blue-600 hover:underline">
                  Sửa
                </button>
                <button type="button" onClick={() => removeOne(contact.id)} className="font-semibold text-rose-600 hover:underline">
                  Xóa
                </button>
              </div>
            </div>

            {expandedId === contact.id && editingId !== contact.id ? (
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
            ) : null}

            {editingId === contact.id && draft ? (
              <div className="mt-4 grid gap-2 rounded-lg border border-blue-200 bg-white p-3 text-sm md:grid-cols-2">
                <input value={draft.fullName} onChange={(event) => setDraft({ ...draft, fullName: event.target.value })} className="rounded border border-gray-300 px-2 py-1.5" placeholder="Họ tên" />
                <input value={draft.company} onChange={(event) => setDraft({ ...draft, company: event.target.value })} className="rounded border border-gray-300 px-2 py-1.5" placeholder="Công ty" />
                <input value={draft.email} onChange={(event) => setDraft({ ...draft, email: event.target.value })} className="rounded border border-gray-300 px-2 py-1.5" placeholder="Email" />
                <input value={draft.phone} onChange={(event) => setDraft({ ...draft, phone: event.target.value })} className="rounded border border-gray-300 px-2 py-1.5" placeholder="Điện thoại" />
                <input value={draft.interest} onChange={(event) => setDraft({ ...draft, interest: event.target.value })} className="rounded border border-gray-300 px-2 py-1.5 md:col-span-2" placeholder="Nhu cầu" />
                <textarea value={draft.message} onChange={(event) => setDraft({ ...draft, message: event.target.value })} className="rounded border border-gray-300 px-2 py-1.5 md:col-span-2" rows={3} placeholder="Nội dung" />
                <select value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value as "new" | "handled" })} className="rounded border border-gray-300 px-2 py-1.5">
                  <option value="new">new</option>
                  <option value="handled">handled</option>
                </select>
                <div className="flex gap-2">
                  <button type="button" disabled={saving} onClick={() => void saveEdit()} className="rounded bg-emerald-600 px-3 py-1.5 font-semibold text-white disabled:opacity-50">{saving ? "Đang lưu..." : "Lưu"}</button>
                  <button type="button" onClick={() => { setEditingId(null); setDraft(null); }} className="rounded border border-gray-300 px-3 py-1.5 font-semibold text-gray-700">Hủy</button>
                </div>
              </div>
            ) : null}
          </div>
        ))}
      </div>

      <Pagination currentPage={currentPage} totalItems={filteredContacts.length} itemsPerPage={itemsPerPage} onPageChange={setCurrentPage} />
      {feedback ? <p className="text-sm text-gray-700">{feedback}</p> : null}
    </div>
  );
}
