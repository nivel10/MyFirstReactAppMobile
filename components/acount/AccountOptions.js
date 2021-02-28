import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { map } from 'lodash';
import { Icon, ListItem } from 'react-native-elements';

export default function AccountOptions({user, toastRef}) {

    const menuOptions = menuGenerateOprions();

    return (
        <View>
            {
                map(menuOptions, (menu, index) => (
                    <ListItem
                        key={index}
                        style={styles.menuStyle}
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
        </View>
    )
}

function menuGenerateOprions () {
    return [
        {
            title: "Change first and last name",
            iconNameLeft: "account-circle",
            iconColorLeft: "#917464",
            iconNameRight: "chevron-right",
            iconColorRight: "#917464",
        },
        {
            title: "Change email",
            iconNameLeft: "at",
            iconColorLeft: "#917464",
            iconNameRight: "chevron-right",
            iconColorRight: "#917464",
        },
        {
            title: "Change password",
            iconNameLeft: "lock-reset",
            iconColorLeft: "#917464",
            iconNameRight: "chevron-right",
            iconColorRight: "#917464",
        }
    ];
}

const styles = StyleSheet.create({
    menuStyle: {
        borderBottomWidth: 1,
        borderBottomColor: "#917464",
    },
})
