import React from 'react'

const PickFileDynamically = ({ fileType, icon, text, isWidthFull, reference, onChangeFile, handleOnClickFile }) => {

     return (
          <button className={`px-4 py-3 font-medium rounded-md border-1 border-gray-400 my-2 hover:bg-gray-50 shadow-sm flex flex-row items-center justify-center text-gray-500 hover:text-gray-700 cursor-pointer ${isWidthFull ? "w-full" : "w-[150px] text-md font-medium text-gray-800 border-1 border-gray-300 bg-white hover:bg-gray-50 transition-all px-4 py-3"} gap-x-2 text-sm`} onClick={handleOnClickFile}>
               <input type={"file"} accept={fileType} ref={reference} className="hidden" onChange={onChangeFile} />
               {icon}
               <span>{text}</span>
          </button>
     )
}

export default PickFileDynamically
