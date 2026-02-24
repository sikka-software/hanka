'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Copy, Check, Terminal } from 'lucide-react'

type Props = {
  text: string
  label?: string
  terminal?: boolean
}

export default function CopyButton({ text, label = 'Copy', terminal = false }: Props) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button variant="outline" size="sm" onClick={handleCopy}>
      {copied ? (
        <Check className="w-4 h-4 mr-1" />
      ) : terminal ? (
        <Terminal className="w-4 h-4 mr-1" />
      ) : (
        <Copy className="w-4 h-4 mr-1" />
      )}
      {copied ? 'Copied!' : label}
    </Button>
  )
}
