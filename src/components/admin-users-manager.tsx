"use client";

import { useState, useTransition } from "react";
import { Pagination } from "./pagination";
import type { AdminRole } from "@/lib/admin-auth";
import type { AdminUser } from "@/lib/admin-users-repository";

type AdminUsersManagerProps = {
  currentUsername: string;
  initialUsers: AdminUser[];
};

type DraftUser = {
  id?: string;
  password: string;
  role: AdminRole;
  username: string;
};

function emptyDraft(): DraftUser {
  return {
    password: "",
    role: "manager",
    username: "",
  };
}

export function AdminUsersManager({ currentUsername, initialUsers }: AdminUsersManagerProps) {
  const [users, setUsers] = useState(initialUsers);
  const [draft, setDraft] = useState<DraftUser>(emptyDraft());
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isPending, startTransition] = useTransition();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchFilter, setSearchFilter] = useState("");
  const itemsPerPage = 10;

  function newUser() {
    setDraft(emptyDraft());
    setIsEditorOpen(true);
    setFeedback("Đang tạo người dùng mới.");
  }

  function editUser(user: AdminUser) {
    setDraft({
      id: user.id,
      password: "",
      role: user.role,
      username: user.username,
    });
    setIsEditorOpen(true);
    setFeedback("");
  }

  function refreshUsers() {
    startTransition(async () => {
      const response = await fetch("/api/admin/users");
      const payload = (await response.json()) as { users?: AdminUser[] };
      if (response.ok && payload.users) {
        setUsers(payload.users);
      }
    });
  }

  function saveUser() {
    startTransition(async () => {
      const isEdit = Boolean(draft.id);
      const response = await fetch("/api/admin/users", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });

      const payload = (await response.json()) as { message?: string };
      if (!response.ok) {
        setFeedback(payload.message || "Không thể lưu người dùng.");
        return;
      }

      setFeedback(payload.message || "Đã lưu người dùng.");
      setIsEditorOpen(false);
      refreshUsers();
    });
  }

  function removeUser(user: AdminUser) {
    if (user.username === currentUsername) {
      setFeedback("Không thể tự xóa tài khoản đang đăng nhập.");
      return;
    }

    if (!confirm(`Xóa người dùng ${user.username}?`)) {
      return;
    }

    startTransition(async () => {
      const response = await fetch(`/api/admin/users?id=${encodeURIComponent(user.id)}`, {
        method: "DELETE",
      });

      const payload = (await response.json()) as { message?: string };
      if (!response.ok) {
        setFeedback(payload.message || "Không thể xóa người dùng.");
        return;
      }

      setFeedback(payload.message || "Đã xóa người dùng.");
      refreshUsers();
    });
  }

  // Sort: admin first, then manager
  const sortedUsers = [...users].sort((a, b) => {
    if (a.role === "admin" && b.role !== "admin") return -1;
    if (a.role !== "admin" && b.role === "admin") return 1;
    return 0;
  });

  // Filter
  const filteredUsers = sortedUsers.filter((u) =>
    u.username.toLowerCase().includes(searchFilter.toLowerCase())
  );

  // Paginate
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (isEditorOpen) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-gray-900">{draft.id ? "Chỉnh sửa người dùng" : "Thêm người dùng"}</h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsEditorOpen(false)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Quay lại danh sách
            </button>
            <button
              type="button"
              onClick={saveUser}
              disabled={isPending}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
            >
              {isPending ? "Đang lưu..." : "Lưu người dùng"}
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-1 text-sm text-gray-700">
            Tên đăng nhập
            <input
              value={draft.username}
              onChange={(event) => setDraft((current) => ({ ...current, username: event.target.value }))}
              className="rounded-lg border border-gray-300 px-3 py-2"
            />
          </label>

          <label className="grid gap-1 text-sm text-gray-700">
            Vai trò
            <select
              value={draft.role}
              onChange={(event) => setDraft((current) => ({ ...current, role: event.target.value as AdminRole }))}
              className="rounded-lg border border-gray-300 px-3 py-2"
            >
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
            </select>
          </label>

          <label className="grid gap-1 text-sm text-gray-700 md:col-span-2">
            Mật khẩu {draft.id ? "(để trống nếu không đổi)" : ""}
            <input
              type="password"
              value={draft.password}
              onChange={(event) => setDraft((current) => ({ ...current, password: event.target.value }))}
              className="rounded-lg border border-gray-300 px-3 py-2"
            />
          </label>
        </div>

        {feedback ? <p className="mt-4 text-sm text-gray-700">{feedback}</p> : null}
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-gray-900">Danh sách người dùng ({filteredUsers.length})</h2>
          <p className="mt-1 text-xs text-gray-500">Admin hiển thị trước, Manager sau.</p>
        </div>
        <button
          type="button"
          onClick={newUser}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          + Thêm
        </button>
      </div>

      <input
        type="text"
        value={searchFilter}
        onChange={(e) => {
          setSearchFilter(e.target.value);
          setCurrentPage(1);
        }}
        placeholder="Tìm kiếm username..."
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
      />

      <Pagination currentPage={currentPage} totalItems={filteredUsers.length} itemsPerPage={itemsPerPage} onPageChange={setCurrentPage} />

      <div className="divide-y divide-gray-200 border-t border-gray-200">
        {paginatedUsers.map((user) => (
          <div key={user.id} className="flex items-center justify-between gap-3 py-2.5 px-3 hover:bg-slate-50">
            <div className="flex-1">
              <p className="font-medium text-gray-900">{user.username}</p>
              <p className="text-xs text-gray-500">{user.role === "admin" ? "Quản trị viên" : "Quản lý"}</p>
            </div>
            <div className="flex gap-2 text-sm">
              <button type="button" onClick={() => editUser(user)} className="font-semibold text-blue-600 hover:underline">
                Sửa
              </button>
              <button type="button" onClick={() => removeUser(user)} className="font-semibold text-rose-600 hover:underline">
                Xóa
              </button>
            </div>
          </div>
        ))}
      </div>

      <Pagination currentPage={currentPage} totalItems={filteredUsers.length} itemsPerPage={itemsPerPage} onPageChange={setCurrentPage} />

      {feedback ? <p className="text-sm text-gray-700">{feedback}</p> : null}
    </div>
  );
}
