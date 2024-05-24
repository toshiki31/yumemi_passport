import { useState, useContext } from 'react'
import { SetLabelContext } from '../contexts/labelContext'

export const useAccordion = () => {
  const setLabel = useContext(SetLabelContext)
  const [isOpen, setIsOpen] = useState(false)

  const handleLabelChange = (selected: string) => {
    setLabel(selected)
    setIsOpen(false)
  }

  const toggleAction = () => {
    setIsOpen((prev) => !prev)
  }
  return { isOpen, handleLabelChange, toggleAction }
}
