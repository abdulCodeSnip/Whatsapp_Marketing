import React from 'react'
import { useSelector } from 'react-redux';

const MapContactFields = ({ moveForward, moveBackward }) => {


    const mapToField = ["First Name", "Last Name", "Phone Number *", "Email", "Company", "Country"]
    const tableViewData =
        [
            {
                id: 0,
                sourceColumn: "First Name",
                mapToField: mapToField
            },
            {
                id: 1,
                sourceColumn: "Last Name",
                mapToField: mapToField
            },
            {
                id: 2,
                sourceColumn: "Phone Number *",
                mapToField: mapToField
            },
            {
                id: 3,
                sourceColumn: "Email",
                mapToField: mapToField,
            },
            {
                id: 4,
                sourceColumn: "Company",
                mapToField: mapToField,
            },
            {
                id: 5,
                sourceColumn: "Country",
                mapToField: mapToField
            }
        ]



    return (
        <div className='bg-white rounded-xl p-5 shadow-sm flex flex-col space-y-4'>
            <div className='text-gray-800 text-lg font-medium'>
                <h2>Map Contact Fields</h2>
            </div>
            <div className='text-gray-700 text-sm'>
                <span>Match the columns from your file to the appropriate contact fields in our system. Fields marked with an asterisk (*) are required.</span>
            </div>

            {/* Table to show Map Fields */}
            <div className='rounded-xl border-1 shadow-sm border-gray-300'>
                <table className='min-w-full divide-y divide-gray-300 bg-gray-100 rounded-xl'>
                    <thead>
                        <tr>
                            <th className='text-gray-600 px-6 py-4 text-left text-sm font-medium whitespace-nowrap'>Source Column</th>
                            <th className='text-gray-600 px-6 py-4 text-left text-sm font-medium whitespace-nowrap'>Map To Field</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-300'>
                        {
                            tableViewData.map((tdata) => (
                                <tr key={tdata.id} className='hover:bg-gray-100 bg-gray-50'>
                                    <td className='px-6 py-4 hover:bg-gray-100'>
                                        {tdata.sourceColumn}
                                    </td>
                                    <td className='px-6 py-2 items-center text-sm text-gray-600'>
                                        <select
                                            className='hover:bg-white rounded-lg px-2 py-1 w-full'
                                            name={`mapToField_${tdata.id}`}
                                            id={`mapToField_${tdata.id}`}>
                                            <option value={`${tdata.mapToField.at(tdata.id)}`}>
                                                {tdata.mapToField[tdata.id]}
                                            </option>
                                            {
                                                tdata?.mapToField.map(id => (
                                                    <option key={id} value={id}>
                                                        {id}
                                                    </option>
                                                ))
                                            }
                                        </select>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>

            {/* Buttons to continue or Roll Back */}
            <div className="flex flex-row items-center justify-between gap-x-5 my-2">

                {/* Go Back Button */}
                <button onClick={moveBackward} className='text-gray-600 font-medium border-gray-300 rounded-lg border shadow-sm cursor-pointer hvoer:bg-gray-50 transition-all px-4 py-2'>
                    <span>Back</span>
                </button>

                {/* Move Forward  Button */}
                <button onClick={moveForward} className='text-white bg-green-500 font-medium px-4 py-2 rounded-lg shadow-sm cursor-pointer hover:opacity-90 transition-all '>
                    <span>Preview Data</span>
                </button>
            </div>
        </div>
    )
}

export default MapContactFields