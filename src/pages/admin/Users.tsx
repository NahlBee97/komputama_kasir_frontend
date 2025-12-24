import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AddIcon,
  DeleteIcon,
  EditIcon,
  SearchIcon,
  WarningIcon,
} from "../../components/Icons";

import { GLOW_BORDER, GLOW_TEXT } from "./Dashboard";
// Make sure to update your productServices file
import Loader from "../../components/Loader";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { User } from "../../interfaces/authInterfaces";
import { deleteUser, getAllUsers } from "../../services/userServices";

const Users = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const queryClient = useQueryClient();

  const {
    data: users = [],
    isLoading: isUsersLoading,
    error: usersError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: () => getAllUsers(),
  });

  const { mutate: deleteItem, isPending: deletePending } = useMutation({
    mutationFn: async (id: number) => {
      return deleteUser(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      alert("Delete User Success");
    },
    onError: (error) => {
      alert("Error: " + error);
    },
  });

  const filteredItems: User[] = useMemo(() => {
    return users.length > 0 && searchQuery
      ? users.filter(
          (user: User) =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : users;
  }, [searchQuery, users]);

  return (
    <main className="flex flex-1 flex-col p-6 lg:p-10">
      {/* Header and Search remain the same */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h1
          className="text-[#f9f906] text-4xl font-bold leading-tight tracking-[-0.033em]"
          style={{ textShadow: GLOW_TEXT }}
        >
          LIST PETUGAS KASIR
        </h1>
        <div className="flex items-center gap-4">
          <div className="relative w-full max-w-sm">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#f9f906]/70">
              <SearchIcon />
            </div>
            <input
              className="w-full bg-[#23230f] border border-[#f9f906]/30 rounded-lg py-2 pl-10 pr-4 text-white placeholder:text-[#f9f906]/50 focus:ring-[#f9f906] focus:border-[#f9f906] outline-none transition-shadow duration-300 focus:shadow-[0_0_10px_rgba(249,249,6,0.3)]"
              placeholder="Cari Petugas..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            className="flex items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-[#f9f906] px-4 py-2 text-sm font-bold text-black hover:bg-yellow-400 transition-colors"
            onClick={() => navigate("/admin/users/add")}
          >
            <AddIcon />
            <span>Tambah</span>
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div
        className="overflow-hidden rounded-xl border border-[#f9f906]/50 bg-[#0A0A0A] flex-1 flex flex-col"
        style={{ boxShadow: GLOW_BORDER }}
      >
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left">
            <thead className="border-b border-[#f9f906]/20">
              {/* Table Headers remain the same */}
              {!usersError && !isUsersLoading && (
                <tr>
                  <th className="py-4 px-2 text-sm font-semibold uppercase text-[#f9f906]/70">
                    # ID
                  </th>
                  <th className="py-4 px-2 text-sm font-semibold uppercase text-[#f9f906]/70">
                    Nama
                  </th>
                  <th className="py-4 px-2 text-sm font-semibold uppercase text-[#f9f906]/70 text-center">
                    Shift
                  </th>
                  <th className="py-4 px-2 text-sm font-semibold uppercase text-[#f9f906]/70 text-center">
                    Tindakan
                  </th>
                </tr>
              )}
            </thead>
            <tbody>
              {isUsersLoading || usersError ? (
                // Loading/Error state inside the table body
                <tr>
                  <td colSpan={8} className="p-10 text-center">
                    <div className="flex flex-col h-80 gap-3 justify-center items-center">
                      {usersError ? <WarningIcon /> : <Loader size="md" />}
                      <p className="text-white">
                        {usersError
                          ? "Error Loading Users"
                          : "Loading Users..."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="p-10 text-center text-[#f9f906]/70"
                  >
                    Kasir tidak ditemukan
                  </td>
                </tr>
              ) : (
                <>
                  {filteredItems.map((user: User) => (
                    <tr
                      key={user.id}
                      className="border-b border-[#f9f906]/10 last:border-none hover:bg-white/5 transition-colors"
                    >
                      {/* Table Cells remain the same */}
                      <td className="p-4 text-sm text-white/70">{user.id}</td>
                      <td className="p-4 text-sm text-white/90">{user.name}</td>
                      <td className="p-4 text-sm text-white/70 text-center">
                        {user.shift === "DAY" ? "Siang" : "Malam"}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            className="text-[#f9f906] hover:text-[#f9f906]/70 transition-all duration-200"
                            style={{ textShadow: GLOW_TEXT }}
                            disabled={deletePending}
                            onClick={() =>
                              navigate(`/admin/users/edit/${user.id}`)
                            }
                          >
                            <EditIcon />
                          </button>
                          <button
                            className="text-[#f9f906] hover:text-[#f9f906]/70 transition-all duration-200"
                            style={{ textShadow: GLOW_TEXT }}
                            disabled={deletePending}
                            onClick={() => deleteItem(user.id)}
                          >
                            <DeleteIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default Users;
