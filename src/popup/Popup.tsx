import { sessionStateSignal } from "@/shared/state/auth/session"
import { calendarIdSignal } from "@/shared/state/calendarId"
import { Flex, Loader } from "@mantine/core"
import { useState } from "react"
import Dev from "./views/Dev"
import Header from "./views/Header"
import Home from "./views/Home"
import LoginView from "./views/LoginView"
import SetCalendarView from "./views/SetCalendarView"
import Settings from "./views/Settings"

export type View = "HOME" | "SETTINGS" | "DEV"

export default function () {
  const [view, setView] = useState<View>("HOME")

  if (sessionStateSignal.value === "NOT_LOGGED_IN") return <LoginView />
  if (calendarIdSignal.value === null) return <SetCalendarView />

  if (sessionStateSignal.value === "LOGGED_IN" && calendarIdSignal.value !== null) {
    return (
      <>
        <Header view={view} setView={setView} />
        {view === "HOME" && <Home />}
        {view === "SETTINGS" && <Settings />}
        {view === "DEV" && <Dev />}
      </>
    )
  }

  // This should never happen
  return (
    <Flex align="center" justify="center" style={{ height: "100vh" }}>
      <Loader />
    </Flex>
  )
}
