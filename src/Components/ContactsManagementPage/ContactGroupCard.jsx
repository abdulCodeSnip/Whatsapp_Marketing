import React, { useState } from 'react'
import { BiStar } from 'react-icons/bi';
import { CiStar } from 'react-icons/ci';
import { PiPlus } from 'react-icons/pi'
import { RiGroup2Line, RiGroupLine } from 'react-icons/ri';
import { TiUserOutline } from 'react-icons/ti'
import { useSelector } from 'react-redux';

const ContactGroupCard = () => {
     const [isButtonActive, setIsButtonActive] = useState(true);

     const allContacts = useSelector((state) => state?.allContacts.allContacts);
     console.log(allContacts);
     // React TOASTIFY
     return (
          <></>
     )
}

export default ContactGroupCard;
