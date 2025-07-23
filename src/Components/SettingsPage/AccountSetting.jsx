import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import CustomToggle from "../SendNewMessage/CustomToggle";
import { useNavigate, useNavigation } from 'react-router-dom';

const AccountSetting = () => {

    const user = useSelector((state) => state?.loginUser?.userLogin);
    const [checked, setChecked] = useState([]);
    const navigate = useNavigate();
    console.log(user);

    return (
        <div className=' w-full overflow-y-auto h-[100%] px-10'>
            <div className='bg-white rounded-xl divide-y divide-gray-200'>
                <div className='p-6'>
                    {/* Header */}
                    <div>
                        <h2 className='text-gray-900 text-xl font-medium'>
                            Account Settings
                        </h2>
                        <span className='text-gray-500 text-sm'>Manage WhatsApp information and account</span>
                    </div>

                </div>
                {/* User Information such as Phone Number Email and address */}
                <div className='p-6 flex flex-row gap-x-5'>
                    <div className='flex flex-row items-center justify-center w-[20%] h-[100%]'>
                        <h2 className='w-[100px] h-[100px] items-center justify-center flex text-xl font-medium rounded-full bg-gray-300'>
                            {user?.first_name.charAt(0).toUpperCase() + " " + user?.last_name?.charAt(0).toUpperCase()}
                        </h2>
                    </div>
                    <div className='w-full grid xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-1 gap-x-5 space-y-4'>
                        <div className='space-y-1'>
                            <label htmlFor="first_name" className='block text-gray-700 font-medium text-sm'>First Name</label>
                            <input type="text" id='first_name' value={user?.first_name} placeholder="First Name" className='w-full rounded-lg outline-green-500 border border-gray-200 px-3 py-2' />
                        </div>
                        <div className='space-y-1'>
                            <label htmlFor="last_name" className='block text-gray-700 font-medium text-sm'>Last Name</label>
                            <input type="text" id='last_name' value={user?.last_name} placeholder='Last Name' className='w-full rounded-lg outline-green-500 border border-gray-200 px-3 py-2' />
                        </div>
                        <div className='space-y-1'>
                            <label htmlFor="phone" className='block text-gray-700 font-medium text-sm'>Phone Number</label>
                            <input type="text" id='phone' value={user?.phone} placeholder='Phone Number' className='w-full rounded-lg outline-green-500 border border-gray-200 px-3 py-2' />
                        </div>
                        <div className='space-y-1'>
                            <label htmlFor="email" className='block text-gray-700 font-medium text-sm'>Email Address</label>
                            <input type="text" id='email' value={user?.email} placeholder='Last Name' className='w-full rounded-lg outline-green-500 border border-gray-200 px-3 py-2' />
                        </div>
                    </div>
                </div>

                {/* Password and other credintials */}
                <div className='p-6'>
                    <div className='flex flex-col space-y-5'>
                        <h2 className='text-lg font-medium text-gray-900'>
                            Password
                        </h2>

                        <div className='space-y-2'>
                            <label htmlFor="currentPassword" className='text-gray-700 block font-medium text-sm'>Current Password</label>
                            <input type="text" id='currentPassword' placeholder='Current Password' className='border border-gray-200 rounded-lg outline-green-500 px-3 py-2 w-1/2' />
                        </div>

                        <div className='flex flex-row w-full gap-x-5'>
                            <div className='w-full'>
                                <label htmlFor="newPassword" className='text-gray-700 block font-medium text-sm'>New Password</label>
                                <input type="text" id='newPassword' placeholder='New Password' className='border border-gray-200 rounded-lg outline-green-500 px-3 py-2 w-full' />
                            </div>
                            <div className='w-full'>
                                <label htmlFor="confirmPassword" className='text-gray-700 block font-medium text-sm'>New Password</label>
                                <input type="text" id='confirmPassword' placeholder='Confirm Password' className='border border-gray-200 rounded-lg outline-green-500 px-3 py-2 w-full' />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Account Preferences */}
                <div className='flex flex-col p-6'>
                    <div>
                        <h2 className='text-gray-900 font-medium text-lg'>Account Preferences</h2>
                    </div>
                    <div className='space-y-1 p-2 flex flex-row items-center justify-between'>
                        <div>
                            <h2 className='text-gray-800 text-base font-medium'>Time Zone</h2>
                            <span className='text-gray-500 text-sm'>Set your local time zone for accurate scheduling</span>
                        </div>
                        <div>
                            <select name="timePicker" id="timePicker" className='px-3 py-2 text-sm outline-green-500 rounded-xl border border-gray-200'>
                                <option value="pacific_time">(UTC-08:00)Pacific Time (US & Canada)</option>
                                <option value="eastern_time">(UTC-05:00)Eastern Time (US & Canada)</option>
                                <option value="greenwich_time">(UTC+00:00)Greenwich Mean Time</option>
                                <option value="centralEurope_time">(UTC+01:00)Central Europe Time</option>
                                <option value="chinaStandard_time">(UTC+8:00)China Standard Time</option>
                            </select>
                        </div>
                    </div>
                    <div className='space-y-1 p-2 flex flex-row items-center justify-between'>
                        <div>
                            <h2 className='text-gray-800 text-base font-medium'>Date Format</h2>
                            <span className='text-gray-500 text-sm'>Choose how dates are displayed throughout the app</span>
                        </div>
                        <div>
                            <select name="datePicker" id="datePicker" className='px-3 py-2 text-sm outline-green-500 rounded-xl border border-gray-200'>
                                <option value="mm-dd-yy">MM/DD/YYYY (06/23/2025)</option>
                                <option value="dd-mm-yy">DD/MM/YYYY (23/06/2025)</option>
                                <option value="yy-mm-dd">YYYY/MM/DD (2025/06/23)</option>
                            </select>
                        </div>
                    </div>
                    <div className='space-y-1 p-2 flex flex-row items-center justify-between'>
                        <div>
                            <h2 className='text-gray-800 text-base font-medium'>Two-Factor Authentication</h2>
                            <span className='text-gray-500 text-sm'>Add an extra layer of security to your account</span>
                        </div>
                        <div>
                            <CustomToggle checked={checked} setChecked={() => setChecked(!checked)} />
                        </div>
                    </div>
                    <div className="flex flex-row items-center justify-end gap-x-3">
                        <button onClick={() => navigate("/")} className="flex flex-row items-center cursor-pointer  text-gray-600 font-medium text-sm justify-center bg-gray-100 px-4 py-2 border border-gray-200 shadow-sm rounded-lg">
                            Cancel
                        </button>
                        <button
                            className="flex flex-row items-center  cursor-pointer justify-center rounded-lg font-medium text-sm bg-green-500 text-white px-4 py-2 border border-gray-200 shadow-sm">
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AccountSetting