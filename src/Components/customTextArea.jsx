import React from 'react'

const CustomTextArea = ({ textareaName, textAreaValue, handleOnChangeTextArea, placeholder}) => {
     return (
          <textarea name="messageBody" onInput={handleOnChangeTextArea} value={textAreaValue}
               placeholder={placeholder} id={textareaName} className='w-full p-2 text-gray-800 text-sm' rows={5} />
     )
}

export default CustomTextArea
