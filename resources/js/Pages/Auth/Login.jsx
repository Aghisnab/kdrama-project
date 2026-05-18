import { useForm } from "@inertiajs/react";

export default function Login(){
    const { data, setData, post, processing, errors} = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950">
            <div className="bg-gray-900 p-8 rounded-xl w-full max-w-md text-white">
                <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
                <form onSubmit={submit} className="space-y-4">
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
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="remember"
                            checked={data.remember}
                            onChange={e => setData('remember', e.target.checked)}
                        />
                        <label htmlFor="remember" className="text-sm text-gray-400">Ingat saya</label>
                    </div>
                    <button type="submit"
                            disabled={processing}
                            className="w-full py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition">
                            {processing ? 'Masuk ...' : 'Login'}
                    </button>
                </form>
                <p className="text-center text-sm mt-4 text-gray-400">
                    Belum punya akun? <a href="/register" className="text-purple-400 hover:underline">Daftar</a>
                </p>
            </div>
        </div>
    );
}

