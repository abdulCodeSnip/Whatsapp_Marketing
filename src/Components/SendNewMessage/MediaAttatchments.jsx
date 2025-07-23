import React, { useRef, useState } from 'react'
import { AiOutlineFile, AiOutlineVideoCamera } from 'react-icons/ai'
import { FiImage } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux';
import { addMedia, removeMedia } from '../../redux/sendNewMessage/attachments';
import { GrDocumentExcel } from 'react-icons/gr';
import { CgClose } from 'react-icons/cg';

const MediaAttatchments = () => {

    const [fileType, setFileType] = useState(null);
    const [fileDetail, setFileDetail] = useState(null);
    const [mediaFromStore, setMediaFromStore] = useState([]);

    // Values from Redux
    let allMedia = useSelector((state) => state?.allMedia?.selectedMedia);
    const dispatch = useDispatch();

    const imageRef = useRef(null);
    const documentRef = useRef(null);
    const videoRef = useRef(null);

    const handleDocument = (e) => {
        documentRef.current.click();
    }

    const handleImage = (e) => {
        imageRef.current.click();
    }

    const handleVideo = (e) => {
        videoRef.current.click();
    }

    const handleFileType = (e) => {
        const file = e?.target?.files[0];
        if (file) {
            setFileDetail(file);
            setFileType(file?.name?.split(".")?.at(1));
            const fileURL = URL.createObjectURL(file);
            dispatch(addMedia({ id: file?.name, name: file?.name, extension: fileType, size: file?.size, type: file?.type, url: fileURL }));
            setMediaFromStore(allMedia);
        }
    }

    // Remove an image of file from the store
    const removeImageFromStore = (payload) => {
        dispatch(removeMedia(payload));
    }


    return (
        <>
            {
                allMedia?.length > 0 && (
                    <div className='flex flex-row items-center gap-x-3 ' >
                        {
                            allMedia?.map((media, index) => {
                                const currentFileType = media?.name?.split(".")?.at(1);
                                return (
                                    <div key={index} className='relative h-[70px] w-[70px]  border-2 bg-gray-200 flex items-center justify-center rounded-xl border-gray-200'>
                                        {
                                            currentFileType?.toLowerCase() === "jpg" || currentFileType?.toLowerCase() === "jpeg" || currentFileType?.toLowerCase() === "png" ?
                                                <img
                                                    src={media?.url}
                                                    style={{ borderRadius: 12, height: 70, aspectRatio: [1, 1], width: 70, objectFit: "cover" }}
                                                    className='rounded-xl' /> :
                                                <GrDocumentExcel size={30} />
                                        }
                                        <button onClick={() => removeImageFromStore(media)} className='p-1 rounded-full bg-red-500 absolute bottom-13 left-13'>
                                            <CgClose size={15} color='white' />
                                        </button>
                                    </div>
                                )
                            })
                        }
                    </div>
                )
            }
            <div className='flex flex-col space-y-3'>

                {/* Heading */}
                <div className='font-medium text-gray-600'>
                    <h2>Attachments</h2>
                </div>

                {/* Buttons to pick, Image, Video, and Document */}
                <div className='flex flex-row gap-x-5'>

                    {/* Pick Image Button */}
                    <button onClick={handleImage} className="flex flex-row text-gray-800 cursor-pointer transition-all text-sm items-center justify-center gap-x-2 px-3 py-2 rounded-lg border-gray-300 border shadow-sm bg-white hover:bg-gray-50">
                        <FiImage />
                        <input onChange={handleFileType} accept='.png, .jpg, .jpeg, .gif' type="file" name="pickImage" id="pickImage" className='hidden' ref={imageRef} />
                        <span>Image</span>
                    </button>

                    <button onClick={handleVideo} className="flex flex-row text-gray-800 cursor-pointer transition-all text-sm items-center justify-center gap-x-2 px-3 py-2 rounded-lg border-gray-300 border shadow-sm bg-white hover:bg-gray-50">
                        <AiOutlineVideoCamera />
                        <input onChange={handleFileType} accept='.mp4, .mkv, .avi' type="file" name="pickVideo" id="pickVideo" className='hidden' ref={videoRef} />
                        <span>Video</span>
                    </button>

                    <button onClick={handleDocument} className="flex flex-row text-gray-800 cursor-pointer transition-all text-sm items-center justify-center gap-x-2 px-3 py-2 rounded-lg border-gray-300 border shadow-sm bg-white hover:bg-gray-50">
                        <AiOutlineFile />
                        <input type="file" name="pickDocument" onChange={handleFileType} id="pickDocument" className='hidden' ref={documentRef} />
                        <span>Document</span>
                    </button>
                </div>
            </div>
        </>
    )
}

export default MediaAttatchments