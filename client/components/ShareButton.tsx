import React, { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { ClipboardCheck, Copy } from 'lucide-react'

export default function ShareButton() {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      toast.success('Lien copié dans le presse-papier')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Impossible de copier le lien')
    }
  }

  return (
    <Button
      variant="outline"
      onClick={handleCopy}
      aria-label="Copier le lien"
      title="Copier le lien"
      className={`transition-colors duration-300 `}
    >
      {copied ? (
        <>
          <ClipboardCheck />
          Lien copié
        </>
      ) : (
        <>
          <Copy className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Partager</span>
        </>
      )}
    </Button>
  )
}
