import React from 'react'
import { Link } from 'react-router-dom'

const CustomButton = ({ title, href }) => {
     return (
          <Link
               to={href}
               className=" mt-5 flex flex-row bg-green-500 items-center justify-center px-3 py-2 rounded-lg cursor-pointer">
               <div>
                    <h2 className="text-sm text-white font-medium">{title}</h2>
               </div>
          </Link>
     )
}

export default CustomButton
