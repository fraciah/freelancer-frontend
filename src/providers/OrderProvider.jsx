import { useContext } from "react";
import { createContext } from "react";
import { useAuthContext } from "./AuthProvider";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useJwt } from "react-jwt";

export const OrderContext = createContext();

export const OrderProvider = (props) => {
  const navigate = useNavigate();

  const ordersUrl = `${import.meta.env.VITE_API_URL}/orders/`;

  const { userToken } = useAuthContext();
  const { decodedToken } = useJwt(userToken);

  const [orders, setOrders] = useState([]);
  const [ordersAvailable, setOrdersAvailable] = useState([]);
  const [ordersBidding, setOrdersBidding] = useState([]);
  const [ordersInProgress, setOrdersInProgress] = useState([]);
  const [ordersCompleted, setOrdersCompleted] = useState([]);

  const [loadingAttachemnt, setLoadingAttachment] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [user, setUser] = useState();
  const [socket, setSocket] = useState(null);

  const headersContent = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${userToken}`,
  };

  const getOrdersAvailable = async () => {
    const ordersUrl = `${import.meta.env.VITE_API_URL}/orders?status=available`;
    try {
      const getOrders = await fetch(ordersUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      });

      const orders = await getOrders.json();
      const available = orders.results.filter((order) => order.status === "Available");

      setOrdersAvailable(available);
      return orders;
    } catch (errors) {
      console.error(errors);
    } finally {
      setLoading(false);
    }
  };




  const getBidding = async () => {
    const biddingUrl = `${import.meta.env.VITE_API_URL}/orders?bidding=true`;

    try {
      setLoading(true);
      const getBiddings = await fetch(biddingUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      });

      const biddings = await getBiddings.json();
      console.log(biddings);
      setOrdersBidding(biddings);
      return biddings;
    } catch (errors) {
      console.error(errors);
    } finally {
      setLoading(false);
    }
  };

  const getAllOrders = async () => {
    const ordersUrl = `${import.meta.env.VITE_API_URL}/orders`;
    try {
      const getOrders = await fetch(ordersUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      });

      const orders = await getOrders.json();
      console.log(orders)
      // const available = orders.filter(order=>order.status==='Available');
      const inProgress = orders.results.filter(
        (order) => order.status === "In Progress"
      );
      const completed = orders.results.filter((order) => order.status === "Completed");

      // setOrdersAvailable(available);
      setOrdersInProgress(inProgress);
      setOrdersCompleted(completed);
      setOrders(orders.results);

      return orders.results;
    } catch (errors) {
      console.error(errors);
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (e) => {
    try {
      setSubmitLoading(true);
      e.preventDefault();
      const title = e.target.title.value;
      const category = e.target.category.value;
      const deadline = new Date(e.target.deadline.value);
      const instructions = e.target.instructions.value;
      const amount = e.target.amount.value;

      const headers = {
        Authorization: `Bearer ${userToken}`,
      };

      let bodyData;

      if (e.target.attachment.files.length > 0) {
        const attachment = e.target.attachment.files[0];
        const data = new FormData();
        data.append("title", title);
        data.append("category", category);
        data.append("attachment", attachment);
        data.append("deadline", deadline.toISOString());
        data.append("instructions", instructions);
        data.append("amount", amount);

        bodyData = data;
      } else {
        const jsonPayload = {
          title,
          category,
          deadline: deadline.toISOString(),
          instructions,
          amount,
        };

        bodyData = JSON.stringify(jsonPayload);
        headers["Content-Type"] = "application/json";
      }

      const createOrder = await fetch(ordersUrl, {
        method: "post",
        headers,
        body: bodyData,
      });

      const status = createOrder.status;

      if (status === 201) {
        console.log("navigation");
        getAllOrders().then(() => {
          navigate("./app");
        });
        setSubmitLoading(false);
      } else if (status === 401) {
        navigate("/login?redirect=create-task");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitLoading(false);
    }
  };

  const updateInstructions = async (instructions, orderId) => {
    try {
      const updateOrder = await fetch(`${ordersUrl}${orderId}/`, {
        method: "put",
        headers: headersContent,
        body: JSON.stringify({
          instructions: instructions,
        }),
      });

      if (updateOrder.ok) {
        const data = updateOrder.json();
        return data;
      } else {
        const status = updateOrder.status;
        if (status === 401) {
          navigate(`../login?order=${orderId}`);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  const uploadAttachment = async (file, orderId, solutionType) => {
    const solutionUrl = `${import.meta.env.VITE_API_URL}/orders/${orderId}`;
    setLoadingAttachment(true);

    try {
      const data = new FormData();
      data.append("solution", file);
      data.append("_type", solutionType); // Include the solutionType in the FormData

      const response = await fetch(`${solutionUrl}/solution/`, {
        method: "post",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        body: data,
      });

      if (response.ok) {
        const dataRes = await response.json();
        return dataRes;
      } else {
        const status = response.status;
        if (status === 401) {
          console.log("NOT ALLOWED");
          navigate(`../login?order=${orderId}`);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingAttachment(false);
    }
  };

  const completeOrder = async (orderId) => {
    try {
      const completeOrderStatus = await fetch(`${ordersUrl}${orderId}/`, {
        method: "put",
        headers: headersContent,
        body: JSON.stringify({
          status: "Completed",
        }),
      });

      if (completeOrderStatus.ok) {
        const data = await completeOrderStatus.json();
        return data;
      } else {
        const status = completeOrderStatus.status;
        if (status === 401) {
          navigate(`../login?order=${orderId}`);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  // useEffect(()=>{

  // },[])

  // socket.onmessage = (event) => {
  //     const receivedData = JSON.parse(event.data);
  //     const newOrder = (receivedData.message.order);
  //     console.log("Received ", receivedData);
  //     setOrders(prev=>{
  //         const updatedOrders = [newOrder, ...prev];
  //         const inProgress = updatedOrders.filter(order=>order.status==='In Progress');
  //         setOrdersInProgress(inProgress);
  //         return updatedOrders;
  //     });
  // }

  useEffect(() => {
    setUser(decodedToken?.user_id);
    if (user) {
      console.log("Connected");
      const newSocket = new WebSocket(
        `ws://127.0.0.1:8000/ws/order/freelancer/`
      );
      setSocket(newSocket);
      newSocket.onmessage = (event) => {
        const receivedData = JSON.parse(event.data);
        const newOrder = receivedData.message.order;
        setOrders((prev) => {
          const updatedOrders = [newOrder, ...prev];
          setOrdersAvailable(updatedOrders);
          return updatedOrders;
        });
      };
      setSocket(newSocket);
    } else {
      socket?.close();
    }

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [decodedToken, user]);

  // const [orderDetails, setOrderDetails] = useState();

  useEffect(() => {
    userToken && getAllOrders();
    // socket.onopen = () => {
    //     console.log("Connection established");
    // }
  }, [userToken]);

  return (
    <OrderContext.Provider
      value={{
        orders,
        ordersAvailable,
        ordersBidding,
        ordersInProgress,
        ordersCompleted,
        loading,
        submitLoading,
        loadingAttachemnt,
        // getOrder,
        createOrder,
        updateInstructions,
        completeOrder,
        getAllOrders,
        getBidding,
        uploadAttachment,
        getOrdersAvailable,
      }}
    >
      {props.children}
    </OrderContext.Provider>
  );
};

export function useOrderContext() {
  return useContext(OrderContext);
}
