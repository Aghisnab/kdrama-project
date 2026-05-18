import { useState, useEffect, useRef } from 'react';

export default function SearchableActorSelect({ value, onChange, placeholder = 'Cari nama aktor...', url, initialLabel }) {
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedLabel, setSelectedLabel] = useState(initialLabel || value || '');
    const wrapperRef = useRef(null);

    // Update label jika initialLabel atau value berubah
    useEffect(() => {
        if (initialLabel) {
            setSelectedLabel(initialLabel);
        } else if (value) {
            setSelectedLabel(value);
        } else {
            setSelectedLabel('');
        }
    }, [initialLabel, value]);

    // Click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Fetch options saat search
    useEffect(() => {
        if (!open || !url) return;
        const delay = setTimeout(() => {
            if (search.length === 0) {
                setOptions([]);
                setLoading(false);
                return;
            }
            setLoading(true);
            fetch(`${url}?q=${encodeURIComponent(search)}`)
                .then(res => res.json())
                .then(data => {
                    setOptions(data);
                    setLoading(false);
                })
                .catch(() => setLoading(false));
        }, 300);
        return () => clearTimeout(delay);
    }, [search, open, url]);

    const displayLabel = selectedLabel || placeholder;

    return (
        <div ref={wrapperRef} className="relative">
            <div
                onClick={() => setOpen(!open)}
                className="w-full px-4 py-2.5 bg-[#0d0d14] border border-white/[0.08] rounded-xl text-sm text-white cursor-pointer"
            >
                {displayLabel}
            </div>
            {open && (
                <div className="absolute z-20 mt-1 w-full bg-[#111118] border border-white/[0.1] rounded-xl shadow-xl">
                    <input
                        type="text"
                        autoFocus
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full px-4 py-2 bg-transparent border-b border-white/[0.1] text-sm text-white outline-none"
                        placeholder="Ketik nama aktor..."
                    />
                    <div className="max-h-60 overflow-y-auto">
                        {loading && <div className="p-3 text-gray-500 text-sm">Mencari...</div>}
                        {!loading && options.length === 0 && search && (
                            <div className="p-3 text-gray-500 text-sm">Tidak ditemukan</div>
                        )}
                        {options.map((opt) => (
                            <div
                                key={opt.actor_name}
                                onClick={() => {
                                    onChange(opt.actor_name);
                                    setSelectedLabel(opt.actor_name);
                                    setOpen(false);
                                    setSearch('');
                                }}
                                className="px-4 py-2 hover:bg-white/[0.05] cursor-pointer text-sm"
                            >
                                {opt.actor_name}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
