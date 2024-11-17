import { TextInput, type TextInputProps } from "@mantine/core"
import { type ForwardedRef, forwardRef } from "react"
import * as v from "valibot"

export const llmApiUrlFieldSchema = v.string("API URL is required")

export default forwardRef(
  (props: TextInputProps, ref: ForwardedRef<HTMLInputElement>) => {
    return (
      <TextInput
        label="LLM API URL"
        description="API endpoint for the language model service"
        placeholder="https://api.openai.com/v1/chat/completions"
        ref={ref}
        {...props}
      />
    )
  },
) 