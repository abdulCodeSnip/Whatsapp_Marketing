import React, { useEffect, useState } from 'react'
import { BiCheck } from 'react-icons/bi';
import { BsExclamation } from 'react-icons/bs';
import { CgClose } from 'react-icons/cg';
import { useDispatch, useSelector } from 'react-redux';
import { changingSuccessMessage } from '../../redux/importContactsCSV/importCSV';

const StartImportingContacts = ({ cancelImport, finishImport }) => {
    const [progress, setProgress] = useState(0);

    const allImportedContacts = useSelector((state) => state?.importedContacts?.importedContacts);
    const successMessage = useSelector(state => state?.selectedFile?.messageOnComplete);
    const dispatch = useDispatch();

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(previousProgress => {
                if (previousProgress < allImportedContacts?.length) {
                    return previousProgress + 1;
                } else {
                    clearInterval(interval);
                    return previousProgress;
                }
            })
        }, 1000);
        if (progress === allImportedContacts?.length) {

        }
        return () => clearInterval(interval);
    }, [allImportedContacts?.length]);

    setTimeout(() => {
        dispatch(changingSuccessMessage(""));
    }, 400000)

    return (
        <>
            {
                successMessage && (
                    <div className='gap-3 flex flex-row items-center justify-center fixed z-30 px-4 py-3 shadow-lg top-5 right-10 rounded-3xl text-green-600 bg-green-100 text-sm'>
                        <div className='p-[1px] rounded-full border border-green-600'><BiCheck /></div>
                        <span>{successMessage}</span>
                        <button onClick={() => dispatch(changingSuccessMessage(""))} className='p-1 rounded-full hover:bg-green-200 cursor-pointer translate-all'><CgClose /></button>
                    </div>
                )
            }
            <div className='flex flex-col bg-white p-5 rounded-xl shadow shadow-gray-300 gap-5'>
                <div className='space-y-2'>
                    <h2 className='text-lg font-medium text-gray-800'>Importing Contacts</h2>
                    <span className='text-sm text-gray-500'>Please wait while we import your contacts. This may take a few minutes for large files.</span>
                </div>
                <div className='flex flex-col space-y-3'>
                    <h2 className='text-md font-medium text-gray-700'>Progress</h2>
                    <div className='bg-gray-300 rounded-full h-2 w-full space-y-2'>
                        <div className={`bg-green-400 h-2 rounded-full`} style={{ width: `${(progress / allImportedContacts?.length) * 100}%` }}>
                        </div>
                        <div className='w-full items-center justify-between flex flex-row'>
                            <span className='text-xs text-gray-500'>
                                {
                                    progress
                                } / {allImportedContacts?.length} records processed
                            </span>
                            <span className='text-sm text-gray-500'>{progress < allImportedContacts?.length ? "Estimated time: " + allImportedContacts?.length + "seconds" : "Contacts Imported"}</span>
                        </div>
                    </div>
                </div>

                {/* A hint message for user */}
                <div className="flex flex-col bg-yellow-50 p-4 my-8 rounded-xl border border-yellow-600">
                    <div className="flex flex-row text-yellow-600 gap-x-2 items-center">
                        <div className='h-[18px] w-[18px] rounded-full border border-yellow-500 flex items-center justify-center'>
                            <BsExclamation size={15} />
                        </div>
                        <h2 className='text-yellow-900 text-[16px]'>Import in progress</h2>
                    </div>
                    <div className='flex items-center px-5'>
                        <span className='text-yellow-600 text-sm'>Please keep this page open until the import is complete. You can continue to use other parts of the application in a new tab.</span>
                    </div>
                </div>

                <div className='flex flex-row items-center justify-between gap-x-3'>
                    <button
                        disabled={progress >= allImportedContacts?.length}
                        onClick={cancelImport}
                        className='text-gray-600 disabled:cursor-not-allowed font-medium px-4 py-2 rounded-lg border-gray-300 border shadow-sm cursor-pointer'>Cancel Import</button>
                    <button
                        disabled={progress < allImportedContacts?.length}
                        onClick={finishImport}
                        className='text-white shadow-sm shadow-gray-400 font-medium px-4 py-2 rounded-lg disabled:bg-gray-200 disabled:text-gray-600 cursor-pointer disabled:cursor-not-allowed bg-green-500'
                    >
                        Finish
                    </button>
                </div>
            </div>
        </>
    )
}

export default StartImportingContacts