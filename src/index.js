const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { default: axios } = require("axios");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000" || "exp://192.168.254.102:19000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {

  socket.on("test",(data)=>{
    console.log(data);
  })
  socket.on("send_notification",async(data)=>{
    // const response = await axios.post(`https://kmgeronimo-backend-api.onrender.com/api/v1/notification`,data);
    const response = await axios.post(`http://localhost:8080/api/v1/notification/`,data);
    socket.broadcast.emit("receive_notification", { value: response.data});
  })

  //APPOINTMENT
  socket.on("appointment_admin_changes",(data)=>{
    socket.broadcast.emit("response_admin_changes",data);
  });
  
  socket.on("appointment_changes",(data)=>{
    socket.broadcast.emit("response_changes",data);
  });

  socket.on("cancel_by_admin",(data)=>{
    socket.broadcast.emit("response_cancel_by_admin",data);
  });

  socket.on("admin_appointment_create",(data)=>{
    socket.broadcast.emit("response_admin_appointment_create",data);
  });

  socket.on("cancel_appointment",(data)=>{
    socket.broadcast.emit("response_cancel",data);
  })
  socket.on("delete_appointment",(data)=>{
    socket.broadcast.emit("response_delete",data);
  })

  //MESSAGING 
  socket.on("create_message_admin",data=>{
    socket.broadcast.emit("create_received_by_patient",data);
  })
  socket.on("send_to_admin",data=>{
    socket.broadcast.emit("received_by_admin",data);
  })
  socket.on("send_to_patient",data=>{
    socket.broadcast.emit("received_by_patient",data);
  });

   // PAYMENT
  socket.on("payment_client_changes",(data)=>{
    socket.broadcast.emit("response_payment_changes",data);
  });

  socket.on("payment_admin_changes",(data)=>{
    socket.broadcast.emit("admin_response_payment_changes",data);
  });

  socket.on("join_room", (key) => {
    socket.join(data);
  });

//   socket.on("join_room", (data) => {
//     socket.join(data);
//   });

//   socket.on("send_message", (data) => {
//     socket.to(data.room).emit("receive_message", data);
//   });
});

server.listen(8081, () => {
  console.log("SERVER IS RUNNING");
});