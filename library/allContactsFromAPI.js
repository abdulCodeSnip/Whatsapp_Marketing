const authInformation = {
    baseURL: "http://localhost:3000",
    token: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMsImVtYWlsIjoiaGFtemFAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzUzMzM2OTA5LCJleHAiOjE3NTM0MjMzMDl9._O2iGcLmDdvVplopI64yJU7h_IoUbPY5JzYCxL4Z3e0"
}

export const allContactsFromAPI = async () => {
    try {
        const apiResponse = await fetch(`${authInformation?.baseURL}/users`, {
            method: "GET",
            headers: {
                "Authorization": authInformation?.token
            }
        });

        const result = await apiResponse.json();
        return result?.users;
    } catch (error) {
        console.log(error);
    }
}