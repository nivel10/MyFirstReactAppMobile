import React, { useState, } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { map } from 'lodash';
import { Icon, ListItem } from 'react-native-elements';

import Modal from '../Modal'

export default function AccountOptions({user, toastRef}) {

    const [showModal, setShowModal] = useState(false);
    
    const menuOptions = menuGenerateOprions();

    return (
        <View>
            {
                map(menuOptions, (menu, index) => (
                    <ListItem
                        key={index}
                        style={styles.menuStyle}
                        onPress={menu.onPress}
                    >
                        <Icon
                            type="material-community"
                            name={menu.iconNameLeft} 
                            color={menu.iconColorLeft}
                        />
                        <ListItem.Content>
                            <ListItem.Title>{menu.title}</ListItem.Title>
                        </ListItem.Content>
                        <Icon
                            type="material-community"
                            name={menu.iconNameRight} 
                            color={menu.iconColorRight}
                        />
                    </ListItem>
                ))
            }
            <Modal
                isVisible={showModal}
                setVisible={setShowModal}
            >
                <Text>
                    Hello beutifull Nikole...!!!
                    Hello beutifull Nikole...!!!
                    Hello beutifull Nikole...!!!
                </Text>
            </Modal>
        </View>
    )
}

const seletedComponent = (component) =>{
    setShowModal(true);
}

const menuGenerateOprions = () => {
    return [
        {
            title: "Change first and last name",
            iconNameLeft: "account-circle",
            iconColorLeft: "#917464",
            iconNameRight: "chevron-right",
            iconColorRight: "#917464",
            onPress: () => seletedComponent("ChangeName"),
        },
        {
            title: "Change email",
            iconNameLeft: "at",
            iconColorLeft: "#917464",
            iconNameRight: "chevron-right",
            iconColorRight: "#917464",
            onPress: () => seletedComponent("ChangeEmail"),
        },
        {
            title: "Change password",
            iconNameLeft: "lock-reset",
            iconColorLeft: "#917464",
            iconNameRight: "chevron-right",
            iconColorRight: "#917464",
            onPress: () => seletedComponent("ChangePassword"),
        }
    ];
}

const styles = StyleSheet.create({
    menuStyle: {
        borderBottomWidth: 1,
        borderBottomColor: "#917464",
    },
})
