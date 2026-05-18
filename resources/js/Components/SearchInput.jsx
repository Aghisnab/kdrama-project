import { useState, useEffect } from 'react';

export default function SearchInput({ value: initialValue, onSearch, placeholder }) {
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (value !== initialValue) onSearch(value);
        }, 300);
        return () => clearTimeout(timer);
    }, [value]);

    return (
        <div className="relative flex-1">
            <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={placeholder}
                className="w-full px-4 py-2.5 pl-10 bg-[#0d0d14] border border-white/[0.08] rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
        </div>
    );
}
