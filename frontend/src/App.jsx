import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './index.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="flex justify-center items-center gap-4 mb-8">
            <img src={viteLogo} className="h-16 w-16" alt="Vite logo" />
            <img src={reactLogo} className="h-16 w-16 animate-spin" alt="React logo" />
          </div>
          
          <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
            Welcome to Ledgerly
          </h1>
          
          <p className="text-lg mb-8" style={{ color: 'var(--color-text-secondary)' }}>
            Your React + Vite + Tailwind CSS project with Dark Green Theme is ready!
          </p>
          
          <div className="card max-w-md mx-auto mb-8">
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
              Counter Example
            </h2>
            <div className="text-6xl font-bold mb-4" style={{ color: 'var(--color-accent)' }}>
              {count}
            </div>
            <button
              onClick={() => setCount((count) => count + 1)}
              className="btn btn-primary"
            >
              Increment
            </button>
          </div>

          {/* Theme Showcase */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="card hover-lift">
              <h3 className="text-accent mb-2">Primary Theme</h3>
              <p className="text-secondary">Deep forest green with warm amber accents</p>
              <div className="mt-4 flex gap-2">
                <div className="w-8 h-8 rounded" style={{ backgroundColor: 'var(--color-primary)' }}></div>
                <div className="w-8 h-8 rounded" style={{ backgroundColor: 'var(--color-accent)' }}></div>
                <div className="w-8 h-8 rounded" style={{ backgroundColor: 'var(--color-secondary)' }}></div>
              </div>
            </div>

            <div className="card hover-lift">
              <h3 className="text-success mb-2">Status Colors</h3>
              <p className="text-secondary">Success, warning, error, and info indicators</p>
              <div className="mt-4 flex gap-2">
                <div className="w-8 h-8 rounded" style={{ backgroundColor: 'var(--color-success)' }}></div>
                <div className="w-8 h-8 rounded" style={{ backgroundColor: 'var(--color-warning)' }}></div>
                <div className="w-8 h-8 rounded" style={{ backgroundColor: 'var(--color-error)' }}></div>
                <div className="w-8 h-8 rounded" style={{ backgroundColor: 'var(--color-info)' }}></div>
              </div>
            </div>

            <div className="card hover-lift">
              <h3 className="text-accent mb-2">Interactive Elements</h3>
              <p className="text-secondary">Hover effects and animations</p>
              <div className="mt-4 flex gap-2">
                <button className="btn btn-primary">Primary</button>
                <button className="btn btn-accent">Accent</button>
                <button className="btn btn-secondary">Secondary</button>
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-sm" style={{ color: 'var(--color-text-muted)' }}>
            <p>Edit <code className="bg-surface px-2 py-1 rounded" style={{ color: 'var(--color-text-primary)' }}>src/App.jsx</code> and save to test HMR</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
