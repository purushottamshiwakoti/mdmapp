import * as React from "react";
import { StatusBar, View, Alert } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import DropDownPicker from "react-native-dropdown-picker";
import axios from "axios";
import { ENDPOINT } from "../lib";
import { useNavigation } from "@react-navigation/native";
import useAuthStore from "../hooks/authStore";

const Login = () => {
  const navigation = useNavigation();
  const { setUserName, setUserEmail, setUserRole, setId } = useAuthStore();

  const [password, setPassword] = React.useState("");
  const [email, setEmail] = React.useState("");

  const [loading, setLoading] = React.useState(false);

  const [errors, setErrors] = React.useState({
    fullName: "",
    email: "",
  });

  const validateForm = () => {
    let valid = true;
    let errors = {};

    if (!email) {
      errors.email = "Email is required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email is invalid";
      valid = false;
    }

    if (!password) {
      errors.password = "Password is required";
      valid = false;
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
      valid = false;
    }

    setErrors(errors);
    return valid;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      setLoading(true);
      try {
        const data = await axios.post(`${ENDPOINT}/api/login`, {
          email,
          password,
        });
        Alert.alert("Hurreh", "Your account has been logged in");
        console.log(data);
        const res = data.data;
        console.log(res);
        const { user } = res;
        setUserEmail(user.email);
        setUserName(user.fullName);
        setId(user.id);
        setUserRole(user.role);
        navigation.navigate("Home");

        // Clear form
        setPassword("");
        setEmail("");

        setErrors({});
      } catch (error) {
        Alert.alert(
          "Login Failed",
          "An error occurred during Login Check your password."
        );
        console.error("Login Error:", error);
      } finally {
        setLoading(false);
      }
    } else {
      Alert.alert("Error", "Please fix the errors in the form");
    }
  };

  return (
    <View
      style={{
        marginTop: StatusBar.currentHeight || 0,
      }}
    >
      <View
        style={{
          padding: 10,
        }}
      >
        <Text
          variant="displaySmall"
          style={{
            padding: 10,
            color: "green",
          }}
        >
          Login To Your Account
        </Text>
        <View
          style={{
            flexDirection: "column",
            gap: 20,
          }}
        >
          <TextInput
            label="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
            inputMode="email"
            mode="outlined"
            error={!!errors.email}
          />
          {errors.email ? (
            <Text style={{ color: "red" }}>{errors.email}</Text>
          ) : null}

          <TextInput
            label="Password"
            value={password}
            onChangeText={(text) => setPassword(text)}
            mode="outlined"
            secureTextEntry
            error={!!errors.password}
          />
          {errors.password ? (
            <Text style={{ color: "red" }}>{errors.password}</Text>
          ) : null}

          <Button
            icon="login"
            mode="contained"
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? "LogginIn..." : "Login"}
          </Button>
        </View>
        <View
          style={{
            marginTop: 10,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text>Don't have an account?</Text>
          <Button
            mode="text"
            style={{ marginLeft: -10 }}
            onPress={() => navigation.navigate("Register")}
          >
            Register
          </Button>
        </View>
      </View>
    </View>
  );
};

export default Login;
