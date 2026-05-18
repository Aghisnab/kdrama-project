import { useState } from "react";
import { router } from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import "/resources/css/WatchlistUser.css"; // Import the CSS file

const STATUS_CONFIG = {
    plan_to_watch: {
        label: "Plan to Watch",
        color: "#7C9EFF",
        bg: "rgba(124,158,255,0.12)",
        icon: "⏳",
    },
    watching: {
        label: "Watching",
        color: "#4ECDC4",
        bg: "rgba(78,205,196,0.12)",
        icon: "▶",
    },
    completed: {
        label: "Completed",
        color: "#A8E6A3",
        bg: "rgba(168,230,163,0.12)",
        icon: "✓",
    },
};

function formatDate(dateStr) {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function EditModal({ item, onClose }) {
    const [form, setForm] = useState({
        status: item.status,
        current_episode: item.current_episode ?? "",
        rating: item.rating ?? "",
        notes: item.notes ?? "",
    });
    const [loading, setLoading] = useState(false);

    const total = item.kdrama?.total_episodes ?? "?";

    function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        router.patch(
            `/watchlist/${item.id}`,
            {
                status: form.status,
                current_episode: form.current_episode === "" ? null : Number(form.current_episode),
                rating: form.rating === "" ? null : Number(form.rating),
                notes: form.notes || null,
                kdrama_id: item.kdrama_id,
            },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => { setLoading(false); onClose(); },
                onError: () => { setLoading(false); },
            }
        );
    }

    function handleDelete() {
        if (!confirm(`Hapus "${item.kdrama?.kdrama_name}" dari watchlist?`)) return;
        router.delete(`/watchlist`, {
            data: { kdrama_id: item.kdrama_id },
            preserveScroll: true,
            preserveState: true,
            onSuccess: onClose,
        });
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="modal-drama-info">
                        <img
                            src={item.kdrama?.poster_url || "/placeholder.jpg"}
                            alt={item.kdrama?.kdrama_name}
                            className="modal-poster"
                        />
                        <div>
                            <h3 className="modal-title">{item.kdrama?.kdrama_name}</h3>
                            <p className="modal-year">
                                {item.kdrama?.year}
                                {item.kdrama?.total_episodes ? ` · ${item.kdrama.total_episodes} episode` : ""}
                            </p>
                        </div>
                    </div>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    {/* Status */}
                    <div className="field-group">
                        <label className="field-label">Status</label>
                        <div className="status-pills">
                            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                                <button
                                    key={key}
                                    type="button"
                                    className={`status-pill ${form.status === key ? "active" : ""}`}
                                    style={
                                        form.status === key
                                            ? { background: cfg.bg, borderColor: cfg.color, color: cfg.color }
                                            : {}
                                    }
                                    onClick={() => setForm((f) => ({ ...f, status: key }))}
                                >
                                    {cfg.icon} {cfg.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Episode */}
                    <div className="field-group">
                        <label className="field-label">
                            Progress Episode
                            <span className="field-hint">dari {total} episode</span>
                        </label>
                        <div className="episode-input-row">
                            <input
                                type="number"
                                min="0"
                                max={item.kdrama?.total_episodes || undefined}
                                className="field-input episode-input"
                                value={form.current_episode}
                                onChange={(e) => setForm((f) => ({ ...f, current_episode: e.target.value }))}
                                placeholder="0"
                            />
                            <span className="episode-slash">/ {total} ep</span>
                        </div>
                        {item.kdrama?.total_episodes && form.current_episode !== "" && (
                            <div className="progress-bar-wrap">
                                <div
                                    className="progress-bar-fill"
                                    style={{
                                        width: `${Math.min(100, (Number(form.current_episode) / item.kdrama.total_episodes) * 100)}%`,
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    {/* Rating */}
                    <div className="field-group">
                        <label className="field-label">
                            Rating Pribadi
                            <span className="field-hint">1 – 10</span>
                        </label>
                        <div className="rating-row">
                            {[...Array(10)].map((_, i) => {
                                const val = i + 1;
                                return (
                                    <button
                                        key={val}
                                        type="button"
                                        className={`rating-dot ${Number(form.rating) >= val ? "active" : ""}`}
                                        onClick={() => setForm((f) => ({ ...f, rating: f.rating == val ? "" : val }))}
                                        title={`${val}/10`}
                                    >
                                        {val}
                                    </button>
                                );
                            })}
                        </div>
                        {form.rating !== "" && <p className="rating-label">★ {form.rating} / 10</p>}
                    </div>

                    {/* Notes */}
                    <div className="field-group">
                        <label className="field-label">Catatan</label>
                        <textarea
                            className="field-input field-textarea"
                            value={form.notes}
                            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                            placeholder="Kesan, catatan, atau mau nonton bareng siapa..."
                            rows={3}
                            maxLength={500}
                        />
                        <span className="char-count">{form.notes.length} / 500</span>
                    </div>

                    {/* Actions */}
                    <div className="modal-actions">
                        <button type="button" className="btn-delete" onClick={handleDelete}>
                            Hapus dari Watchlist
                        </button>
                        <div style={{ display: "flex", gap: "8px" }}>
                            <button type="button" className="btn-cancel" onClick={onClose}>Batal</button>
                            <button type="submit" className="btn-save" disabled={loading}>
                                {loading ? "Menyimpan..." : "Simpan"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

function WatchlistCard({ item, onEdit }) {
    const cfg = STATUS_CONFIG[item.status] || STATUS_CONFIG.plan_to_watch;
    const total = item.kdrama?.total_episodes;
    const cur = item.current_episode;
    const pct = total && cur ? Math.min(100, Math.round((cur / total) * 100)) : null;

    return (
        <div className="card" onClick={() => onEdit(item)}>
            <div className="card-poster-wrap">
                <img
                    src={item.kdrama?.poster_url || "/placeholder.jpg"}
                    alt={item.kdrama?.kdrama_name}
                    className="card-poster"
                    loading="lazy"
                />
                <div
                    className="card-status-badge"
                    style={{ background: cfg.bg, color: cfg.color, borderColor: cfg.color }}
                >
                    {cfg.icon} {cfg.label}
                </div>
                {item.rating && (
                    <div className="card-rating-badge">★ {item.rating}</div>
                )}
            </div>
            <div className="card-body">
                <h3 className="card-name">{item.kdrama?.kdrama_name}</h3>
                <p className="card-meta">
                    {item.kdrama?.year}
                    {item.kdrama?.genre && (
                        <span className="card-genre">
                            · {Array.isArray(item.kdrama.genre)
                                ? item.kdrama.genre[0]
                                : String(item.kdrama.genre).split(",")[0].trim()}
                        </span>
                    )}
                </p>
                {total ? (
                    <div className="card-progress">
                        <div className="card-progress-text">
                            <span>Ep {cur ?? 0} / {total}</span>
                            {pct !== null && <span className="card-pct">{pct}%</span>}
                        </div>
                        <div className="card-progress-bar">
                            <div
                                className="card-progress-fill"
                                style={{ width: `${pct ?? 0}%`, background: cfg.color }}
                            />
                        </div>
                    </div>
                ) : null}
                {item.notes && <p className="card-notes">"{item.notes}"</p>}
                <p className="card-date">Ditambahkan {formatDate(item.created_at)}</p>
            </div>
        </div>
    );
}

export default function WatchlistUser({ watchlist, counts }) {
    const [activeFilter, setActiveFilter] = useState("all");
    const [editItem, setEditItem] = useState(null);
    const [search, setSearch] = useState("");

    const items = watchlist?.data ?? [];
    const statCounts = counts ?? {
        all: watchlist?.total ?? items.length,
        plan_to_watch: items.filter((i) => i.status === "plan_to_watch").length,
        watching: items.filter((i) => i.status === "watching").length,
        completed: items.filter((i) => i.status === "completed").length,
    };

    const filtered = items
        .filter((i) => activeFilter === "all" || i.status === activeFilter)
        .filter((i) => i.kdrama?.kdrama_name?.toLowerCase().includes(search.toLowerCase()));

    function handlePageChange(url) {
        if (!url) return;
        router.get(url, {}, { preserveScroll: true, preserveState: true });
    }

    const links = watchlist?.links ?? [];

    return (
        <>
            <UserLayout>
                {/* Hero Header yang diperindah */}
                <div className="relative mb-10 overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-950/40 via-purple-950/30 to-black/40 backdrop-blur-sm border border-white/10 p-6 sm:p-8">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl -z-0" />
                    <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl -z-0" />
                    <div className="relative z-10">
                        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                            Watch<span className="italic">list</span>
                        </h1>
                        <p className="text-gray-400 mt-2 text-sm max-w-xl">
                            {statCounts.all} drama tercatat · klik kartu untuk edit progress
                        </p>
                        <div className="flex flex-wrap items-center gap-3 mt-6">
                            {[
                                { key: "all", label: "Total Drama", icon: "🎬", color: "text-white" },
                                { key: "watching", label: "Watching", icon: "▶", color: "text-emerald-400" },
                                { key: "plan_to_watch", label: "Plan to Watch", icon: "⏳", color: "text-blue-400" },
                                { key: "completed", label: "Selesai", icon: "✓", color: "text-green-400" },
                            ].map((stat) => (
                                <div
                                    key={stat.key}
                                    className="group relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10"
                                >
                                    <span>{stat.icon}</span>
                                    <span>{stat.label}</span>
                                    <span className={`text-xs px-1.5 py-0.5 rounded-full bg-white/10 ${stat.color}`}>
                                        {statCounts[stat.key] ?? 0}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Kontrol dan konten lainnya (tidak berubah) */}
                <div className="controls">
                    <div className="search-wrap">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Cari drama..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="filter-tabs">
                        {[
                            { key: "all", label: "Semua" },
                            { key: "watching", label: "▶ Watching" },
                            { key: "plan_to_watch", label: "⏳ Plan" },
                            { key: "completed", label: "✓ Selesai" },
                        ].map((f) => (
                            <button
                                key={f.key}
                                className={`filter-tab ${activeFilter === f.key ? "active" : ""}`}
                                onClick={() => setActiveFilter(f.key)}
                            >
                                {f.label}
                                <span className="tab-count">{statCounts[f.key] ?? 0}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid">
                    {filtered.length === 0 ? (
                        <div className="empty">
                            <div className="empty-icon">📺</div>
                            <h3>{search ? "Drama tidak ditemukan" : "Watchlist kosong"}</h3>
                            <p>{search ? "Coba kata kunci lain" : "Tambahkan drama dari halaman detail"}</p>
                        </div>
                    ) : (
                        filtered.map((item) => (
                            <WatchlistCard key={item.id} item={item} onEdit={setEditItem} />
                        ))
                    )}
                </div>

                {links.length > 3 && (
                    <div className="pagination">
                        {links.map((link, i) => (
                            <button
                                key={i}
                                className={`page-btn ${link.active ? "current" : ""}`}
                                disabled={!link.url}
                                onClick={() => handlePageChange(link.url)}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </UserLayout>

            {editItem && (
                <EditModal item={editItem} onClose={() => setEditItem(null)} />
            )}
        </>
    );
}
