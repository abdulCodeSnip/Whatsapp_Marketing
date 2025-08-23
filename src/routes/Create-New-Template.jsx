import { Link } from 'react-router-dom';
import { BiLeftArrowAlt } from 'react-icons/bi';
import SideBar from '../Components/SideBar';
import TemplatesInformationCard from '../Components/CreateNewTemplatePage/TemplatesInformationCard';
import MessageInformationCard from '../Components/CreateNewTemplatePage/MessageInformationCard';
import VariableManagementCard from '../Components/CreateNewTemplatePage/VariableManagementCard';
import WhatsappPolicyCard from '../Components/CreateNewTemplatePage/WhatsappPolicyCard';
import MessagePreviewCard from '../Components/CreateNewTemplatePage/MessagePreviewCard';
import Header from '../Components/CreateNewTemplatePage/Header';
import Hamburger from '../Components/CreateNewTemplatePage/Hamburger';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import useCreateNewTemplate from '../hooks/createNewTemplateHooks/useCreateNewTemplate';


const CreateNewTemplate = () => {

     const [isAllFieldsValid, setIsAllFieldsValid] = useState(false);

     // Values from Redux
     const language = useSelector((state) => state.language.value);
     const category = useSelector((state) => state.category.value);
     const templateName = useSelector((state) => state.templateName.value);
     const variables = useSelector((state) => state?.addVariables?.variables);
     const messageBody = useSelector((state) => state.messageBody.value);

     const formatVariables = (rawVars) => {
          return rawVars.map(v => ({
               name: v.variableName || v.name || "variable_name",
               default_value: v.variableDefaultValue,
               is_required: true
          }));
     };


     const validateAllFields = () => {
          if (category === "" || templateName === "" || category === "" || language === "") {
               setIsAllFieldsValid(false);
          } else {
               setIsAllFieldsValid(true);
          }
     }

     useEffect(() => {
          validateAllFields();
     }, [templateName, category, language, variables])

     const templateBody = {
          name: templateName,
          language: language,
          category_id: parseInt("1"),
          message: messageBody,
          variables: formatVariables(variables),
          is_active: true
     }

     return (
          <>

               <div className='flex h-screen overflow-hidden'>
                    {/* Sidebar at left side */}
                    <SideBar />

                    {/* Main content with a header, and also with main content */}
                    <div className='flex flex-1 flex-col h-screen overflow-hidden'>
                         <Header />

                         {/* Main Content to be shown on the screen */}
                         <main className='flex-1 p-6 bg-gray-50 overflow-y-auto'>

                              {/* Main Content */}
                              <div className='max-w-7xl mx-auto'>
                                   <Hamburger firstLink={"Dashboard"} secondLink={"Templates"} thirdLink={"Create New Template"} />

                                   {/* Useful message for Admin */}
                                   <div className='flex flex-row items-center justify-between my-5 gap-x-3'>
                                        <div>
                                             <h2 className='font-bold text-2xl text-gray-900'>Create New Template</h2>
                                             <p className='text-gray-600 text-sm my-1'>Create a reusable template for your WhatsApp campaigns or automated messages.</p>
                                        </div>

                                        {/* Back to Dashboard Button */}
                                        <Link to={"/"} className='flex items-center justify-center px-4 py-2 space-x-2 border border-gray-300 rounded-md shadow-sm font-medium text-sm whitespace-nowrap transition-all text-gray-700 hover:bg-gray-50 bg-white'>
                                             <BiLeftArrowAlt size={20} />
                                             <span>Back to Dashboard</span>
                                        </Link>
                                   </div>

                                   {/* Table for Creating Templates, with some text and different languages */}
                                   <div className='flex justify-between xl:flex-row lg:flex-col md:flex-col flex-col w-[100%] gap-x-5'>

                                        <div className='flex flex-col space-y-6 w-full'>

                                             {/* Template Information Card */}
                                             <TemplatesInformationCard />

                                             {/* Message Information Card */}
                                             <MessageInformationCard />

                                             {/* Variable Management Card */}
                                             <VariableManagementCard />

                                             {/* Whatsapp Policy Card */}
                                             <WhatsappPolicyCard />
                                        </div>

                                        {/* Message Preview Card */}
                                        <div className='w-full'>
                                             <MessagePreviewCard
                                                  isAllFieldsValid={isAllFieldsValid}
                                                  templateBody={templateBody} />
                                        </div>
                                   </div>
                              </div>
                         </main>
                    </div>
               </div>
          </>
     )
}

export default CreateNewTemplate
