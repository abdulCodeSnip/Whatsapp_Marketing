import React, { useEffect, useState } from 'react'
import { BiArrowBack, BiBell, BiListOl, BiNews, BiSolidNews, BiUser } from 'react-icons/bi'
import { BsWhatsapp } from 'react-icons/bs'
import { FaWhatsapp } from 'react-icons/fa'
import { HiOutlineNewspaper } from 'react-icons/hi'
import { IoCardOutline } from 'react-icons/io5'
import { MdSecurity } from 'react-icons/md'
import { RiPaletteLine, RiRobot3Line } from 'react-icons/ri'
import { SiApplearcade } from 'react-icons/si'
import { Link } from 'react-router-dom'
import AccountSetting from './AccountSetting'
import { useDispatch } from 'react-redux'
import { selectActiveButton } from '../../redux/settingsPage/sideBarOptions'

const SettingSideBar = () => {

    const [activeButton, setActiveButton] = useState("Option-1");
    const dispatch = useDispatch();

    // Custom buttons
    const sidebarOptions =
        [
            {
                id: 1,
                text: "Account Settings",
                icon: <BiUser size={14} color='gray' />,
                content: activeButton === "Option-1" ? <AccountSetting /> : null
            },
            {
                id: 2,
                text: "WhatsApp Connection",
                icon: <FaWhatsapp size={14} color='gray' />,
                content: ""

            },
            // {
            //     id: 3,
            //     text: "Notification Settings",
            //     icon: <BiBell size={14} color='gray' />,
            //     content: ""
            // },
            // {
            //     id: 4,
            //     text: "Message Templates",
            //     icon: <HiOutlineNewspaper size={14} color='gray' />,
            //     content: ""
            // },
            // {
            //     id: 5,
            //     text: "App Appearance",
            //     icon: <RiPaletteLine size={14} color='gray' />,
            //     content: ""
            // },
            // {
            //     id: 6,
            //     text: "Security & Privacy",
            //     icon: <MdSecurity size={14} color='gray' />,
            //     content: ""
            // },
            // {
            //     id: 7,
            //     text: "Billing & Subscription",
            //     icon: <IoCardOutline size={14} color='gray' />,
            //     content: ""
            // },
            // {
            //     id: 8,
            //     text: "Integration",
            //     icon: <RiRobot3Line size={14} color='gray' />,
            //     content: ""
            // }
        ]

    const handlingActiveButton = (e) => {
        setActiveButton(e.target?.name);
    }

    useEffect(() => {
        dispatch(selectActiveButton(activeButton));
    }, [activeButton])

    return (
        <div className='w-[300px] bg-white h-[100%] border border-gray-300 space-y-6 flex flex-col justify-between'>
            <div>
                <div className='p-5 flex flex-col items-start justify-center flex-wrap space-y-3'>
                    <h2 className='text-gray-900 font-medium text-xl'>
                        Settings
                    </h2>
                    <span className='text-gray-500 text-sm w-[200px]'>
                        Manage your account and preferences
                    </span>
                </div>
                <div className='flex flex-col' onClick={handlingActiveButton}>
                    {
                        sidebarOptions.map((option) => (
                            <button key={option.id} id={option.id} name={`Option-${option.id}`} className={` ${"Option-" + String(option.id) === activeButton ? "bg-gray-100 border-l-3 border-l-green-500 outline-none" : "bg-white border-none outline-none"} flex items-center outline-none gap-x-2 py-3 hover:bg-gray-100 transition-all cursor-pointer text-sm font-medium flex-row w-full p-2 px-3`}>
                                {
                                    option.icon
                                }
                                {
                                    option.text
                                }
                            </button>
                        ))
                    }
                </div>
            </div>
            <div className='bg-gray-100 p-2'>
                <Link to={"/"} className='text-gray-700 gap-x-2 flex flex-row items-center bg-gray-100'>
                    <BiArrowBack size={14} color='gray' /> <span>Back to Dashboard</span>
                </Link>
            </div>
        </div>
    )
}

export default SettingSideBar