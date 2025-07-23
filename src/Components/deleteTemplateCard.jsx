import React from 'react'
import { BsExclamation, BsExclamationCircle } from 'react-icons/bs'

const DeleteTemplateCard = ({ title, closeDialog, deleteTemplateCompletely }) => {
     return (
          <div className='flex flex-col divide-y divide-gray-200 space-y-3'>
               <div>
                    <h2 className='text-gray-800 font-semibold text-lg p-3'>{title}</h2>
               </div>
               <div>
                    <div className='flex flex-row items-center justify-center gap-x-5'>
                         <div className='p-2 rounded-full bg-red-100 text-red-600'>
                              <BsExclamationCircle size={20} />
                         </div>
                         <div className='flex flex-col space-y-2'>
                              <h2 className='font-medium text-gray-600'>Are you sure you want to delete this template?</h2>
                              <p className='text-gray-500 text-sm/snug'>This action cannot be undone, this template would be deleted permanantly from your account</p>
                         </div>
                    </div>
                    <div className='flex flex-row items-end justify-end gap-x-5 mt-6  mb-2'>
                         <div>
                              <button
                                   onClick={closeDialog}
                                   className='px-3 py-2 border-gray-300 border-1 text-gray-500 bg-gray-100 cursor-pointer rounded-md'>Cancel</button>
                         </div>
                         <div>
                              <button
                                   onClick={deleteTemplateCompletely}
                                   className='px-3 py-2 border-red-300 bg-red-500 text-white cursor-pointer font-medium border-1 rounded-md'>Delete Template</button>
                         </div>
                    </div>
               </div>
          </div>
     )
}

export default DeleteTemplateCard
