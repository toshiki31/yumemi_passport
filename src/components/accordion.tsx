import React, { useState } from 'react'
import '../assets/app.scss'

export const Accordion = (prop: {
  props: { selectItem: string; handleSelect: (item: string) => void }
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const selectList = ['総人口', '年少人口', '生産年齢人口', '老年人口']
  const selectItem = prop.props.selectItem
  const handleSelectChange = (item: string) => {
    prop.props.handleSelect(item)
    setIsOpen(false)
  }

  return (
    <div className="accordion_container">
      <div className="accordion_summary" onClick={() => setIsOpen(!isOpen)}>
        <span className="accordion_text">{selectItem}</span>
        <span className={`accordion_icon ${isOpen ? 'open' : ''}`}></span>
      </div>
      {isOpen && (
        <div className="accordion_details">
          {selectList.map(
            (item, index) =>
              item !== selectItem && (
                <div
                  key={index}
                  className="accordion_item"
                  onClick={() => handleSelectChange(item)}
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
