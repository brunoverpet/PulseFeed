import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { HelpCircle } from 'lucide-react'
import { useState } from 'react'

interface InputGroupTooltipProps {
  placeholder: string
  type: 'text' | 'password' | 'email'
  infoToolTip: string
  value?: string
  onChange?: (value: string) => void
}

export function InputGroupTooltip({
  infoToolTip,
  placeholder,
  type,
  value: controlledValue,
  onChange,
}: InputGroupTooltipProps) {
  const [internalValue, setInternalValue] = useState('')
  const value = controlledValue ?? internalValue

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (onChange) {
      onChange(e.target.value)
    } else {
      setInternalValue(e.target.value)
    }
  }

  return (
    <div className="grid w-full max-w-sm gap-4">
      <InputGroup>
        <InputGroupInput
          placeholder={placeholder}
          type={type}
          value={value}
          onChange={handleChange}
        />
        <InputGroupAddon align="inline-end">
          <Tooltip>
            <TooltipTrigger asChild>
              <InputGroupButton variant="ghost" aria-label="Help" size="icon-xs">
                <HelpCircle />
              </InputGroupButton>
            </TooltipTrigger>
            <TooltipContent>
              <p>{infoToolTip}</p>
            </TooltipContent>
          </Tooltip>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}
