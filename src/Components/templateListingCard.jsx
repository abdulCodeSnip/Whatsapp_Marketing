import React from 'react'
import { AiOutlineFileText } from 'react-icons/ai'
import { BiDuplicate, BiPencil } from 'react-icons/bi';
import { RiDeleteBin4Line } from 'react-icons/ri';

const TemplateListingCard = ({ templateName, templateCategory, templateStatus, templateCreateDate, deleteTemplateAction, templateLanguage, editTemplate }) => {

     // Dynamic Background color for "Template Categories" based on the template name
     let templateCategoryBGColor = "";
     let templateCategoryTxtColor = "";

     switch (templateCategory) {
          case "Marketing":
               templateCategoryBGColor = "bg-indigo-100";
               templateCategoryTxtColor = "text-indigo-600";
               break;
          case "Transactional":
               templateCategoryBGColor = "bg-blue-100";
               templateCategoryTxtColor = "text-blue-600";

               break;
          case "Utility":
               templateCategoryBGColor = "bg-green-100";
               templateCategoryTxtColor = "text-green-600";

               break;
          case "Authentication":
               templateCategoryBGColor = "bg-purple-100";
               templateCategoryTxtColor = "text-purple-600";

               break;
          case "Customer Support":
               templateCategoryBGColor = "bg-amber-100";
               templateCategoryTxtColor = "text-amber-600";
               break;
          default:
               break;
     }


     // Changing colors of "Status" based on the template status
     let templateStatusBgColor = "";
     let templateStatusTxtColor = "";
     let templateStatusDotColor = "";


     switch (templateStatus) {
          case "Approved":
               templateStatusBgColor = "bg-green-100";
               templateStatusTxtColor = "text-green-600";
               templateStatusDotColor = "bg-green-600";
               break;
          case "Pending":
               templateStatusBgColor = "bg-yellow-100";
               templateStatusTxtColor = "text-yellow-600";
               templateStatusDotColor = "bg-yellow-600";
               break;
          case "Rejected":
               templateStatusBgColor = "bg-red-100";
               templateStatusTxtColor = "text-red-600";
               templateStatusDotColor = "bg-red-600";
               break;
          default:
               break;
     }

     return (
          <tr className='hover:bg-gray-50'>

               <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='flex items-center'>
                         <div className='flex items-center justify-center bg-blue-100 text-blue-600 w-8 h-8 rounded-xl'>
                              <AiOutlineFileText />
                         </div>
                         <div className='ml-3'>
                              <div className='font-medium text-gray-900'>
                                   {
                                        templateName
                                   }
                              </div>
                              <div className='text-xs text-gray-500'>
                                   {
                                        templateLanguage
                                   }
                              </div>
                         </div>
                    </div>
               </td>

               <td className='px-6 py-4 whitespace-nowrap'>
                    <span className={`text-xs font-medium ${templateCategoryBGColor}  rounded-full px-2 py-1 ${templateCategoryTxtColor}`}>
                         {templateCategory}
                    </span>
               </td>

               <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='flex items-center gap-x-2 justify-start'>
                         <div className={`w-2 h-2 ${templateStatusDotColor} rounded-full`}></div>
                         <div className='flex items-center justify-center'>
                              <span className={`text-xs font-medium ${templateStatusTxtColor} ${templateStatusBgColor} rounded-full px-2 py-1`}>{templateStatus}</span>
                         </div>
                    </div>
               </td>

               <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    <span className={``}>
                         {templateCreateDate}
                    </span>
               </td>

               <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    <div className='flex items-center gap-x-4'>

                         {/* Edit button to edit a template */}
                         <button onClick={editTemplate} className='rounded-full p-2 hover:bg-gray-100 cursor-pointer'>
                              <BiPencil size={15} />
                         </button>

                         {/* Duplicate Template Button */}
                         <button className='rounded-full p-2 hover:bg-gray-100 cursor-pointer'>
                              <BiDuplicate size={15} />
                         </button>
                         {/* DElete template Button */}
                         <button onClick={deleteTemplateAction} className='rounded-full p-2 hover:bg-gray-100 cursor-pointer'>
                              <RiDeleteBin4Line size={15} />
                         </button>
                    </div>
               </td>
          </tr>
     )
}

export default TemplateListingCard
