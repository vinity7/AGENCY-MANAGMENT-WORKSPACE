import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#141414] border border-white/10 rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden">
                <div className="flex justify-between items-center p-6 border-b border-white/5">
                    <h2 className="text-xl font-black text-white tracking-tight uppercase">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-slate-500 hover:text-white transition-colors p-1"
                    >
                        <X size={24} />
                    </button>
                </div>
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
