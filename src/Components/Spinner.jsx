import React from 'react'

const Spinner = ({ size }) => {
    let widthAndHeightOfSpinner = "";
    switch (size?.toLowerCase()) {
        case "small":
            widthAndHeightOfSpinner = "w-6 h-6 border-[2px]";
            break;
        case "medium":
            widthAndHeightOfSpinner = "w-8 h-8 border-[2px]";
            break;
        case "large":
            widthAndHeightOfSpinner = "w-10 h-10 border-[3px]";
            break;
        case "extra-large":
            widthAndHeightOfSpinner = "w-12 h-12 border-[4px]";
            break;
        case "insane":
            widthAndHeightOfSpinner = "w-16 h-16 border-[6px]";
            break;
        default:
            widthAndHeightOfSpinner = "w-8 h-8 border-[3px]";
            break;
    }
    return (
        <div className={`${widthAndHeightOfSpinner} border-gray-200 border-t-green-500 rounded-full animate-spin`}></div>
    )
}

export default Spinner