'use client'

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from '@/components/ui/input-group'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { HelpCircle } from 'lucide-react'
import { useState } from 'react'

interface InputGroupTextareaTooltipProps {
  placeholder: string
  infoToolTip: string
  maxLength?: number
}

export function InputGroupTextareaTooltip({
  infoToolTip,
  placeholder,
  maxLength = 160,
}: InputGroupTextareaTooltipProps) {
  const [value, setValue] = useState('')

  return (
    <div className="grid w-full max-w-sm gap-4">
      <InputGroup>
        <InputGroupTextarea
          id="textarea-code-32"
          placeholder={placeholder}
          className="min-h-[150px]"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <InputGroupAddon align="block-end">
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
          <p className={`text-sm ${value.length > maxLength ? 'text-red-500' : 'text-gray-500'}`}>
            {value.length}/{maxLength}
          </p>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}
