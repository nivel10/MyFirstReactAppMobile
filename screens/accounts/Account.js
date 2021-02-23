import React, {useState, useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Loading from '../../components/Loading';

import { getCurrentUser, isUserLogged } from '../../utils/actions';

import UserGuest from './UserGuest';
import UserLogged from './UserLogged';

export default function Account() {

    const [login, setLogin] = useState(null);

    useEffect(() => {
        /*const user = getCurrentUser();
        user ? setLogin(true) : setLogin(false);*/
        setLogin(isUserLogged());
    }, [])

    if(login == null)
    {
        return <Loading isVisible={true} text="Loading..."/>
    }

    return login ? <UserLogged/> : <UserGuest/>
}

const styles = StyleSheet.create({})
