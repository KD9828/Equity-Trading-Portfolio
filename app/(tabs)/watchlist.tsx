import { StyleSheet, View, FlatList, Animated, Pressable, Alert } from "react-native";
import { useContext, useEffect, useState } from "react";
import { Text } from "react-native-paper";
import Swipeable from "react-native-gesture-handler/Swipeable";
import axios from 'axios'
import { StoreContext } from "../_layout";
import { stocks } from "@/data";
import { StockCard } from "@/components/StockCard";
import { useStripe } from "@stripe/stripe-react-native";

function RightActions({
  progress,
  dragX,
  onPress,
}: {
  progress: Animated.AnimatedInterpolation<string | number>;
  dragX: Animated.AnimatedInterpolation<string | number>;
  onPress: () => void;
}) {
  const scale = dragX.interpolate({
    inputRange: [-100, 0],
    outputRange: [0.7, 0],
  });

  return (
    <Pressable
      style={{
        backgroundColor: "red",
        justifyContent: "center",
        alignItems: "center",
        width: 90,
      }}
      onPress={onPress}
    >
      <Animated.Text
        style={{
          fontWeight: "bold",
          fontSize: 22,
          color: "white",
          transform: [{ scale }],
        }}
      >
        Delete
      </Animated.Text>
    </Pressable>
  );
}

const fetchPaymentSheetParams = async () => {
  try {
    // const response = await axios.post(`http://192.168.1.19/payment-sheet`);
    
    // if (!response || !response.data) {
    //   throw new Error("No data received from server");
    // }
    // console.log("Received payment sheet parameters:", response.data);
    
    // const { paymentIntent, ephemeralKey, customer, publishableKey } = response.data;

    const response = await fetch(`http://192.168.1.19/payment-sheet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const { paymentIntent, ephemeralKey, customer,publishableKey} = await response.json();

    
    return {
      paymentIntent,
      ephemeralKey,
      customer,
      publishableKey
    };
  } catch (error) {
    console.error("Error fetching payment sheet parameters:", error);
    throw error;
  }
};





export default function WatchlistScreen() {
  const { likedStocks, updateLikedStocks } = useContext(StoreContext);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);  

  const initializePaymentSheet = async () => {
    const {
      paymentIntent,
      ephemeralKey,
      customer,
      publishableKey
    } = await fetchPaymentSheetParams();
    const { error } = await initPaymentSheet({
      merchantDisplayName: "KD Trader, Inc.",
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      allowsDelayedPaymentMethods: true,
      defaultBillingDetails: {
        name: 'Jane Doe',
      }
    });

    if (!error) {
      setLoading(true);
    }
  };

  const openPaymentSheet = async () => {
    try {
      // const {
      //   paymentIntent,
      //   ephemeralKey,
      //   customer,
      //   publishableKey
      // } = await fetchPaymentSheetParams();
      const { error:err } = await initPaymentSheet({
        merchantDisplayName: "KD Trader, Inc.",
        customerId: 'cus_Q5JSmP8MYRkOSl',
        customerEphemeralKeySecret: 'ek_test_YWNjdF8xQlRVREdKQUpmWmI5SEVCLEo1aXYzdXZJaVp3YVN1dXB5TlNxRjV6QmIwMmdJV2Y_00buDFOTiS',
        paymentIntentClientSecret: 'pi_1PF8pBJAJfZb9HEBodh9Y4Qx_secret_ltY028uRjU1MOhEdZzXJWp26H',
        allowsDelayedPaymentMethods: true,
        defaultBillingDetails: {
          name: 'Jane Doe',
        }
      });
  
      if (!err) {
        setLoading(true);
      }
      const { error } = await presentPaymentSheet();

      if (error) {
        Alert.alert(`Error code: ${error.code}`, error.message);
      } else {
        Alert.alert('Success', 'Your order is confirmed!');
      }
    } catch (error) {
      console.error('Error presenting payment sheet:', error);
      Alert.alert('Error', 'An error occurred while processing your payment. Please try again later.');
    }
  };

  

  if (likedStocks.length > 0)
    return (
  <>      
  <View style={{ flex: 1 }}>
        <FlatList
          keyExtractor={(item) => item.ticker}
          data={stocks.filter((i) => likedStocks.includes(i.ticker))}
          renderItem={({ item }) => (
            <Swipeable
              renderRightActions={(progress, dragX) => (
                <RightActions
                  progress={progress}
                  dragX={dragX}
                  onPress={() => updateLikedStocks(item.ticker, "del")}
                />
              )}
            >
              <StockCard {...item} />
            </Swipeable>
          )}
        />
      </View>
      <Pressable style={styles.checkout} onPress={openPaymentSheet}>
  <Text style={styles.checkoutText}>Checkout</Text>
</Pressable>
      </>
    );
  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={{ fontWeight: "bold" }}>
        No Stocks On 
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
    checkout: {
      backgroundColor: "green",
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 20,
      alignItems: "center", // Center horizontally
      justifyContent: "center", // Center vertically
      marginBottom:10
    },
    checkoutText: {
      color: "white", // Assuming you want white text color
      fontWeight: "bold" // Optional: Add bold font weight
    }
});
