import React from "react"
import ReactDOM from "react-dom/client"

import Providers from "@/components/Providers"
import RedirectPage from "./RedirectPage"

import "@mantine/core/styles.css"
import "./index.css"

ReactDOM.createRoot(document.getElementById("app") as HTMLElement).render(
  <React.StrictMode>
    <Providers>
      <RedirectPage />
    </Providers>
  </React.StrictMode>,
)
