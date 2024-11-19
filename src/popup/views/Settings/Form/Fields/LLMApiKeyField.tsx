import { PasswordInput, type PasswordInputProps } from "@mantine/core"
import { type ForwardedRef, forwardRef } from "react"
import * as v from "valibot"

export const llmApiKeyFieldSchema = v.optional(v.string())

export default forwardRef(
  (props: PasswordInputProps, ref: ForwardedRef<HTMLInputElement>) => {
    return (
      <PasswordInput
        label="LLM API Key"
        description="API key for the language model service (optional, required only if your LLM provider needs authentication)"
        placeholder="sk-..."
        ref={ref}
        {...props}
      />
    )
  },
)
