import React, { useState } from 'react'
import UploadContactFile from './UploadContactFile';
import MapContactFields from './MapContactFields';
import PreviewMapData from './PreviewMapData';
import StartImportingContacts from './StartImportingContacts';
import { redirect, useNavigate, useNavigation } from 'react-router-dom';
import { BsExclamation, BsExclamationCircle } from 'react-icons/bs';

const ImportContactsSequence = () => {
    const [currentIndex, setCurrentIndex] = useState(1);
    const [showCancelImportDialog, setShowCancelImportDialog] = useState(false);
    const navigate = useNavigate();
    const sequence =
        [
            {
                id: "1",
                value: 1,
                optionText: "Upload File",
                dynamicJSXElement: <UploadContactFile moveToNextSequence={() => setCurrentIndex(currentIndex + 1)} />,
            },
            {
                id: "2",
                value: 2,
                optionText: "Map Fields",
                dynamicJSXElement: <MapContactFields moveForward={() => setCurrentIndex(currentIndex + 1)} moveBackward={() => setCurrentIndex(currentIndex - 1)} />,
            },
            {
                id: "3",
                value: 3,
                optionText: "Preview",
                dynamicJSXElement: <PreviewMapData moveForward={() => setCurrentIndex(currentIndex + 1)} moveBackward={() => setCurrentIndex(currentIndex - 1)} />,
            },
            {
                id: "4",
                value: 4,
                optionText: "Import",
                dynamicJSXElement: <StartImportingContacts cancelImport={() => setShowCancelImportDialog(true)} finishImport={() => navigate("/")} />,
            }
        ];

    return (
        <>
            <div>
                <div className='flex flex-row w-full items-center justify-between mx-auto p-10'>
                    {
                        sequence.map(seq => (
                            <div key={seq.id} className={`w-full font-medium text-sm p-2 rounded-full flex items-center justify-center gap-x-3`}>
                                {/* For every field of sequence */}
                                <div className='flex flex-col items-center justify-center gap-2'>
                                    <div className={`flex flex-row text-xl  ${seq.value === currentIndex || seq.value < currentIndex ? "bg-green-500 text-white" : "bg-gray-200 text-gray-400"} w-[40px] h-[40px] items-center justify-center rounded-full`}>
                                        <h2>{seq.value}</h2>
                                    </div>
                                    <div className={`flex flex-row ${seq.value === currentIndex ? "text-gray-800" : "text-gray-500"}`}>
                                        <h2>{seq.optionText}</h2>
                                    </div>
                                </div>
                                <div className={`border-3 rounded-full ${seq.value < currentIndex ? "border-green-500" : "border-gray-200"} w-[62%] shrink ${seq.value === sequence.length && "border-none"}`}>
                                </div>
                            </div>
                        ))
                    }
                </div>
                {
                    currentIndex > 0 && (
                        sequence[currentIndex - 1].dynamicJSXElement
                    )
                }
            </div>

            {
                showCancelImportDialog && (
                    <>
                        <div className='fixed z-40 inset-0 bg-black/40 h-screen w-screen'>
                        </div>
                        <div className='fixed z-50 h-auto w-auto top-60 xl:right-96 lg:right-60 md:right-40 sm:right-20 xs:right-20 rounded-xl bg-white shadow-sm'>

                            <div className="flex flex-col items-center divide-y divide-gray-300">
                                <div className="flex flex-row items-start gap-2 py-10 px-5">
                                    <div className='p-3 rounded-full bg-red-100 text-red-600'>
                                        <BsExclamationCircle size={20} />
                                    </div>
                                    <div>
                                        <h2 className='text-gray-900 font-medium'>Cancel Import</h2>
                                        <span className='text-gray-500 text-sm '>Are you sure you want to cancel import? All progress will be lost!</span>
                                    </div>
                                </div>

                                <div className='flex flex-row items-end justify-end py-3 px-2 gap-2 bg-gray-100 w-full rounded-b-xl'>
                                    <button onClick={() => setShowCancelImportDialog(false)} className="flex items-center justify-center text-sm font-medium rounded-lg border border-gray-500 px-4 py-2 bg-white cursor-pointer text-gray-900">
                                        Continue Import
                                    </button>
                                    <button onClick={() => {
                                        setShowCancelImportDialog(true);
                                        navigate("/")
                                    }} className="flex items-center font-medium text-sm rounded-lg  justify-center px-4 py-2 bg-red-600 text-white cursor-pointer">
                                        Cancel Import
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )
            }
        </>
    )
}

export default ImportContactsSequence