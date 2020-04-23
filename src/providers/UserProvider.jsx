import React, { createContext, useEffect, useState } from 'react';
import { auth, signInWithGoogle } from '../firebase';

export const UserContext = createContext({ user: null });

const UserProvider = (props) => {
    const [user, setUser] = useState(null)
    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (user) {
                setUser(user);
            } else {
                signInWithGoogle();
            }
        });
    }, []);

    return (
        <UserContext.Provider value={user}>
            {props.children}
        </UserContext.Provider>
    );
};

export default UserProvider;