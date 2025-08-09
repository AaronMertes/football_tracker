import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-primary">Football Play Tracker</h1>
      <p className="mt-2 text-gray-700">Project scaffold is ready.</p>
      <div className="mt-4">
        <div className="flex flex-col gap-2">
          <Link to="/setup" className="text-accent underline">Go to Game Setup</Link>
          <Link to="/play" className="text-accent underline">Go to Play Entry</Link>
        </div>
      </div>
    </div>
  )
}

