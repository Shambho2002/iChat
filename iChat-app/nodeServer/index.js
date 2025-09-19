const io = require("socket.io")(8000, {
  cors: {
    origin: "*", // allow all origins in dev
    methods: ["GET", "POST"],
  },
});

const users = {};

io.on("connection", (socket) => {
  // New user joins
  socket.on("new-user-joined", (name) => {
    if (!name || !name.trim()) return;
    users[socket.id] = name.trim();

    console.log("New user:", users[socket.id]);
    socket.broadcast.emit("user-joined", users[socket.id]);
  });

  // User sends a message
  socket.on("send", (message) => {
    socket.broadcast.emit("receive", { message, name: users[socket.id] });
  });

  // User disconnects
  socket.on("disconnect", () => {
    const name = users[socket.id];
    if (name) {
      socket.broadcast.emit("user-left", name);
      console.log("User left:", name);
      delete users[socket.id];
    }
  });
});