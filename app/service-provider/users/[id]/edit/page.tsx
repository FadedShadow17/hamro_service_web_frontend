export default function UserEditPage({ params }: { params: { id: string } }) {
    return (
        <div className="min-h-screen bg-[#0A2640] flex items-center justify-center text-white">
            <div className="bg-[#1C3D5B] p-8 rounded-xl border border-white/10">
                <h1 className="text-2xl font-bold mb-4">Edit User (Dummy)</h1>
                <p className="text-white/70">Editing user ID: <span className="text-[#69E6A6]">{params.id}</span></p>
            </div>
        </div>
    );
}
