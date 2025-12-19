// in src/authProvider.ts
import { AuthProvider } from "react-admin";

export const authProvider: AuthProvider = {
    // called when the user attempts to log in
    login: ({username,password}) => {
        // const request = new Request('http://localhost:3005/api/admin/admins/authenticate', {
        const request = new Request('/api/admin/admins/authenticate', {            
            method: 'POST',
            body: JSON.stringify({ email:username, password }),
            headers: new Headers({ 'Content-Type': 'application/json' }),
        });
        // accept all username/password combinations
        //return Promise.resolve();
        return fetch(request)
            .then(response => {
                return response.json();
            })
            .then((response)=>{
                if (response.status < 200 || response.status >= 300) {
                    throw new Error(response.message);
                } 
                localStorage.setItem('username', JSON.stringify(response.data.name));
                localStorage.setItem('auth', JSON.stringify(response.auth));
            })
            .catch((errorMsg) => {
                throw new Error(errorMsg)
            });
    },
    // called when the user clicks on the logout button
    logout: () => {
        localStorage.removeItem("username");
        return Promise.resolve();
    },
    // called when the API returns an error
    checkError: ({ status }: { status: number }) => {
        if (status === 401 || status === 403) {
            localStorage.removeItem("username");
            return Promise.reject();
        }
        return Promise.resolve();
    },
    // called when the user navigates to a new location, to check for authentication
    checkAuth: () => {
        return localStorage.getItem("username")
            ? Promise.resolve()
            : Promise.reject();
    },
    // called when the user navigates to a new location, to check for permissions / roles
    getPermissions: () => Promise.resolve(),
};