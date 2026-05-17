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
    setDraft(contact);
    setFeedback("");
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
            <div className="mb-3 flex items-center justify-between">
              <label className="inline-flex items-center gap-2 text-xs font-medium text-gray-600">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(contact.id)}
                  onChange={() => toggleSelect(contact.id)}
                />
                Chọn
              </label>
              <div className="flex items-center gap-3 text-sm">
                <button type="button" onClick={() => startEdit(contact)} className="font-semibold text-blue-600 hover:underline">
                  Sửa
                </button>
                <button type="button" onClick={() => removeOne(contact.id)} className="font-semibold text-rose-600 hover:underline">
                  Xóa
                </button>
              </div>
            </div>
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
