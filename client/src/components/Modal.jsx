import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-[#141414] border border-white/10 rounded-3xl shadow-2xl w-full max-w-lg relative flex flex-col my-auto max-h-[90vh]">
                <div className="flex justify-between items-center p-6 border-b border-white/5 flex-shrink-0">
                    <h2 className="text-xl font-black text-white tracking-tight uppercase">{title}</h2>
                    <button
                        onClick={onClose}
                        className="bg-white/5 text-slate-500 hover:text-white transition-all p-2 rounded-xl border border-white/5"
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto custom-scrollbar flex-grow">
                    {children}
                </div>
            </div>
        </div>
    );

};

export default Modal;
