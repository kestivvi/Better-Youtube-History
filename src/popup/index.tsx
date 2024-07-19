import React from "react"
import ReactDOM from "react-dom/client"

import Popup from "./Popup"
import Providers from "@/components/Providers"

import "@mantine/core/styles.css"
import "./index.css"

ReactDOM.createRoot(document.getElementById("app") as HTMLElement).render(
  <React.StrictMode>
    <Providers>
      <Popup />
    </Providers>
  </React.StrictMode>,
)
