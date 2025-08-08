import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-primary">Football Play Tracker</h1>
      <p className="mt-2 text-gray-700">Project scaffold is ready.</p>
      <div className="mt-4">
        <Link to="/setup" className="text-accent underline">Go to Game Setup</Link>
      </div>
    </div>
  )
}

