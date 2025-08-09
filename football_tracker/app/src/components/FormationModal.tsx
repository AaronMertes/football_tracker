import { useState } from 'react'

interface FormationModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (formation: string) => void
}

const COMMON_FORMATIONS = ['21', '12', '11', '22', '20', '02']

export default function FormationModal({ isOpen, onClose, onSelect }: FormationModalProps) {
  const [custom, setCustom] = useState('')

  if (!isOpen) return null

  function handleSelect(value: string) {
    onSelect(value)
    onClose()
  }

  function handleCustomSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (custom.trim()) {
      handleSelect(custom.trim())
      setCustom('')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded bg-white p-4 shadow-lg">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Select Formation</h2>
          <button className="text-sm underline" onClick={onClose}>Close</button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {COMMON_FORMATIONS.map((f) => (
            <button
              key={f}
              className="rounded border px-4 py-2 hover:bg-gray-50"
              onClick={() => handleSelect(f)}
            >
              {f}
            </button>
          ))}
        </div>
        <form className="mt-4 flex gap-2" onSubmit={handleCustomSubmit}>
          <input
            className="flex-1 rounded border px-3 py-2"
            placeholder="Custom (e.g., 13)"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
          />
          <button className="rounded bg-primary px-3 py-2 text-white" type="submit">Add</button>
        </form>
      </div>
    </div>
  )
}

