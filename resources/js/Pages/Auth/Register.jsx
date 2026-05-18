import { useForm } from "@inertiajs/react";

export default function Register(){
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/register');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950">
            <div className="bg-gray-900 p-8 rounded-xl w-full max-w-md text-white">
                <h1 className="text-2xl font-bold mb-6 text-center">Daftar Akun</h1>
                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="block mb-1 text-sm">Nama</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-purple-500"
                        />
                        {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                    </div>
                    <div>
                        <label className="block mb-1 text-sm">Email</label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={e => setData('email', e.target.value)}
                            className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-purple-500"
                        />
                        {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                    </div>
                    <div>
                        <label className="block mb-1 text-sm">Password</label>
                        <input
                            type="password"
                            value={data.password}
                            onChange={e => setData('password', e.target.value)}
                            className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-purple-500"
                        />
                        {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
                    </div>
                    <div>
                        <label className="block mb-1 text-sm">Konfirmasi Password</label>
                        <input
                            type="password"
                            value={data.password_confirmation}
                            onChange={e => setData('password_confirmation', e.target.value)}
                            className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-purple-500"
                        />
                    </div>
                    <button type="submit"
                            disabled={processing}
                            className="w-full py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition">
                            {processing ? 'Mendaftar ...' : 'Daftar'}
                    </button>
                </form>
                <p className="text-center text-sm mt-4 text-gray-400">
                    Sudah punya akun? <a href="/login" className="text-purple-400 hover:underline">Login</a>
                </p>
            </div>
        </div>
    );
}
