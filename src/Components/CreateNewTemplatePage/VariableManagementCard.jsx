import React from 'react'
import { BiPencil, BiPlus } from 'react-icons/bi';
import { RiDeleteBin4Line } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import { onChangeVariables } from '../../redux/templatePage/variables';
import { addingVariables, removingVariables } from '../../redux/templatePage/addVariables';

const VariableManagementCard = () => {

     // Redux Values
     const dispatch = useDispatch();
     const variables = useSelector((state) => state?.addVariables?.variables);

     const defaultVariables =
          [
               {
                    id: 1,
                    variable: "{{1}}",
                    type: "Text",
                    default_value: "[Customer Name]",
                    is_required: true
               },
               {
                    id: 2,
                    variable: "{{2}}",
                    type: "Date",
                    default_value: "25 June 2025",
               },
               {
                    id: 3,
                    variable: "{{3}}",
                    type: "Number",
                    default_value: "20",
               }
          ];

     const selectedCheckBoxes = (isChecked, item) => {
          if (isChecked) {
               dispatch(addingVariables(item));
          } else {
               dispatch(removingVariables(item));
          }
     }

     return (
          <div className='bg-white rounded-xl shadow-sm divide-y divide-gray-200 flex flex-col space-y-4 w-full'>
               <div className='flex flex-col p-5'>
                    <h2 className='font-medium text-xl mt-3 text-gray-800'>
                         Variable Management
                    </h2>
               </div>
               <div >
                    <div className='flex flex-row items-center justify-between p-4 gap-x-3'>
                         <div>
                              <p className='text-gray-600 text-sm'>Add variables to personalize messages for each recipient</p>
                         </div>
                         <div>
                              <button className='text-gray-700 hover:text-gray-800 shadow px-3 py-2 rounded-lg font-medium text-base border-gray-500 border-1 bg-white hover:bg-gray-100 cursor-pointer transition-all flex flex-row items-center justify-center gap-x-1'>
                                   <BiPlus size={15} />
                                   <span>Add Variable</span>
                              </button>
                         </div>
                    </div>

                    {/* Table for Variables */}
                    <div className='p-5'>
                         <div className='rounded-xl border-1 border-gray-200 shadow-sm'>
                              <table className='min-w-full divide-y divide-gray-300'>
                                   <thead className='bg-gray-50'>
                                        <tr>
                                             <th scope='col' className='px-6 py-4 uppercase text-xs text-gray-500 font-medium tracking-wider text-left'>
                                                  Variable
                                             </th>
                                             <th scope='col' className='px-6 py-4 uppercase text-xs text-gray-500 font-medium tracking-wider text-left'>
                                                  Type
                                             </th>
                                             <th scope='col' className='px-6 py-4 uppercase text-xs text-gray-500 font-medium tracking-wider text-left'>
                                                  Default Value
                                             </th>
                                             <th scope='col' className='px-6 py-4 uppercase text-xs text-gray-500 font-medium tracking-wider text-left'>
                                                  Required
                                             </th>
                                             <th scope='col' className='px-6 py-4 uppercase text-xs text-gray-500 font-medium tracking-wider text-left'>
                                                  Actions
                                             </th>
                                        </tr>
                                   </thead>
                                   <tbody className='bg-white divide-y divide-gray-200'>
                                        {
                                             defaultVariables.map((defaultVar) => (
                                                  <tr key={defaultVar.id}>
                                                       <td className='px-6 py-4 text-sm whitespace-nowrap font-medium text-gray-900'>{defaultVar.variable}</td>
                                                       <td className='px-6 py-4 text-sm whitespace-nowrap text-gray-500'>
                                                            {defaultVar.type}
                                                       </td>
                                                       <td className='px-6 py-4 text-sm whitespace-nowrap text-gray-500'>
                                                            {defaultVar.default_value}
                                                       </td>
                                                       <td className='px-6 py-4 text-sm text-gray-500 whitespace-nowrap'>
                                                            <input type="checkbox"
                                                                 value={defaultVar.variable}
                                                                 onChange={(event) => selectedCheckBoxes(event.target.checked, defaultVar)} className='accent-green-600 h-[16px] w-[16px] rounded-xl border-green-600 cursor-pointer outline-none' />
                                                       </td>
                                                       <td className='px-6 py-4 text-sm text-gray-500 whitespace-nowrap space-x-3'>
                                                            <button className='p-2 rounded-full hover:bg-gray-100 transition-all cursor-pointer'>
                                                                 <BiPencil size={16} />
                                                            </button>
                                                            <button className='p-2 rounded-full hover:bg-gray-100 transition-all cursor-pointer'>
                                                                 <RiDeleteBin4Line size={16} />
                                                            </button>
                                                       </td>
                                                  </tr>
                                             ))
                                        }
                                   </tbody>
                              </table>
                         </div>
                    </div>
               </div>
          </div>
     )
}

export default VariableManagementCard
