import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { map } from "lodash";
import { Icon, ListItem } from "react-native-elements";

import Modal from "../Modal";
import ChangeDisplayNameForm from "./ChangeDisplayNameForm";
import ChangeEmailForm from "./ChangeEmailForm";
import ChangePasswordForm from "./ChangePasswordForm";

export default function AccountOptions({ user, toastRef, setReloadUser }) {

  const [showModal, setShowModal] = useState(false);
  const [renderComponent, setRenderComponent] = useState(null);

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
      },
    ];
  };

  const menuOptions = menuGenerateOprions();

  const seletedComponent = (component) => {
    switch (component) {
      case "ChangeName":
        setRenderComponent(
            <ChangeDisplayNameForm
                displayName={user.displayName}
                setShowModal={setShowModal}
                toastRef={toastRef}
                setReloadUser={setReloadUser}
            />
        );
        break;

      case "ChangeEmail":
        setRenderComponent(
          <ChangeEmailForm 
            email={user.email}
            setShowModal={setShowModal}
            toastRef={toastRef}
            setReloadUser={setReloadUser}
          />
        );
        break;

      case "ChangePassword":
        setRenderComponent(
          <ChangePasswordForm
            setShowModal={setShowModal}
            toastRef={toastRef}
          />
        );
        break;

        default:
          setRenderComponent(<Text>Noting</Text>)
          break;
    }
    setShowModal(true);
  };

  return (
    <View>
      {
        map(menuOptions, (menu, index) => (
            <ListItem 
                key={index} 
                style={styles.menuStyle} 
                onPress={menu.onPress}>
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
          {
            renderComponent
          }
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  menuStyle: {
    borderBottomWidth: 1,
    borderBottomColor: "#917464",
  },
});