// src/components/common/PopupLocalisation.jsx

function PopupLocalisation({ visible, onAccepter, onRefuser }) {
    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center
                        bg-black/50 backdrop-blur-sm px-6">
            <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl text-center">

                {/* Icône */}
                <div className="w-14 h-14 mx-auto mb-4 rounded-full
                                bg-[#D6ABEB]/30 flex items-center justify-center">
                    <svg className="w-7 h-7 text-[#4D027A]" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827
                                 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </div>

                <p className="font-bold text-[#1E1B2E] mb-2">
                    Activer la localisation
                </p>
                <p className="text-sm text-gray-500 mb-6">
                    Autorisez l'accès à votre position pour voir les événements
                    près de chez vous.
                </p>

                <div className="flex gap-3">
                    <button
                        onClick={onRefuser}
                        className="flex-1 py-3 rounded-xl text-sm font-semibold
                                   border border-gray-300 text-gray-600
                                   hover:bg-gray-50 transition-colors"
                    >
                        Plus tard
                    </button>
                    <button
                        onClick={onAccepter}
                        className="flex-1 py-3 rounded-xl text-sm font-bold
                                   bg-[#4D027A] text-white
                                   hover:bg-[#3a0260] transition-colors"
                    >
                        Activer
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PopupLocalisation;