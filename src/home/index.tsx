import React from "react"
import ReactDOM from "react-dom/client"
import { Home } from "./Home"
import "./index.css"
import Providers from "@/components/Providers"

ReactDOM.createRoot(document.getElementById("app") as HTMLElement).render(
  <React.StrictMode>
    <Providers>
      <Home />
    </Providers>
  </React.StrictMode>,
)
