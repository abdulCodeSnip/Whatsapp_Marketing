import React from 'react'

const FooterPagination = () => {
     return (
          <div className="flex flex-row gap-x-3 ">
               <div className="cursor-pointer border border-gray-200 px-3 py-1 rounded-lg flex flex-row items-center justify-center text-sm text-gray-600">
                    <button className="cursor-pointer">Previous</button>
               </div>
               <div className="cursor-pointer border bg-green-500 text-white border-gray-200 px-3 py-1 rounded-lg flex flex-row items-center justify-center text-sm ">
                    <button className="cursor-pointer">1</button>
               </div>
               <div className="cursor-pointer border border-gray-200 px-3 py-1 rounded-lg flex flex-row items-center justify-center text-sm text-gray-600">
                    <button className="cursor-pointer font-medium">2</button>
               </div>
               <div className="cursor-pointer border border-gray-200 px-3 py-1 rounded-lg flex flex-row items-center justify-center text-sm text-gray-600">
                    <button className="cursor-pointer font-medium">3</button>
               </div>
               <div className="cursor-pointer border border-gray-200 px-3 py-1 rounded-lg flex flex-row items-center justify-center text-sm text-gray-600">
                    <button className="cursor-pointer font-medium">...</button>
               </div>
               <div className="cursor-pointer border border-gray-200 px-2 py-1 rounded-lg text-sm text-gray-600">
                    <button className="cursor-pointer font-medium">5</button>
               </div>
               <div className="cursor-pointer border border-gray-200 px-3 py-1 rounded-lg flex flex-row items-center justify-center text-sm text-gray-600">
                    <button className="cursor-pointer">Next</button>
               </div>
          </div>
     )
}

export default FooterPagination
