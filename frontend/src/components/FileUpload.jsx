import { useState } from 'react'

export default function FileUpload({ onUpload, loading }) {
    const [dragActive, setDragActive] = useState(false)

    const handleDrag = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true)
        } else if (e.type === 'dragleave') {
            setDragActive(false)
        }
    }

    const handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onUpload(e.dataTransfer.files[0])
        }
    }

    const handleChange = (e) => {
        e.preventDefault()
        if (e.target.files && e.target.files[0]) {
            onUpload(e.target.files[0])
        }
    }

    return (
        <form className="relative w-full max-w-lg mb-8" onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()}>
            <input
                type="file"
                id="input-file-upload"
                className="hidden"
                onChange={handleChange}
                accept=".xlsx, .xls, .csv"
            />
            <label
                id="label-file-upload"
                htmlFor="input-file-upload"
                className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl cursor-pointer transition-colors
            ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-white hover:bg-slate-50'}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                {loading ? (
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                ) : (
                    <div className="text-center p-6">
                        <p className="text-xl font-medium text-slate-700">Arrastra y Suelta Excel de Génesis con Boleta</p>
                        <p className="text-sm text-slate-400 mt-2">o haz clic para buscar</p>
                    </div>
                )}
            </label>
        </form>
    )
}
