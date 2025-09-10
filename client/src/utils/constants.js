export const HOST = import.meta.env.VITE_SERVER_URL;

export const Auth_Route = "api/auth";
export const SIGNUP_ROUTE = `${Auth_Route}/signup`;
export const LOGIN_ROUTE = `${Auth_Route}/login`;
export const GET_USER_INFO = `${Auth_Route}/user-info`;
export const UPDATE_PROFILE_ROUTE = `${Auth_Route}/update-profile`;
export const ADD_PROFILE_IMAGE_ROUTE = `${Auth_Route}/add-profile-image`;
export const REMOVE_PROFILE_IMAGE_ROUTE = `${Auth_Route}/remove-profile-image`;
export const LOGOUT_ROUTE = `${Auth_Route}/LOGOUT`;

export const CONTACT_ROUTE = 'api/contacts';
export const SEARCH_CONTACTS_ROUTE = `${CONTACT_ROUTE}/search`;
export const GET_DM_CONTACTS_ROUTE = `${CONTACT_ROUTE}/get-contacts-for-dm`;
export const GET_ALL_CONTACTS_ROUTE = `${CONTACT_ROUTE}/get-all-contacts`;

export const MESSAGES_ROUTE = "api/messages";
export const GET_ALL_MESSAGES_ROUTE = `${MESSAGES_ROUTE}/get-messages`;
export const UPLOAD_FILE_ROUTE = `${MESSAGES_ROUTE}/upload-file`; 

export const CHANNEL_ROUTE = 'api/channel';
export const CREATE_CHANNEL_ROUTE = `${CHANNEL_ROUTE}/create-channel`;
export const GET_USER_CHANNELS_ROUTE = `${CHANNEL_ROUTE}/get-user-channels`;
export const GET_CHANNEL_MESSAGES_ROUTE = `${CHANNEL_ROUTE}/get-channel-messsages`;