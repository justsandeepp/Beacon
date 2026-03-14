"use client";

import { useState, useEffect, useCallback } from 'react';
import { 
    Search, Filter, ChevronDown, Mail, Inbox, Send, Star, Clock, Trash2, 
    MoreVertical, CheckSquare, Square, RefreshCcw, X, Paperclip, 
    AlertCircle, Loader2, ArrowLeft, Trash
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { listGmailEmails, type GmailEmail, type GmailSearchOptions } from '@/lib/apiClient';

interface GmailReplicaProps {
    onClose: () => void;
    onIngest: (selectedIds: string[]) => void;
    isIngesting: boolean;
}

export default function GmailReplica({ onClose, onIngest, isIngesting }: GmailReplicaProps) {
    const [emails, setEmails] = useState<GmailEmail[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [activeFolder, setActiveFolder] = useState('inbox');
    
    // Search states
    const [showFilters, setShowFilters] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [fromMail, setFromMail] = useState('');
    const [toMail, setToMail] = useState('');
    const [contentSearch, setContentSearch] = useState('');
    const [hasAttachments, setHasAttachments] = useState(false);

    const fetchEmails = useCallback(async (options: GmailSearchOptions = {}) => {
        setLoading(true);
        setError(null);
        try {
            const res = await listGmailEmails({ count: 20, ...options });
            setEmails(res.emails);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to load emails');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEmails();
    }, [fetchEmails]);

    const handleSearch = (e?: React.FormEvent) => {
        e?.preventDefault();
        setShowFilters(false);
        fetchEmails({
            q: searchQuery,
            from: fromMail,
            to: toMail,
            content: contentSearch,
            hasAttachments
        });
    };

    const toggleSelection = (id: string) => {
        setSelectedIds(prev => 
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === emails.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(emails.map(e => e.message_id));
        }
    };

    const folders = [
        { id: 'inbox', label: 'Inbox', icon: Inbox, color: 'text-blue-400' },
        { id: 'starred', label: 'Starred', icon: Star, color: 'text-yellow-400' },
        { id: 'sent', label: 'Sent', icon: Send, color: 'text-emerald-400' },
        { id: 'snoozed', label: 'Snoozed', icon: Clock, color: 'text-purple-400' },
        { id: 'trash', label: 'Trash', icon: Trash, color: 'text-red-400' },
    ];

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-4 sm:inset-10 z-50 flex flex-col glass-card border-white/10 rounded-2xl shadow-2xl overflow-hidden"
            style={{ backdropFilter: 'blur(30px) saturate(180%)' }}
        >
            {/* Header / Search Bar Area */}
            <div className="flex items-center gap-4 px-6 py-4 border-b border-white/5 bg-white/5">
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-zinc-400 transition-colors">
                    <ArrowLeft size={20} />
                </button>
                
                <div className="flex-1 relative flex items-center">
                    <form onSubmit={handleSearch} className="flex-1 flex items-center bg-zinc-950/40 border border-white/10 rounded-xl px-4 py-2 hover:border-white/20 focus-within:border-cyan-500/50 focus-within:bg-zinc-950/60 transition-all">
                        <Search size={18} className="text-zinc-500 mr-3" />
                        <input 
                            type="text" 
                            placeholder="Search mail"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent border-none focus:outline-none text-sm text-zinc-100 w-full placeholder-zinc-600"
                        />
                        <button 
                            type="button"
                            onClick={() => setShowFilters(!showFilters)}
                            className={cn("p-1.5 hover:bg-white/10 rounded-lg transition-colors", showFilters ? "text-cyan-400 bg-cyan-400/10" : "text-zinc-500")}
                        >
                            <Filter size={16} />
                        </button>
                    </form>

                    {/* Advanced Search Dropdown */}
                    <AnimatePresence>
                        {showFilters && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute top-full left-0 right-0 mt-2 p-6 glass-card border-white/10 rounded-xl z-20 shadow-2xl space-y-4"
                            >
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1">From</label>
                                        <input 
                                            type="text" 
                                            value={fromMail} 
                                            onChange={e => setFromMail(e.target.value)}
                                            placeholder="sender@example.com"
                                            className="w-full bg-zinc-950/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-zinc-100 outline-none focus:border-cyan-500/50"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1">To</label>
                                        <input 
                                            type="text" 
                                            value={toMail} 
                                            onChange={e => setToMail(e.target.value)}
                                            placeholder="recipient@example.com"
                                            className="w-full bg-zinc-950/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-zinc-100 outline-none focus:border-cyan-500/50"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1">Contains Words</label>
                                    <input 
                                        type="text" 
                                        value={contentSearch} 
                                        onChange={e => setContentSearch(e.target.value)}
                                        placeholder="Specific keywords..."
                                        className="w-full bg-zinc-950/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-zinc-100 outline-none focus:border-cyan-500/50"
                                    />
                                </div>
                                <div className="flex items-center gap-3 pt-1">
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <div 
                                            onClick={() => setHasAttachments(!hasAttachments)}
                                            className={cn("w-4 h-4 rounded border transition-all flex items-center justify-center", hasAttachments ? "bg-cyan-500 border-cyan-500" : "border-white/20 group-hover:border-white/40")}
                                        >
                                            {hasAttachments && <CheckSquare size={12} className="text-white" />}
                                        </div>
                                        <span className="text-xs text-zinc-400 group-hover:text-zinc-200 transition-colors">Has attachments</span>
                                    </label>
                                </div>
                                <div className="flex justify-end gap-3 pt-2">
                                    <button 
                                        onClick={() => {
                                            setFromMail(''); setToMail(''); setContentSearch(''); setHasAttachments(false);
                                        }}
                                        className="px-4 py-1.5 hover:bg-white/5 text-zinc-500 hover:text-zinc-300 text-xs font-medium rounded-lg"
                                    >
                                        Reset
                                    </button>
                                    <button 
                                        onClick={() => handleSearch()}
                                        className="px-6 py-1.5 bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-bold rounded-lg transition-all shadow-lg shadow-cyan-500/20"
                                    >
                                        Search
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="flex items-center gap-3 ml-4">
                    <button 
                        onClick={() => fetchEmails()} 
                        disabled={loading}
                        className="p-2 hover:bg-white/10 rounded-full text-zinc-400 transition-colors disabled:opacity-30"
                    >
                        <RefreshCcw size={18} className={cn(loading && "animate-spin")} />
                    </button>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-400/20 to-purple-400/20 border border-white/10 flex items-center justify-center">
                        <Mail size={18} className="text-cyan-400" />
                    </div>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar */}
                <div className="w-64 border-r border-white/5 p-4 space-y-1 hidden md:block">
                    <button className="w-full flex items-center gap-3 px-6 py-4 mb-4 bg-white/10 hover:bg-white/15 rounded-2xl text-zinc-100 text-sm font-bold transition-all border border-white/10 shadow-xl group">
                        <Mail size={18} className="text-cyan-400 group-hover:scale-110 transition-transform" />
                        Compose
                    </button>
                    
                    {folders.map(folder => (
                        <button 
                            key={folder.id}
                            onClick={() => setActiveFolder(folder.id)}
                            className={cn(
                                "w-full flex items-center gap-4 px-4 py-2.5 rounded-xl text-sm transition-all",
                                activeFolder === folder.id 
                                    ? "bg-cyan-500/10 text-cyan-400 font-bold border border-cyan-500/20" 
                                    : "text-zinc-500 hover:bg-white/5 hover:text-zinc-300 border border-transparent"
                            )}
                        >
                            <folder.icon size={18} className={cn(activeFolder === folder.id ? folder.color : "text-zinc-500")} />
                            {folder.label}
                            {folder.id === 'inbox' && <span className="ml-auto text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-zinc-400 font-mono">24</span>}
                        </button>
                    ))}

                    <div className="mt-8 pt-8 border-t border-white/5">
                        <p className="px-4 text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-4">Labels</p>
                        <div className="space-y-1">
                            {['Work', 'Personal', 'Invoices', 'Projects'].map(label => (
                                <button key={label} className="w-full flex items-center gap-4 px-4 py-2 rounded-xl text-sm text-zinc-500 hover:bg-white/5 transition-all">
                                    <div className="w-2 h-2 rounded-full border border-white/20" />
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-w-0 bg-zinc-950/20">
                    <div className="px-6 py-3 border-b border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={toggleSelectAll}
                                className="p-1 hover:bg-white/10 rounded transition-colors text-zinc-500"
                            >
                                {selectedIds.length === emails.length && emails.length > 0 ? <CheckSquare size={18} className="text-cyan-400" /> : <Square size={18} />}
                            </button>
                            <div className="flex items-center gap-1 border-l border-white/10 pl-4">
                                <button className="p-2 hover:bg-white/10 rounded-lg text-zinc-500 transition-colors">
                                    <Trash2 size={16} />
                                </button>
                                <button className="p-2 hover:bg-white/10 rounded-lg text-zinc-500 transition-colors">
                                    <AlertCircle size={16} />
                                </button>
                                <button className="p-2 hover:bg-white/10 rounded-lg text-zinc-500 transition-colors">
                                    <MoreVertical size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
                            <span>1 - {emails.length} of 100+</span>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <AnimatePresence mode="popLayout">
                            {loading ? (
                                <div className="h-full flex flex-col items-center justify-center text-zinc-600 animate-in fade-in duration-500">
                                    <Loader2 size={40} className="animate-spin mb-4 opacity-20" />
                                    <p className="text-xs font-mono uppercase tracking-[0.2em]">Synchronizing Emails...</p>
                                </div>
                            ) : error ? (
                                <div className="h-full flex flex-col items-center justify-center p-10 text-center">
                                    <div className="w-16 h-16 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
                                        <X size={32} className="text-red-400" />
                                    </div>
                                    <h3 className="text-zinc-200 font-bold mb-2">Sync Error</h3>
                                    <p className="text-sm text-zinc-500 max-w-xs">{error}</p>
                                    <button 
                                        onClick={() => fetchEmails()} 
                                        className="mt-6 px-6 py-2 bg-white/5 border border-white/10 rounded-xl text-zinc-300 text-xs font-bold hover:bg-white/10 transition-all"
                                    >
                                        Try Again
                                    </button>
                                </div>
                            ) : emails.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center p-10 text-center opacity-40">
                                    <Mail size={60} className="text-zinc-700 mb-6" />
                                    <p className="text-sm text-zinc-500 font-medium">No emails found matching your criteria</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-white/5">
                                    {emails.map((email) => (
                                        <motion.div 
                                            key={email.message_id}
                                            layout
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className={cn(
                                                "group flex items-center gap-4 px-6 py-3 transition-colors cursor-pointer",
                                                selectedIds.includes(email.message_id) ? "bg-cyan-500/5 shadow-[inset_4px_0_0_0_rgb(6,182,212)]" : "hover:bg-white/[0.03]"
                                            )}
                                            onClick={() => toggleSelection(email.message_id)}
                                        >
                                            <div className="flex-shrink-0 flex items-center gap-4">
                                                <div className={cn("transition-colors", selectedIds.includes(email.message_id) ? "text-cyan-400" : "text-zinc-700 group-hover:text-zinc-500")}>
                                                    {selectedIds.includes(email.message_id) ? <CheckSquare size={18} /> : <Square size={18} />}
                                                </div>
                                                <Star size={18} className="text-zinc-800 hover:text-yellow-500 transition-colors" />
                                            </div>

                                            <div className="flex-1 min-w-0 flex items-baseline gap-6">
                                                <div className="w-48 flex-shrink-0">
                                                    <p className={cn("text-sm truncate", selectedIds.includes(email.message_id) ? "text-zinc-100 font-bold" : "text-zinc-300 group-hover:text-zinc-100")}>
                                                        {email.from.split('<')[0].trim() || email.from}
                                                    </p>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <p className={cn("text-sm truncate", !selectedIds.includes(email.message_id) && "text-zinc-100 font-medium")}>
                                                            {email.subject || '(No Subject)'}
                                                        </p>
                                                        {email.attachments?.length > 0 && <Paperclip size={12} className="text-zinc-600 flex-shrink-0" />}
                                                    </div>
                                                    <p className="text-xs text-zinc-600 truncate mt-0.5 line-clamp-1">
                                                        {email.snippet}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="w-20 text-right flex-shrink-0">
                                                <p className="text-[10px] text-zinc-600 font-mono group-hover:hidden">4:12 PM</p>
                                                <div className="hidden group-hover:flex items-center justify-end gap-1">
                                                    <button className="p-1.5 hover:bg-white/10 rounded-lg text-zinc-500"><Clock size={14} /></button>
                                                    <button className="p-1.5 hover:bg-white/10 rounded-lg text-zinc-500"><Trash2 size={14} /></button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Bottom Ingestion Action Bar */}
            <AnimatePresence>
                {selectedIds.length > 0 && (
                    <motion.div 
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        exit={{ y: 100 }}
                        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 px-6 py-4 glass-card border-cyan-500/30 bg-cyan-950/20 shadow-2xl z-30"
                        style={{ backdropFilter: 'blur(20px)' }}
                    >
                        <div className="flex flex-col">
                            <span className="text-cyan-400 font-bold text-sm">{selectedIds.length} emails selected</span>
                            <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-widest">Ready for ingestion</span>
                        </div>
                        <div className="w-px h-8 bg-white/10 mx-2" />
                        <button 
                            onClick={() => onIngest(selectedIds)}
                            disabled={isIngesting}
                            className="bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-black px-8 py-2.5 rounded-xl text-xs uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] disabled:opacity-50 flex items-center gap-2"
                        >
                            {isIngesting ? <Loader2 size={14} className="animate-spin" /> : <RefreshCcw size={14} />}
                            {isIngesting ? 'Ingesting...' : 'Ingest Selected'}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
