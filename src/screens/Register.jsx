import * as React from "react";
import { StatusBar, View, Alert } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import DropDownPicker from "react-native-dropdown-picker";
import axios from "axios";
import { ENDPOINT } from "../lib";
import { useNavigation } from "@react-navigation/native";
import useAuthStore from "../hooks/authStore";

const Register = () => {
  const { setUserName, setUserEmail, setUserRole, setId } = useAuthStore();
  const navigation = useNavigation();

  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [role, setRole] = React.useState(null);
  const [items, setItems] = React.useState([
    { label: "Administrator", value: "Administrator" },
    { label: "Employee", value: "Employee" },
    { label: "ItSupport", value: "ItSupport" },
    { label: "SecurityAnalyst", value: "SecurityAnalyst" },
  ]);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const [errors, setErrors] = React.useState({
    fullName: "",
    email: "",
    password: "",
    role: "",
  });

  const validateForm = () => {
    let valid = true;
    let errors = {};

    if (!fullName) {
      errors.fullName = "Full Name is required";
      valid = false;
    }

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

    if (!role) {
      errors.role = "Role is required";
      valid = false;
    }

    setErrors(errors);
    return valid;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      setLoading(true);
      try {
        const data = await axios.post(`${ENDPOINT}/api/signup`, {
          fullName,
          email,
          password,
          role,
        });
        const res = data.data;
        console.log(res);
        const { user } = res;
        setUserEmail(user.email);
        setUserName(user.fullName);
        setId(user.id);
        setUserRole(user.role);

        Alert.alert("Registration Successful", res.message);
        console.log("Form Data:", { fullName, email, password, role });
        navigation.navigate("Home");

        // Clear form
        setFullName("");
        setEmail("");
        setPassword("");
        setRole(null);
        setErrors({});
      } catch (error) {
        Alert.alert(
          "Registration Failed",
          "An error occurred during registration."
        );
        console.error("Registration Error:", error);
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
          Register Your Account
        </Text>
        <View
          style={{
            flexDirection: "column",
            gap: 20,
          }}
        >
          <TextInput
            label="Full Name"
            value={fullName}
            onChangeText={(text) => setFullName(text)}
            mode="outlined"
            error={!!errors.fullName}
          />
          {errors.fullName ? (
            <Text style={{ color: "red" }}>{errors.fullName}</Text>
          ) : null}

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

          <View
            style={{
              zIndex: 10,
            }}
          >
            <DropDownPicker
              open={open}
              value={role}
              items={items}
              setOpen={setOpen}
              setValue={setRole}
              setItems={setItems}
              placeholder="Select a role"
              zIndex={3000}
              zIndexInverse={3000}
            />
          </View>
          {errors.role ? (
            <Text style={{ color: "red" }}>{errors.role}</Text>
          ) : null}

          <Button
            icon="login"
            mode="contained"
            onPress={handleSubmit}
            disabled={loading}
            style={{
              marginTop: open ? 160 : 0,
            }}
          >
            {loading ? "Registering..." : "Register"}
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
          <Text>Already have an account?</Text>
          <Button
            mode="text"
            style={{ marginLeft: -10 }}
            onPress={() => navigation.navigate("Login")}
          >
            Login
          </Button>
        </View>
      </View>
    </View>
  );
};

export default Register;
