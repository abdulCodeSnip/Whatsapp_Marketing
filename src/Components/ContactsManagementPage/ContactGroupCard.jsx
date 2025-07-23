import React, { useState } from 'react'
import { BiStar } from 'react-icons/bi';
import { CiStar } from 'react-icons/ci';
import { PiPlus } from 'react-icons/pi'
import { RiGroup2Line, RiGroupLine } from 'react-icons/ri';
import { TiUserOutline } from 'react-icons/ti'
import { useSelector } from 'react-redux';

const ContactGroupCard = () => {
     const [isButtonActive, setIsButtonActive] = useState(true);

     const allContacts = useSelector((state) => state?.allContacts?.allContacts[0]);

     console.log(allContacts?.filter(contact => contact?.is_favourite === true));
     const favouriteContacts = allContacts?.filter(contact => contact?.is_favourite === true)?.length || 0;
     const customerContacts = allContacts?.filter((contact) => contact?.type?.toLowerCase() === "customer")?.length || 0;
     const prospectContacts = allContacts?.filter((contact) => contact?.type?.toLowerCase() === "prospects")?.length || 0;
     const teamSupport = allContacts?.filter((contact) => contact?.type?.toLowerCase() === ("team support" || "team_support" || "teamSupport" || "team" || "support"))?.length;
     const marketingList = allContacts?.filter((contact) => contact?.type?.toLowerCase() === ("marketing" || "marketing lists" || "lists" || "marketing_list"))?.length || 0;

     let shortcutContactButtons = [
          {
               btnId: "1",
               btnText: "All Contacts",
               contactsLength: allContacts?.length,
               btnIcon: <TiUserOutline size={18} />
          },
          {
               btnId: "2",
               btnText: "Favorites",
               contactsLength: favouriteContacts,
               btnIcon: <BiStar size={18} />
          },
          {
               btnId: "3",
               btnText: "Customers",
               contactsLength: customerContacts,
               btnIcon: <RiGroupLine size={18} />
          },
          {
               btnId: "4",
               btnText: "Prospects",
               contactsLength: prospectContacts,
               btnIcon: <RiGroupLine size={18} />
          },
          {
               btnId: "5",
               btnText: "Team Support",
               contactsLength: teamSupport || 0,
               btnIcon: <RiGroupLine size={18} />
          },
          {
               btnId: "6",
               btnText: "Marketing Lists",
               contactsLength: marketingList,
               btnIcon: <RiGroupLine size={18} />
          }
     ]
     return (
          <div className="bg-white shadow-sm rounded-xl flex flex-col w-full divide-y-1 divide-gray-200">
               <div className="flex flex-row justify-between items-center gap-x-2 py-3 px-4">
                    <h2 className="text-md font-medium text-gray-800 ">
                         Contact Groups
                    </h2>
                    <div className='cursor-pointer text-green-600'>
                         <PiPlus size={20} />
                    </div>
               </div>
               <div className='flex flex-col my-2 px-3 py-2 space-y-2'>
                    {
                         shortcutContactButtons.map((shortBtn) => (
                              <button key={shortBtn.btnId} className={`p-3 rounded-xl transition-all flex w-full flex-row text-sm 
                                        items-center justify-between gap-x-3 cursor-pointer font-medium ${shortBtn.btnId == 1 ? "bg-green-50 text-green-500" : "bg-white text-gray-900 hover:bg-gray-50"}`}>
                                   <button className={"flex flex-row gap-x-2"}>
                                        {
                                             shortBtn.btnIcon
                                        }
                                        <span>{shortBtn.btnText}</span>
                                   </button>
                                   <div>
                                        <span className={`${shortBtn.btnId == 1 ? "bg-green-100 text-green-500" : "bg-gray-200"} px-2 py-1 rounded-full`}>{shortBtn.contactsLength}</span>
                                   </div>
                              </button>
                         ))
                    }
               </div>
          </div>
     )
}

export default ContactGroupCard;
