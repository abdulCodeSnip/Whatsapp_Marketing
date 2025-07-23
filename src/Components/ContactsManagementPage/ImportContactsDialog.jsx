import React, { useEffect, useRef, useState } from 'react'
import { BiDownload, BiUpload } from 'react-icons/bi'
import { CgClose } from 'react-icons/cg'
import { HiDownload } from 'react-icons/hi';
import Papa from "papaparse";

const ImportContactsDialog = ({ closeDialog, contactsImported }) => {

     const [fileType, setFileType] = useState(null);
     const [fileURL, setFileURL] = useState("");

     const csvReference = useRef(null);

     const [csvData, setCsvData] = useState([]);

     const handleImportContacts = () => {
          csvReference.current.click();
     }

     const handleFileType = (event) => {
          const file = event.target.files[0];
          if (file) {
               const url = URL.createObjectURL(file);
               setFileURL(url);
               setFileType(file.type);
               Papa.parse(file, {
                    header: true,
                    skipEmptyLines: true,
                    skipFirstNLines: false,
                    complete: (result) => {
                         setCsvData(result.data);
                    }
               })
          }
     }


     return (
          <>
               <div className='bg-white rounded-xl shadow-sm divide-y divide-gray-300'>
                    <div className='flex flex-row items-center justify-between p-5'>
                         <div>
                              <h2 className='text-lg font-medium text-gray-800'>Import Contacts form CSV</h2>
                         </div>
                         <div onClick={closeDialog} className='text-sm font-medium text-gray-600 cursor-pointer p-2 rounded-full hover:bg-gray-100 hover:text-gray-700 transition-all'>
                              <CgClose size={18} />
                         </div>
                    </div>
                    <div className='p-5'>
                         <div>
                              <span className='text-gray-500 text-sm text-center'>Upload a CSV file with your contacts. The file should include name and phone number columns at minimum</span>
                         </div>
                         <div className='p-4 rounded-lg border-2 border-gray-300 border-dashed mt-2'>
                              {
                                   fileType && csvData?.length > 0 ? (
                                        <div className='overflow-y-auto overflow-x-hidden'>
                                             <table className='w-full p-2'>
                                                  <thead className='bg-gray-100'>
                                                       <tr className='text-gray-500 font-normal text-sm px-3 py-2'>
                                                            <th className='font-normal text-left px-3 py-2 text-gray-800 uppercase tracking-wide whitespace-nowrap'>Name</th>
                                                            <th className='font-normal text-left px-3 py-2 text-gray-800 uppercase tracking-wide whitespace-nowrap'>Phone No</th>
                                                            <th className='font-normal text-left px-3 py-2 text-gray-800 uppercase tracking-wide whitespace-nowrap'>Email</th>
                                                       </tr>
                                                  </thead>
                                                  <tbody>
                                                       {
                                                            csvData.map((data, index) => (
                                                                 <tr key={index}>
                                                                      <td className='text-sm font-normal px-3 py-2 text-nowrap text-gray-500 tracking-wide'>{data.Name}</td>
                                                                      <td className='text-sm font-normal px-3 py-2 text-nowrap text-gray-500 tracking-wide'>{data.Phone}</td>
                                                                      <td className='text-sm font-normal px-3 py-2 text-nowrap text-gray-500 tracking-wide'>{data.Email}</td>
                                                                 </tr>
                                                            ))
                                                       }
                                                  </tbody>
                                             </table>
                                        </div>
                                   ) :
                                        <div className="flex flex-col items-center justify-center space-y-2">
                                             <div className='p-3 rounded-full bg-gray-100 text-gray-600 flex flex-col items-center justify-center'>
                                                  <BiUpload size={22} />
                                             </div>

                                             <div className='text-gray-500 font-medium flex flex-col items-center justify-center space-y-3'>
                                                  <div className='flex flex-col items-center justify-center'>
                                                       <h2 className='text-gray-800 text-sm'>Drag and drop your CSV file </h2>
                                                       <span>or</span>
                                                  </div>
                                                  <button onClick={handleImportContacts} className='text-gray-600 px-3 py-2 rounded-lg shadow-md flex items-center justify-center bg-gray-50 border cursor-pointer hover:bg-white transition-all border-gray-500'>
                                                       <input type={"file"} accept={".csv"} onChange={handleFileType} ref={csvReference} className='hidden' />
                                                       Browse Files
                                                  </button>
                                                  <span className='text-gray-500 font-normal text-sm'>Maximumn 5000 contacts per import</span>
                                             </div>
                                        </div>
                              }
                         </div>

                         <div className='my-5'>
                              <h2 className='text-gray-700 font-medium text-sm'>CSV Format Requirements</h2>
                              <div className='text-gray-500 text-xs my-2 space-y-[2px]'>
                                   <li>First row should contain column headers</li>
                                   <li>Required columns: Name, Phone Number</li>
                                   <li>Optional columns: Email, Tags, Group, Notes</li>
                                   <li>Phone numbers should include country code</li>
                              </div>
                              <button
                                   className='text-sm text-green-500 flex flex-row items-center justify-center cursor-pointer px-2 py-1 space-x-1'>
                                   <HiDownload size={15} />
                                   <span>Download CSV Template</span>
                              </button>
                         </div>

                         <div className='flex flex-row items-end justify-end space-x-3'>
                              <div>
                                   <button className='text-gray-500 rounded-lg border border-gray-300 shadow-sm px-3 py-2 cursor-pointer font-medium'>
                                        Cancel
                                   </button>
                              </div>
                              <div>
                                   <button
                                        onClick={() => {
                                             closeDialog();
                                             contactsImported();
                                        }}
                                        disabled={csvData.length <= 0}
                                        className='text-white outline-green-500 rounded-lg shadow-sm px-3 py-2 bg-green-500 disabled:opacity-80 disabled:cursor-auto cursor-pointer'>
                                        <span>
                                             Import Contacts
                                        </span>
                                   </button>
                              </div>
                         </div>
                    </div>
               </div>
          </>
     )
}

export default ImportContactsDialog
