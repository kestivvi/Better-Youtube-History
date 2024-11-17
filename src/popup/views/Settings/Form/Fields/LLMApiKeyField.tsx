import { PasswordInput, type PasswordInputProps } from "@mantine/core"
import { type ForwardedRef, forwardRef } from "react"
import * as v from "valibot"

export const llmApiKeyFieldSchema = v.string("API key is required")

export default forwardRef(
  (props: PasswordInputProps, ref: ForwardedRef<HTMLInputElement>) => {
    return (
      <PasswordInput
        label="LLM API Key"
        description="API key for the language model service (e.g., OpenAI API key)"
        placeholder="sk-..."
        ref={ref}
        {...props}
      />
    )
  },
) 