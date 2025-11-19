import { io } from "socket.io-client";

export const socket = io("https://investment-site-x6tr.onrender.com", {
  withCredentials: true,
});
