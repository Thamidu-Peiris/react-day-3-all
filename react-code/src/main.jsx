import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import {Toaster} from 'react-hot-toast'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <Toaster
      position="top-right"
      gutter={10}
      toastOptions={{
        duration: 5000,
        removeDelay: 1000,
        style: {
          padding: "5px",
          paddingLeft: "10px",
          paddingRight: "10px",
          background: "black",
          color: "#fff",
          border: "3px solid #363636",
        },

        error: {
          duration: 8000,

          iconTheme: {
            primary: "red",
            secondary: "white",
          },
        },

        success: {
          duration: 3000,
          iconTheme: {
            primary: "green",
            secondary: "white",
          },
        },
      }}
    />
    <App />
  </BrowserRouter>
)
