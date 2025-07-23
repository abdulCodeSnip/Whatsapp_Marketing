import React from 'react'
import { TfiHeadphoneAlt } from "react-icons/tfi";


const ClickableCustomButton = () => {
     return (
          <div className='flex flex-row items-center justify-center bg-green-500 p-2 rounded-lg my-4'>
               <div>
                    <TfiHeadphoneAlt size={17} color="white" />
               </div>
          </div>
     )
}

export default ClickableCustomButton
