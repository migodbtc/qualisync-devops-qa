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
    const [selectedUser, setSelectedUser] = useState<AuthUser>();

    const [isModalOpen, setIsModalOpen] = useState(false);
    
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
    }, []);

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
            <div className="bg-white rounded-lg shadow-lg p-6 min-w-2xl h-[80%] flex flex-col justify-between">
                <div>
                    {children}
                </div>
                <button
                    className="mt-4 px-2 w-fit py-1 bg-slate-700 text-white rounded hover:bg-slate-800 cursor-pointer"
                    onClick={onClose}
                >
                    Close
                </button>
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
                
                <table className="w-full border border-slate-300 rounded-md overflow-hidden mb-16">
                    <thead className="bg-slate-200">
                        <tr>
                            <TableHeader>User ID</TableHeader>
                            <TableHeader>Email Address</TableHeader>
                            <TableHeader>Password Hash</TableHeader>
                            <TableHeader>Created At</TableHeader>
                            <TableHeader>Updated At</TableHeader>
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
                                    <TableData>{user.created_at}</TableData>
                                    <TableData>{user.updated_at}</TableData>
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
            <TableModal onClose={() => setIsModalOpen(false)}>
                <h2 className="text-lg font-bold mb-2">Auth User No. {selectedUser?.auth_id}</h2>
                <p>This is a simple modal content.</p>
            </TableModal>
            )}
        </div>
    );
}
