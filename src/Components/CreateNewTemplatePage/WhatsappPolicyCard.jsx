import React from 'react'
import { AiOutlineExclamationCircle } from 'react-icons/ai'
import { Link } from 'react-router-dom'

const WhatsappPolicyCard = () => {

     const policyContent = [
          {
               id: 1,
               labelText: "No promotional content for restricted businesses (gambling, alcohol, adult content, etc.)",
               inputType: "checkbox",
               labelName: "promotionalContent"
          },
          {
               id: 2,
               labelText: "No deceptive or misleading content",
               inputType: "checkbox",
               labelName: "misleadingContent"
          },
          {
               id: 3,
               labelText: "No content that exploits or endangers users",
               inputType: "checkbox",
               labelName: "contentEndangerUsers",
          },
          {

               id: 4,
               labelText: "No content that violates third-party rights (copyright, trademark, etc.)",
               inputType: "checkbox",
               labelName: "thirdPartyCopyrights",
          },
          {
               id: 5,
               labelText: "I have read and agree to WhatsApp's",
               inputType: "checkbox",
               labelName: "whatsappMessagingPolicy"
          }
     ];

     return (
          <div className='bg-white rounded-xl divide-y divide-gray-200 flex flex-col w-full gap-3 shadow-sm space-y-4'>
               <div className='p-4'>
                    <div>
                         <h2 className='text-gray-900 font-medium text-lg'>WhatsApp Policy Compliance</h2>
                    </div>
                    <div>
                         <p className='text-gray-800 mb-4 text-sm'>Ensure your template complies with WhatsApp's Business Messaging Policy before submission.</p>
                    </div>
                    <div className='bg-yellow-100 flex items-center gap-x-2 flex-row text-yellow-700 p-3 border-l-3 border-yellow-600'>
                         <AiOutlineExclamationCircle size={20} />
                         <p className='text-sm'>Templates that violate WhatsApp's policies will be rejected during the review process.</p>
                    </div>
                    <div className='my-4 space-y-[5px]'>
                         {
                              policyContent.map((content) => (
                                   <div key={content.id} className='flex flex-row items-center justify-start gap-x-2'>
                                        <input type={content.inputType} id={content.labelName} name={content.labelName} className='accent-green-600 h-4 w-4 cursor-pointer' />
                                        <label htmlFor={content.labelName} className='cursor-pointer text-gray-700 text-[15px]'>{content.labelText.trim()}</label>
                                        {
                                             content.id === 5 &&
                                             <Link to={"#"} className='text-green-500'>
                                                  Business Messaging Policy
                                             </Link>
                                        }
                                   </div>
                              ))
                         }
                    </div>
               </div>
          </div>
     )
}

export default WhatsappPolicyCard
