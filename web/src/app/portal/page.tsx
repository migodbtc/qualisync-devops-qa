"use client";

import { FC, PropsWithChildren, useEffect, useState } from "react";

// ==> Data Interfaces
interface AuthUser {
  auth_id: number;
  email_address: string;
  password_hash: string;
  created_at: string;   
  updated_at: string;   
}

export default function Page() {

    // ==> State variables
    const [users, setUsers] = useState<AuthUser[]>([]);
    const [selectedUser, setSelectedUser] = useState<AuthUser | undefined>();
    const [editedUser, setEditedUser] = useState<AuthUser | undefined>(undefined);

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [refreshToggle, setRefreshToggle] = useState<boolean>(false);


    // ==> Component functions
    const toggleRefresh = () => {
        setRefreshToggle(!refreshToggle)
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!editedUser) return;
        const { name, value } = e.target;
        setEditedUser({ ...editedUser, [name]: value });
    };

    const handleSave = () => {
        // TBA: API logic. Frontend for now.
        console.log("handleSave clicked!")
    };

    
    // ==> Effect hooks
    useEffect(() => {
        const link = process.env.NEXT_PUBLIC_FLASK_API_URL
        
        fetch(link + "/auth_users").then((res) => {
            if (!res.ok) throw new Error("Network response was not okay")
            return res.json();
        }).then((data) => {
            const res_users: AuthUser[] = data["data"];
            setUsers(res_users)
        }).catch((error) => {
            console.error("Fetch error on /portal: ", error)
        })
    }, [refreshToggle]);

    useEffect(() => {
        if (isModalOpen && selectedUser) {
            setEditedUser({ ...selectedUser });
            setIsEditing(false);
        }
    }, [isModalOpen, selectedUser]);

    // ==> Subcomponents
    const TableHeader: FC<PropsWithChildren> = ({children}) => {
        return <th className="px-4 py-2 text-left font-semibold text-slate-700">{children}</th>
    }

    const TableRow: FC<PropsWithChildren> = ({children}) => {
        return <tr className="border-t border-slate-300">{children}</tr>
    }

    const TableData: FC<PropsWithChildren> = ({children}) => {
        return <td className="px-4 py-2 text-sm text-slate-800">{children}</td>
    }

    const TableModal: FC<PropsWithChildren<{ onClose: () => void }>> = ({ children, onClose }) => (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800/70 text-slate-800">
            <div className="bg-white rounded-lg shadow-lg p-6 min-w-2xl flex flex-col justify-between">
                <div>
                    {children}
                </div>
            </div>
        </div>
    );

    const AddAuthUserModal: FC<PropsWithChildren<{ onClose: () => void }>> = ({ children, onClose }) => (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800/70 text-slate-800">
            <div className="bg-white rounded-lg shadow-lg p-6 min-w-2xl flex flex-col justify-between">
                <div>
                    {children}
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col min-h-screen w-full items-center justify-center bg-zinc-50 font-sans dark:bg-slate-200">

            <header className="flex w-full max-w-5xl bg-slate-100 px-8 py-4 items-center justify-between">
                <div className="flex flex-col text-align-left pointer-events-none">
                    <h1 className="text-xl font-bold text-gray-800">Untitled Infrastructure</h1>
                    <span className="text-sm text-slate-500 italic">Nextjs, FlaskAPI, Docker, Github, Linting</span>
                </div>
                
                <nav>
                <ul className="flex space-x-6">
                    <li>
                        <a href="#" className="text-gray-600 hover:text-gray-900">??</a>
                    </li>
                </ul>
                </nav>
            </header>

            <main className="flex flex-col min-h-screen w-full max-w-5xl items-center justify-between py-16 px-8 bg-slate-100 sm:items-start">
                <div className="flex flex-row justify-between gap-3 w-full min-h-8 mb-2">
                    <div className="flex items-center ">
                        <button
                            className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs cursor-pointer"
                            onClick={() => setIsAddModalOpen(true)}
                            >
                            New User
                        </button>
                    </div>
                    <div className="flex items-center ">
                        <button
                            className="flex px-2 py-1 bg-slate-700 text-white rounded hover:bg-slate-800 text-xs cursor-pointer"
                            onClick={toggleRefresh}
                            >
                            Refresh
                        </button>
                    </div>
                </div>
                <table className="w-full border border-slate-300 rounded-md overflow-hidden mb-16">
                    <thead className="bg-slate-200">
                        <tr>
                            <TableHeader>User ID</TableHeader>
                            <TableHeader>Email Address</TableHeader>
                            <TableHeader>Password Hash</TableHeader>
                            <TableHeader>Options</TableHeader>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            users.map((user: AuthUser) => {
                                
                                return <TableRow key={`TableRowAuthUser${user.auth_id}`}>
                                    <TableData>{user.auth_id}</TableData>
                                    <TableData>{user.email_address}</TableData>
                                    <TableData>{user.password_hash}</TableData>
                                    <TableData><button
                                        className="px-2 py-1 bg-slate-700 text-white rounded hover:bg-slate-800 text-xs cursor-pointer"
                                        onClick={() => {setSelectedUser(user); setIsModalOpen(true)}}
                                        >
                                        Open
                                        </button>
                                    </TableData>
                                </TableRow>
                            })
                        }
                    </tbody>
                </table>
            </main>
            {isModalOpen && (
                <TableModal onClose={() => { setIsModalOpen(false); setIsEditing(false); }}>
                    <h2 className="text-lg font-bold mb-2">Auth User No. {selectedUser?.auth_id}</h2>
                    <form className="w-full">
                        <div className="flex w-full mb-4">
                            <div className="w-1/2 pr-2">
                                <label className="block text-xs text-slate-500 mb-1">Email</label>
                                <input type="email"
                                    name="email_address"
                                    className="w-full border border-slate-300 rounded px-2 py-1 text-xs"
                                    value={editedUser?.email_address ?? ""}
                                    disabled={!isEditing}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="w-1/2 pl-2">
                                <label className="block text-xs text-slate-500 mb-1">Password</label>
                                <input
                                    type="text"
                                    name="password_hash"
                                    className="w-full border border-slate-300 rounded px-2 py-1 text-xs"
                                    value={editedUser?.password_hash ?? ""}
                                    disabled={!isEditing}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <div className="flex w-full">
                            <div className="w-1/2 pr-2">
                                <label className="block text-xs text-slate-500 mb-1">Created At</label>
                                <input
                                    type="text"
                                    name="created_at"
                                    className="w-full border border-slate-300 rounded px-2 py-1 text-xs"
                                    value={editedUser?.created_at ?? ""}
                                    disabled
                                />
                            </div>
                            <div className="w-1/2 pl-2">
                                <label className="block text-xs text-slate-500 mb-1">Updated At</label>
                                <input
                                    type="text"
                                    name="updated_at"
                                    className="w-full border border-slate-300 rounded px-2 py-1 text-xs"
                                    value={editedUser?.updated_at ?? ""}
                                    disabled
                                />
                            </div>
                        </div>
                    </form>
                    <div className="flex gap-2 w-full mt-4">
                        
                        {!isEditing ? (
                            <button
                                className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs cursor-pointer"
                                onClick={() => setIsEditing(true)}
                                type="button"
                            >
                                Edit
                            </button>
                        ) : (
                            <button
                                className="px-2 py-1 bg-gray-400 text-white rounded hover:bg-gray-500 text-xs cursor-pointer"
                                onClick={() => { setIsEditing(false); setEditedUser(selectedUser); }}
                                type="button"
                            >
                                Lock
                            </button>
                        )}
                        <button
                            className={`px-2 py-1 rounded text-xs cursor-pointer ${isEditing ? "bg-green-600 text-white hover:bg-green-700" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
                            onClick={handleSave}
                            type="button"
                            disabled={!isEditing}
                        >
                            Save
                        </button>
                        <button
                            className="px-2 py-1 bg-slate-700 text-white rounded hover:bg-slate-800 text-xs cursor-pointer"
                            onClick={() => { setIsModalOpen(false); setIsEditing(false); }}
                            type="button"
                        >
                            Close
                        </button>
                    </div>
                </TableModal>
            )}
            {
                isAddModalOpen && (
                    <AddAuthUserModal onClose={() => setIsAddModalOpen(false)}>
                        <h2 className="text-lg font-bold mb-2">New Auth User</h2>
                        <div className="flex gap-2 w-full mt-4">
                            <button
                                className={`px-2 py-1 rounded text-xs cursor-pointer ${isEditing ? "bg-green-600 text-white hover:bg-green-700" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
                                onClick={handleSave}
                                type="button"
                                disabled={!isEditing}
                            >
                                Save
                            </button>
                            <button
                                className="px-2 py-1 bg-slate-700 text-white rounded hover:bg-slate-800 text-xs cursor-pointer"
                                onClick={() => setIsAddModalOpen(false)}
                                type="button"
                            >
                                Close
                            </button>
                        </div>
                    </AddAuthUserModal>
                )
            }
        </div>
    );
}
