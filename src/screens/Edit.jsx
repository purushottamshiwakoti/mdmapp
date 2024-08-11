import { View, Text, Alert } from "react-native";
import React, { useEffect } from "react";
import {
  Appbar,
  Button,
  TextInput,
  Switch,
  ActivityIndicator,
} from "react-native-paper";
import useAuthStore from "../hooks/authStore";
import axios from "axios";
import { ENDPOINT } from "../lib";
import { useNavigation } from "@react-navigation/native";

const AddDevice = ({ route, navigation }) => {
  const { deviceId, otherParam } = route.params;
  console.log(deviceId);

  const { fullName, email, role } = useAuthStore();
  const [Name, setName] = React.useState("");
  const [Settings, setSettings] = React.useState(false);
  const [loadingd, setLoadingd] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [Health, setHealth] = React.useState(0);
  const [Update, setUpdate] = React.useState(false);
  const [Secure, setSecure] = React.useState(false);

  const fetchData = async () => {
    try {
      setLoadingd(true);
      const res = await axios.get(`${ENDPOINT}/api/device/${deviceId}`);
      const { data } = res.data;
      console.log(data);
      setHealth(`${data.Health}`);
      setSecure(data.Secure);
      setUpdate(data.Update);
      setName(data.name);
      //   setItems(dev);
      setLoadingd(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const [errors, setErrors] = React.useState({});

  const validateForm = () => {
    let valid = true;
    let errors = {};

    if (!Name) {
      errors.Name = "Device Name is required";
      valid = false;
    }

    if (!Health) {
      errors.Health = "Health is required";
      valid = false;
    } else if (isNaN(Health) || Health < 0 || Health > 100) {
      errors.Health = "Health must be a number between 0 and 100";
      valid = false;
    }

    setErrors(errors);
    return valid;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        setLoading(true);

        const data = {
          name: Name,
          Settings: Settings,
          Health: parseInt(Health),
          Update: Update,
          Secure: Secure,
        };
        console.log(data);

        await axios.patch(`${ENDPOINT}/api/device/${deviceId}`, data);
        navigation.goBack();
        Alert.alert("Success", "Device configured successfully");

        // Reset form
        setName("");
        setSettings(false);
        setHealth("");
        setUpdate(false);
        setSecure(false);
        setErrors({});
      } catch (error) {
        Alert.alert("Error", "Failed to add device");
        console.error(error);
      } finally {
        setLoading(false);
      }
    } else {
      Alert.alert("Validation Error", "Please fix the errors in the form");
    }
  };

  console.log(Health);
  return (
    <View>
      <Appbar.Header>
        <Appbar.BackAction
          onPress={() => {
            navigation.goBack();
          }}
          disabled={loading}
        />

        <Appbar.Content
          title={
            fullName.length > 20
              ? "Welcome " + fullName.slice(0, 20) + "..."
              : "Welcome " + fullName
          }
        />
      </Appbar.Header>
      {loadingd ? (
        <ActivityIndicator />
      ) : (
        <>
          <View
            style={{
              marginTop: 20,
            }}
          >
            <Text
              style={{
                alignSelf: "center",
                fontSize: 20,
                color: "green",
              }}
            >
              Configure Device
            </Text>
          </View>
          <View
            style={{
              padding: 10,
              marginTop: 10,
              flexDirection: "column",
              gap: 15,
            }}
          >
            <TextInput
              label="Name"
              value={Name}
              disabled
              onChangeText={(text) => setName(text)}
              error={!!errors.Name}
            />
            {errors.Name ? (
              <Text style={{ color: "red" }}>{errors.Name}</Text>
            ) : null}

            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                gap: 20,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                }}
              >
                Settings
              </Text>
              <Switch
                disabled
                value={Settings}
                onValueChange={() => setSettings(!Settings)}
              />
            </View>
            <TextInput
              label="Health"
              value={Health}
              onChangeText={(text) => setHealth(text)}
              keyboardType="numeric"
              error={!!errors.Health}
              disabled
            />
            {errors.Health ? (
              <Text style={{ color: "red" }}>{errors.Health}</Text>
            ) : null}

            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                gap: 20,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                }}
              >
                Update
              </Text>
              <Switch
                value={Update}
                onValueChange={() => setUpdate(!Update)}
                disabled={loading}
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                gap: 20,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                }}
              >
                Secure
              </Text>
              <Switch
                value={Secure}
                onValueChange={() => setSecure(!Secure)}
                disabled={loading}
              />
            </View>
            <Button mode="elevated" onPress={handleSubmit} disabled={loading}>
              Done
            </Button>
          </View>
        </>
      )}
    </View>
  );
};

export default AddDevice;
