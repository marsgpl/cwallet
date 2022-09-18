import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from 'components/App'
import { ErrorBoundary } from 'components/ErrorBoundary'
import { HashRouter } from 'react-router-dom'
import './index.css'

document.addEventListener('DOMContentLoaded', () => {
    const container = document.createElement('div')

    container.id = 'root'

    document.body.appendChild(container)

    const root = ReactDOM.createRoot(container)

    root.render(
        <React.StrictMode>
            <HashRouter>
                <ErrorBoundary>
                    <App />
                </ErrorBoundary>
            </HashRouter>
        </React.StrictMode>
    )
})
