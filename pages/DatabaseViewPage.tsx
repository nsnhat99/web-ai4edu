import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePapers } from '../contexts/PaperContext';
import { useRegistrations } from '../contexts/RegistrationContext';
import { useAnnouncements } from '../contexts/AnnouncementContext';
import { getUsers } from '../api';
import type { User } from '../types';

const TableCard: React.FC<{ title: string; headers: string[]; children: React.ReactNode }> = ({ title, headers, children }) => (
    <div className="bg-slate-800/40 backdrop-blur-sm rounded-lg shadow-2xl border border-slate-700/50 overflow-hidden mb-12">
        <h2 className="text-xl sm:text-2xl font-bold text-blue-100 p-4 bg-slate-900/50">{title}</h2>
        <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-slate-100">
                <thead className="bg-slate-900/50 text-xs text-slate-400 uppercase tracking-wider">
                    <tr>
                        {headers.map(header => <th key={header} scope="col" className="px-6 py-3">{header}</th>)}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                    {children}
                </tbody>
            </table>
        </div>
    </div>
);


const DatabaseViewPage: React.FC = () => {
    const { papers } = usePapers();
    const { registrations } = useRegistrations();
    const { announcements } = useAnnouncements();
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        getUsers()
            .then(setUsers)
            .catch(err => console.error("Failed to fetch users", err));
    }, []);


    return (
        <div className="max-w-screen-xl mx-auto">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-4xl font-bold text-slate-100">Database Viewer</h1>
                    <p className="text-slate-100 text-lg">A read-only view of the application's mock data from the API.</p>
                </div>
                <Link to="/admin" className="bg-slate-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-slate-500 transition-colors">
                    <i className="fas fa-arrow-left mr-2"></i>Back to Dashboard
                </Link>
            </div>
            
            {/* Users Table */}
            <TableCard title="Users" headers={['ID', 'Username', 'Email', 'Role']}>
                {users.map(user => (
                    <tr key={user.id} className="hover:bg-slate-700/30">
                        <td className="px-6 py-4">{user.id}</td>
                        <td className="px-6 py-4 font-medium text-slate-100">{user.username}</td>
                        <td className="px-6 py-4">{user.email}</td>
                        <td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'admin' ? 'bg-blue-800 text-blue-300' : 'bg-blue-800 text-blue-300'}`}>{user.role}</span></td>
                    </tr>
                ))}
            </TableCard>

            {/* Paper Submissions Table */}
            <TableCard title="Paper Submissions" headers={['Author', 'Title', 'Review Status', 'Presentation']}>
                 {papers.map(paper => (
                    <tr key={paper.id} className="hover:bg-slate-700/30">
                        <td className="px-6 py-4 font-medium text-slate-100">{paper.authorName}</td>
                        <td className="px-6 py-4">{paper.paperTitle}</td>
                        <td className="px-6 py-4">{paper.reviewStatus}</td>
                        <td className="px-6 py-4">{paper.presentationStatus}</td>
                    </tr>
                ))}
            </TableCard>
            
            {/* Announcements Table */}
            <TableCard title="Announcements" headers={['Date', 'Title', 'Content']}>
                 {announcements.map(item => (
                    <tr key={item.id} className="hover:bg-slate-700/30">
                        <td className="px-6 py-4 whitespace-nowrap">{item.date}</td>
                        <td className="px-6 py-4 font-medium text-slate-100">{item.title}</td>
                        <td className="px-6 py-4">{item.content}</td>
                    </tr>
                ))}
            </TableCard>

             {/* Registrations Table */}
            <TableCard title="Registrations" headers={['Name', 'Organization', 'Email', 'With Paper?']}>
                {registrations.length > 0 ? registrations.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-700/30">
                        <td className="px-6 py-4 font-medium text-slate-100">{item.name}</td>
                        <td className="px-6 py-4">{item.organization}</td>
                        <td className="px-6 py-4">{item.email}</td>
                        <td className="px-6 py-4">{item.withPaper}</td>
                    </tr>
                )) : (
                    <tr>
                        <td colSpan={4} className="text-center px-6 py-4 text-slate-400">No registrations yet.</td>
                    </tr>
                )}
            </TableCard>

        </div>
    );
};

export default DatabaseViewPage;
