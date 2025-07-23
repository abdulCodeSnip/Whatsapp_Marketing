import React, { useRef, useState } from 'react'
import { BiCloudUpload } from 'react-icons/bi'
import { FaRegFileExcel } from 'react-icons/fa';
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { MdDelete } from 'react-icons/md';
import { RiDeleteBin7Line } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import { allImportedContacts } from '../../redux/contactsPage/importContacts';
import { addingSelectedFile } from '../../redux/importContactsCSV/importCSV';

const UploadContactFile = ({ moveToNextSequence }) => {

    const [fileType, setFileType] = useState(null);
    const [fileName, setFileName] = useState("");
    const [fileData, setFileData] = useState([]);


    // values from Redux
    const importedContacts = useSelector((state) => state.importedContacts?.importedContacts);
    const selectedFile = useSelector((state) => state?.selectedFile?.file);
    const dispatch = useDispatch();

    let importContactRef = useRef(null);

    const handleImportContacts = () => {
        importContactRef.current.click();
    }

    // Handle a file and read the data from that file
    const handleFileType = (event) => {
        dispatch(addingSelectedFile(event.target.files));
        const file = event.target.files[0];
        if (!file) return;
        const name = file?.name;
        const fileExtension = name.split(".").pop().toLowerCase();

        setFileName(name);
        setFileType(fileExtension);

        if (fileExtension === "csv") {
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: (result) => {
                    setFileData(result.data);
                    dispatch(allImportedContacts(result?.data));
                }
            });
        } else if (fileExtension === "xlsx" || fileExtension === "xls") {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: "array" });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);
                setFileData(jsonData);
                dispatch(allImportedContacts(jsonData));
            };
            reader.readAsArrayBuffer(file);
        } else {
            alert("Unsupported file format");
        }
    }

    return (
        <>
            {
                fileType ? (
                    <div className='flex flex-row items-center justify-between p-5 rounded-xl shadow-sm bg-white'>

                        {/* File name with extension */}
                        <div>
                            <div className='flex flex-row items-center gap-x-1'>
                                <div className='p-2 rounded-xl bg-green-100 text-green-600'>
                                    <FaRegFileExcel size={20} />
                                </div>
                                <div className='flex flex-col items-start justify-start'>
                                    <span className='text-gray-800 font-medium text-sm'>{fileName}</span>
                                    <span className='text-gray-500 text-xs'>{fileData?.length} records</span>
                                </div>
                            </div>
                        </div>

                        {/* Remove File or Contine to next page */}
                        <div className='flex flex-row items-center justify-center gap-4'>
                            <button
                                onClick={() => {
                                    setFileData([]);
                                    setFileType(null);
                                    importContactRef = null;
                                }}
                                className='text-gray-800 p-2 rounded-full hover:bg-gray-100 cursor-pointer'>
                                <RiDeleteBin7Line size={18} />
                            </button>
                            <button
                                onClick={moveToNextSequence}
                                className='text-white bg-green-500 px-4 py-2 hover:opacity-90 cursor-pointer rounded-lg text-xs tracking-wide font-medium'>
                                Continue
                            </button>
                        </div>
                    </div>
                ) :
                    (
                        <div className='flex w-full flex-col gap-5 bg-white shadow-sm p-5 rounded-xl'>
                            <h2 className='text-lg font-medium text-gray-800'>
                                Upload Contact File
                            </h2>

                            {/* Button to pick contact file */}
                            <button onClick={handleImportContacts} className='w-full p-4 outline-green-500 rounded-xl cursor-pointer gap-5 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center'>
                                <div className='text-green-500 bg-green-100 p-4 rounded-full flex items-center justify-center'>
                                    <BiCloudUpload size={30} />
                                </div>
                                <div className='text-gray-800 text-[15px]'>
                                    <span className='block mb-2'>Drag and drop your files or</span>
                                    <button className='text-gray-100 bg-green-500 font-medium px-4 py-2 shadow-sm shadow-gray-400 rounded-lg'>Browse Files</button>
                                </div>
                                <div className='text-gray-500 text-xs'>
                                    <p>Supported formats: CSV, Excel(.xlsx, .xls)</p>
                                    <p>Maximum file size: 10MB</p>
                                </div>
                                <input type={"file"} accept={".csv"} onChange={handleFileType} ref={importContactRef} className='hidden' />
                            </button>
                        </div>
                    )
            }
        </>
    )
}

export default UploadContactFile