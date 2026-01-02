import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AddIcon,
  DeleteIcon,
  EditIcon,
  SearchIcon,
  WarningIcon,
} from "../../components/Icons";

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
      ? users.filter((user: User) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : users;
  }, [searchQuery, users]);

  return (
    // Main Container: White bg, [#007ACC] text
    <main className="flex flex-1 flex-col bg-white text-[#007ACC] min-h-full p-6 lg:p-10">
      {/* Header Section */}
      <div className="flex flex-col items-start justify-between gap-6 mb-8 border-b-2 border-[#007ACC] pb-8">
        <h1 className="text-4xl sm:text-5xl font-black leading-tight tracking-tighter uppercase">
          List Petugas Kasir
        </h1>

        <div className="flex items-center justify-between gap-4 w-full">
          {/* Search Bar - Pill Shape */}
          <div className="relative w-full md:w-80">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#007ACC]/50">
              <SearchIcon />
            </div>
            <input
              className="w-full bg-white border-2 border-[#007ACC] rounded-full py-2.5 pl-11 pr-5 text-[#007ACC] placeholder:text-[#007ACC]/40 text-sm font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] transition-all duration-200"
              placeholder="Cari Petugas..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Add Button - Pill Shape & Inverted Hover */}
          <button
            className="
              flex items-center justify-center gap-2 whitespace-nowrap 
              rounded-full bg-[#007ACC] px-6 py-2.5 
              text-sm font-black text-white uppercase tracking-wider
              border-2 border-[#007ACC]
              shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]
              hover:shadow-none hover:translate-y-0.5
              active:scale-95
              transition-all duration-200
            "
            onClick={() => navigate("/admin/users/add")}
          >
            <AddIcon />
            <span>Tambah</span>
          </button>
        </div>
      </div>

      {/* Table Container - Neo Brutalist styling */}
      <div className="overflow-hidden rounded-xl border-2 border-[#007ACC] bg-white flex-1 flex flex-col shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            {/* Header: Solid [#007ACC] for High Contrast */}
            <thead className="bg-[#007ACC] text-white">
              {!usersError && !isUsersLoading && (
                <tr>
                  <th className="py-4 px-4 text-xs font-black uppercase tracking-widest">
                    # ID
                  </th>
                  <th className="py-4 px-4 text-xs font-black uppercase tracking-widest">
                    Nama
                  </th>
                  <th className="py-4 px-4 text-xs font-black uppercase tracking-widest text-center">
                    Shift
                  </th>
                  <th className="py-4 px-4 text-xs font-black uppercase tracking-widest text-center">
                    Tindakan
                  </th>
                </tr>
              )}
            </thead>

            {/* Body */}
            <tbody className="bg-white text-[#007ACC]">
              {isUsersLoading || usersError ? (
                // Loading/Error state
                <tr>
                  <td colSpan={4} className="p-10 text-center">
                    <div className="flex flex-col h-80 gap-4 justify-center items-center">
                      {usersError ? (
                        <WarningIcon  />
                      ) : (
                        <Loader size="md" variant="dark" />
                      )}
                      <p className="text-[#007ACC] font-bold uppercase tracking-wider">
                        {usersError
                          ? "Gagal Memuat Data User"
                          : "Memuat Data User..."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                // Empty state
                <tr>
                  <td
                    colSpan={4}
                    className="p-10 text-center text-[#007ACC] font-bold uppercase tracking-widest text-lg"
                  >
                    Kasir tidak ditemukan
                  </td>
                </tr>
              ) : (
                <>
                  {filteredItems.map((user: User) => (
                    <tr
                      key={user.id}
                      className="border-b border-[#007ACC]/10 last:border-none hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-4 text-sm font-medium text-[#007ACC]/60">
                        #{user.id}
                      </td>
                      <td className="p-4 text-sm font-bold uppercase text-[#007ACC]">
                        {user.name}
                      </td>
                      <td className="p-4 text-sm font-bold text-center uppercase text-[#007ACC]">
                        {user.shift === "DAY" ? "Siang" : "Malam"}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          {/* Edit Button */}
                          <button
                            className="
                                flex items-center justify-center h-8 w-8 rounded-full 
                                border border-[#007ACC] text-[#007ACC] 
                                hover:bg-[#007ACC] hover:text-white 
                                transition-all duration-200
                            "
                            disabled={deletePending}
                            onClick={() =>
                              navigate(`/admin/users/edit/${user.id}`)
                            }
                            title="Edit"
                          >
                            <EditIcon  />
                          </button>

                          {/* Delete Button */}
                          <button
                            className="
                                flex items-center justify-center h-8 w-8 rounded-full 
                                border border-[#007ACC] text-[#007ACC] 
                                hover:bg-[#007ACC] hover:text-white 
                                transition-all duration-200
                            "
                            disabled={deletePending}
                            onClick={() => deleteItem(user.id)}
                            title="Hapus"
                          >
                            <DeleteIcon  />
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
