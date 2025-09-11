import { configureStore } from "@reduxjs/toolkit";

// Templates
import inputReducer from "./templatePage/inputSlice";
import languageReducer from "./templatePage/languageSlice";
import categoryReducer from "./templatePage/categorySlice";
import templateReducer from "./templatePage/templateNameSlice";
import messageBody from "./templatePage/messageSlice";
import variables from "./templatePage/variables";
import addVariables from "./templatePage/addVariables";
import allTemplates from "./templatePage/allTemplates";

// Campaigns
import allCampaigns from "./campaignPage/allCampaigns";

// Contacts
import contactsReducer from "./contactsPage/addContacts";
import importedContacts from "./contactsPage/importContacts";
import allContacts from "./contactsPage/contactsFromAPI";
import errorMessage from "./contactsPage/errorMessage";

// Authentication such as Token, BaseURL
import auth from "./authInformation";

// Send New Message such as preview, content and selecting contacts, and also for attachments
import attachments from "./sendNewMessage/attachments";
import messageContent from "./sendNewMessage/sendMessage";
import selectedTemplate from "./sendNewMessage/selectedTemplate";

// Authenticate User
import loginUser from "./authentication/loginUser";

// Settings Page
import selectedButton from "./settingsPage/sideBarOptions";

// import selected file for importing contacts
import selectedFile from "./importContactsCSV/importCSV";

// chat history
import selectedContact from "./chatHistoryPage/selectedContactConversation";
import dynamicChats from "./chatHistoryPage/chats";
import errorOrSuccessMessage from "./sendNewMessage/errorMessage";

export const store = configureStore({
     reducer: {
          // Reducer to "inputs" for templates
          input: inputReducer,

          // Reducer to "Languages" for templates
          language: languageReducer,

          // Reducer to "Category" for templates,
          category: categoryReducer,

          // Reducer to TemplateName
          templateName: templateReducer,

          // Reducer to MessageBody of Templates 
          messageBody: messageBody,

          // Reducer to "Variables" of templates
          variables: variables,

          // Add Variables
          addVariables: addVariables,



          // Reducer to Contacts
          contacts: contactsReducer,

          // import contacts
          importedContacts: importedContacts,

          // Auth Information such as Token, and "Base URL"
          auth: auth,

          // All templates from API
          allTemplates: allTemplates,

          // All campaigns from API
          allCampaigns: allCampaigns,

          // Contacts from APIs
          allContacts: allContacts,

          // Media for selection
          allMedia: attachments,
          // message to preview data for sending new message
          messageContent: messageContent,
          // error message for fields
          errorOrSuccessMessage: errorOrSuccessMessage,
          // selected template for sending new message
          selectedTemplate: selectedTemplate,


          // login user, so, user can move to every page with a profile and integrity
          loginUser: loginUser,

          // active button of "Settings page" so we can render component accordingly

          selectedButton: selectedButton,

          // Select and Import a CSV file
          selectedFile: selectedFile,

          // Selected Contact for conversation
          selectedContact: selectedContact,

          // dynamic user chats based on the conversation
          dynamicChats: dynamicChats,

          errorMessage: errorMessage,
          
     }
})