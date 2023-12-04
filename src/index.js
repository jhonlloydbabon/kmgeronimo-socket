const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { default: axios } = require("axios");
const PORT = 8081;

app.use(cors());

const server = http.createServer(app);

app.get('/',(req, res)=>{
  res.write("Check Mic"); 
})

const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        "http://localhost:3000",
        "exp://192.168.254.100:19000",
        "https://updated-km-frontend.vercel.app",
      ];

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("send_notification",(data)=>{
    socket.broadcast.emit("receive_notification", data);
  })
  socket.on("send_notification_by_admin",(data)=>{
    socket.broadcast.emit("receive_notification_by_admin", data);
  })

  //APPOINTMENT
  socket.on("new_appointment_patient_changes",(data)=>{
    socket.broadcast.emit("new_response_patient_changes",data);
  });

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
  socket.on("create_message_patient",data=>{
    socket.broadcast.emit("create_received_by_admin",data);
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

  // APPOINTMENT FEE
  socket.on("change_appointment_fee", data=>{
    socket.broadcast.emit("response_appointment_fee", data)
  })
});

server.listen(PORT, () => {
  console.log("SERVER IS RUNNING");
});