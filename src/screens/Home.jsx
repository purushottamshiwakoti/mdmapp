import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";

import { Appbar, Button } from "react-native-paper";
import useAuthStore from "../hooks/authStore";
import { useNavigation } from "@react-navigation/native";
import { DataTable } from "react-native-paper";
import axios from "axios";
import { ENDPOINT } from "../lib";
import { useFocusEffect } from "@react-navigation/native";

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [page, setPage] = React.useState(0);
  const [numberOfItemsPerPageList] = React.useState([2, 3, 4, 50]); // Updated to include 50
  const [itemsPerPage, onItemsPerPageChange] = React.useState(50); // Default to 50 items per page

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, items.length);

  React.useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${ENDPOINT}/api/device`);
      const { dev } = res.data;
      console.log(dev);
      setItems(dev);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  const navigation = useNavigation();
  const { fullName, email, role } = useAuthStore();
  console.log(fullName);
  return (
    <View>
      <Appbar.Header>
        <Appbar.Content
          title={
            fullName.length > 20
              ? "Welcome " + fullName.slice(0, 20) + "..."
              : "Welcome " + fullName
          }
        />
      </Appbar.Header>
      <View
        style={{
          marginTop: 20,
          flexDirection: "row",
          alignSelf: "flex-end",
          paddingRight: 10,
        }}
      >
        <Button mode="outlined" onPress={() => navigation.navigate("Add")}>
          Add
        </Button>
      </View>
      {/* data table  */}
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <View style={{ marginTop: 30 }}>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Device Name</DataTable.Title>
              <DataTable.Title numeric>Edit</DataTable.Title>
            </DataTable.Header>

            {items.slice(from, to).map((item) => (
              <DataTable.Row key={item.key}>
                <DataTable.Cell>{item.name}</DataTable.Cell>
                <DataTable.Cell numeric>
                  <Button
                    onPress={() => {
                      navigation.navigate("Edit", {
                        deviceId: item.id,
                      });
                    }}
                  >
                    Edit
                  </Button>
                </DataTable.Cell>
              </DataTable.Row>
            ))}

            <DataTable.Pagination
              page={page}
              numberOfPages={Math.ceil(items.length / itemsPerPage)}
              onPageChange={(page) => setPage(page)}
              label={`${from + 1}-${to} of ${items.length}`}
              numberOfItemsPerPageList={numberOfItemsPerPageList}
              numberOfItemsPerPage={itemsPerPage}
              // onItemsPerPageChange={onItemsPerPageChange}
              showFastPaginationControls
              // selectPageDropdownLabel={"Rows per page"}
            />
          </DataTable>
        </View>
      )}
    </View>
  );
};

export default Home;
