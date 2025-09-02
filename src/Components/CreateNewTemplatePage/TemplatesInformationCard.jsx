import { useDispatch, useSelector } from 'react-redux';
import { onChangeLanguage } from '../../redux/templatePage/languageSlice';
import { onChangeCategory } from '../../redux/templatePage/categorySlice';
import { onChangeTemplateName } from '../../redux/templatePage/templateNameSlice';
import { onChangeMessageBody } from '../../redux/templatePage/messageSlice';

const TemplatesInformationCard = ({ categories }) => {

     // Values from REDUX
     const language = useSelector((state) => state.language.value);
     const category = useSelector((state) => state.category.value);
     const templateName = useSelector((state) => state.templateName.value);
     const templateMessageBody = useSelector((state) => state.messageBody.value);

     const dispatch = useDispatch();

     const handleTemplateLanguage = (e) => {
          dispatch(onChangeLanguage(e?.target?.value));
     }

     const handleTemplateCategory = (e) => {
          dispatch(onChangeCategory(e?.target?.value));
     }

     const handleTemplateName = (e) => {
          dispatch(onChangeTemplateName(e?.target?.value));
     }

     const handleMessageBody = (e) => {
          dispatch(onChangeMessageBody(e?.target?.value));
     }

     return (
          <div className='bg-white rounded-xl divide-y shadow-sm divide-gray-200 flex flex-col w-full gap-3'>
               <div className='px-4 py-3'>
                    <h2 className='text-lg font-semibold'>Template Information</h2>
               </div>
               <div className='p-4'>
                    <div>
                         <label htmlFor="templateName" className='text-gray-800 font-medium p-2 block mb-1'>
                              Template Name
                              <span className='text-red-600 px-1'>*</span>
                         </label>
                         <input
                              type="text"
                              value={templateName}
                              onChange={handleTemplateName}
                              id="templateName"
                              name="templateName"
                              className='w-full px-3 py-2 rounded-xl border-gray-200 border-[1.5px]'
                              autoCapitalize="words"
                              placeholder='Enter a name for your template' />

                         <p className='text-gray-500 text-sm m-1'>This name is for your reference only and won't be visible to recipients.</p>
                    </div>

                    <div className='flex flex-row justify-between gap-x-5 my-5'>
                         <div className='flex flex-col'>
                              <label htmlFor="templateCategory" className='text-gray-700 block font-medium m-1' >
                                   Category
                                   <span className='text-red-600 px-1'>*</span>
                              </label>
                              <select
                                   name="templateCategory"
                                   id="templateCategory"
                                   className='p-2 rounded-xl border-1 border-gray-300 shadow-sm'
                                   onChange={handleTemplateCategory}
                                   value={category}
                              >
                                   <option value="">Select a Category</option>
                                   {
                                        categories?.categories?.map(templateCategory => {
                                             return (
                                                  <option key={templateCategory?.id} value={templateCategory?.id}>
                                                       {
                                                            templateCategory?.name
                                                       }
                                                  </option>
                                             )
                                        })
                                   }
                              </select>
                         </div>

                         <div className='flex flex-col'>
                              <label htmlFor="templateLanguage" className='text-gray-700 block font-medium m-1' >
                                   Language
                                   <span className='text-red-600 px-1'>*</span>
                              </label>
                              <select
                                   name="templateLanguage"
                                   id="templateLanguage"
                                   onChange={handleTemplateLanguage}
                                   value={language}
                                   className='p-2 rounded-xl border-1 border-gray-300 shadow-sm'>
                                   <option value="">Select a Language </option>
                                   <option value="en-UK">English (UK)</option>
                                   <option value="en-US">English (US)</option>
                                   <option value="german">German</option>
                                   <option value="french">French</option>
                                   <option value="hindi">Hindi</option>
                                   <option value="urdu">Urdu</option>
                                   <option value="arabic">Arabic</option>
                              </select>
                         </div>

                    </div>

                    <div className='my-2 flex flex-row justify-between'>
                         <div>
                              <h2 className='text-gray-700 font-medium'>Template Status</h2>
                              <p className='text-gray-500 text-sm my-1'>Active templates can be used in campaigns and automations</p>
                         </div>
                         <div>
                              <label className="inline-flex items-center cursor-pointer">
                                   <input type="checkbox" value="" className="sr-only peer" />
                                   <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none  rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600 dark:peer-checked:bg-green-600"></div>
                              </label>
                         </div>

                    </div>
               </div>
          </div>
     )
}

export default TemplatesInformationCard
