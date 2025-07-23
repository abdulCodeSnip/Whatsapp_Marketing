import React from 'react'
import { CgClose } from 'react-icons/cg'

const DeleteMessageDialog = ({ title, contactName, contactPhone, message, footer, closeDeleteDialog, deleteMessageCompletely }) => {
     return (
          <div className='flex flex-col divide-y divide-gray-200'>
               <div className='flex flex-row items-center justify-between w-full gap-x-2 '>
                    <div>
                         <h2 className='font-semibold text-lg text-gray-800 my-2'>{title}</h2>
                    </div>
                    <div className='cursor-pointer p-2 rounded-full hover:bg-gray-100' onClick={closeDeleteDialog}>
                         <CgClose size={20} />
                    </div>
               </div>

               <div className='my-4 flex items-start justify-start flex-col'>
                    <div className='flex flex-row'>
                         <h2 className='font-medium p-2 rounded-full w-[40px] h-[40px] items-center justify-center flex  border-gray-200 bg-green-200'>
                              {
                                   contactName.split(" ")[0].charAt(0).toUpperCase() +
                                   contactName.split(" ")[1].charAt(0).toUpperCase()
                              }
                         </h2>
                         <div>
                              <span className='text-gray-800 mx-2 font-medium'>{contactName}</span><br />
                              <div>
                                   <span className='text-gray-500 text-sm mx-2'>{contactPhone}</span>
                              </div>
                         </div>
                    </div>

                    <div className='flex flex-col items-center justify-center '>
                         <span className='text-gray-500 text-sm m-5 p-3 bg-gray-50 rounded-xl'>
                              {
                                   message
                              }
                         </span>
                         <span className='text-gray-500 text-[15px] mb-5'>
                              {footer}
                         </span>
                    </div>
               </div>
               <div className='flex flex-row items-center justify-end gap-x-5'>
                    <button className='px-3 py-2 cursor-pointer text-sm font-medium text-gray-500 rounded-lg border-gray-300 border-2 bg-gray-50' onClick={closeDeleteDialog}>Cancel</button>

                    <button className='px-3 py-2 cursor-pointer text-sm font-medium text-gray-100 rounded-lg border-red-300 border-2 bg-red-500' onClick={deleteMessageCompletely}>Delete</button>
               </div>
          </div>
     )
}

export default DeleteMessageDialog
