import { setupOAuthFlow } from "./auth/oauthFlow/setupOAuthFlow"
import setupSessionRefresh from "./auth/setupSessionRefresh"
import setupCalendarSync from "./calendar/setupCalendarSync"
import { setupHandlingRuntimeMessages } from "./runtime_messages/setupHandlingRuntimeMessages"

setupOAuthFlow()
setupHandlingRuntimeMessages()
setupSessionRefresh()
setupCalendarSync()
