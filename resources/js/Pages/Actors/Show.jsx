import { Link } from '@inertiajs/react';

export default function ActorShow({ actor }) {
    if (!actor) return null;

    const initials = actor.actor_name
        ? actor.actor_name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
        : '??';

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white">
            <nav className="flex items-center justify-between px-6 py-4 border-b border-white/[0.07] sticky top-0 bg-[#0a0a0f] z-10">
                <button onClick={() => history.back()} className="text-gray-500 hover:text-white text-sm transition">← Kembali</button>
                <span className="text-purple-400 font-medium tracking-widest text-sm">DRAKORLIST</span>
                <div className="w-16" />
            </nav>

            <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
                {/* Header aktor */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-violet-500/20 flex-shrink-0 flex items-center justify-center">
                        {actor.photo_url
                            ? <img src={actor.photo_url} alt={actor.actor_name} className="w-full h-full object-cover" />
                            : <span className="text-xl font-medium text-purple-300">{initials}</span>
                        }
                    </div>
                    <div>
                        <h1 className="text-xl font-medium text-white">{actor.actor_name}</h1>
                        <p className="text-sm text-gray-500">{actor.dramas?.length ?? 0} drama</p>
                        {actor.popularity && (
                            <p className="text-xs text-yellow-300">#{actor.popularity}</p>
                        )}
                    </div>
                </div>

                {/* Grid drama */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {actor.dramas?.map((item, i) => (
                        <Link key={item.kdrama?.kdrama_id ?? i} href={`/dramas/${item.kdrama?.kdrama_id}`}
                            className="bg-[#111118] border border-white/[0.06] rounded-xl overflow-hidden hover:border-purple-500/30 transition block">
                            <div className="h-36 bg-gradient-to-br from-violet-900/30 to-pink-900/20 overflow-hidden">
                                {item.kdrama?.poster_url
                                    ? <img src={item.kdrama.poster_url} alt={item.kdrama.kdrama_name} className="w-full h-full object-cover" />
                                    : <div className="w-full h-full flex items-center justify-center text-3xl">🎬</div>}
                            </div>
                            <div className="p-2">
                                <p className="text-xs font-medium text-white truncate mb-1">{item.kdrama?.kdrama_name}</p>
                                <p className="text-xs text-gray-600 truncate">{item.character_name}</p>
                                <span className="text-xs text-purple-400">{item.role}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
