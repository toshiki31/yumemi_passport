import React, { useState } from 'react'
import '../assets/app.scss'

export const Accordion = () => {
  const [selected, setSelected] = useState('総人口')
  const [isOpen, setIsOpen] = useState(false)

  const items = ['総人口', '生産年齢人口', '年少人口', '老年人口']

  const handleSelect = (item: string) => {
    setSelected(item)
    setIsOpen(false)
  }

  return (
    <div className="accordion_container">
      <div className="accordion_summary" onClick={() => setIsOpen(!isOpen)}>
        <span className="accordion_text">{selected}</span>
        <span className={`accordion_icon ${isOpen ? 'open' : ''}`}></span>
      </div>
      {isOpen && (
        <div className="accordion_details">
          {items.map(
            (item, index) =>
              item !== selected && (
                <div
                  key={index}
                  className="accordion_item"
                  onClick={() => handleSelect(item)}
                >
                  {item}
                </div>
              )
          )}
        </div>
      )}
    </div>
  )
}
