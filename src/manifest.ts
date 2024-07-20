import { defineManifest } from "@crxjs/vite-plugin"
import packageData from "../package.json"

const isDev = process.env.NODE_ENV === "development"

export default defineManifest({
  name: `${packageData.displayName || packageData.name}${isDev ? " ➡️ Dev" : ""}`,
  description: packageData.description,
  version: packageData.version,
  manifest_version: 3,
  icons: {
    16: "img/logo-16.png",
    32: "img/logo-34.png",
    48: "img/logo-48.png",
    128: "img/logo-128.png",
  },
  action: {
    default_popup: "popup.html",
    default_icon: "img/logo-48.png",
  },
  background: {
    service_worker: "src/background/index.ts",
    type: "module",
  },
  content_scripts: [
    {
      matches: ["https://www.youtube.com/*"],
      js: ["src/contentScript/index.ts"],
    },
  ],
  web_accessible_resources: [
    {
      resources: [
        "img/logo-16.png",
        "img/logo-34.png",
        "img/logo-48.png",
        "img/logo-128.png",
      ],
      matches: [],
    },
  ],
  permissions: ["storage", "tabs", "identity"],
  oauth2: {
    client_id: "499463732095-s87itm7psq38rntkvvkgl0fl1e2n0lit.apps.googleusercontent.com",
    scopes: ["openid", "email", "profile", "https://www.googleapis.com/auth/calendar"],
  },
})
