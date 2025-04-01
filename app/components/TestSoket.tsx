import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = "wss://predix-dev.com"; // HTTPS 환경이므로 wss:// 사용
const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjE1LCJhdXRoSWQiOiJkaWQ6cHJpdnk6Y203dzJqaWw2MDFkcmVqMXVsZmJ6YTJobCIsImlhdCI6MTc0MjIyMjQ0MCwiZXhwIjoxNzQ0ODE0NDQwfQ.BPwfR356pocK5F6k3wax_1DdxV8A2d0xjaCx5AToCu4"

interface ChatMessage {
  externalId?: string | null;
  conversationExternalId?: string;
  sender?: string | null;
  content: string;
  messageType: string;
  data?: any;
}

const chatMessage: ChatMessage = {
  externalId: null,
  content: "안녕하세요! 이 메시지는 서버로 보내는 테스트입니다.",
  messageType: "TEXT",
};

function Test() {
  const [message, setMessage] = useState("");
  const [connected, setConnected] = useState(false);
  const [serverResponse, setServerResponse] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket: Socket = io(SOCKET_URL, {
      path: "/socket.io/",
      transports: ["polling"],
      auth: {
        token: authToken || "",
      },
    });

    newSocket.on("connect", () => {
      console.log("✅ WebSocket Connected!", newSocket.id);
      setConnected(true);
    });

    newSocket.on("test", (data: string) => {
      console.log("📩 Received from server (test):", data);
      setMessage(data);
    });

    newSocket.on("receiveMessage", (data: any) => {
      console.log("📩 Server Response (message_response):", data);
      setServerResponse(data?.content || "No content received");
    });

    newSocket.on("connect_error", (error) => {
      console.error("❗ WebSocket Connection Error:", error.message);
      setConnected(false);
    });

    newSocket.on("disconnect", () => {
      console.log("❌ WebSocket Disconnected.");
      setConnected(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (!socket || !connected) {
      console.error("WebSocket is not connected.");
      return;
    }

    socket.emit("sendMessage", chatMessage, (response: any) => {
      console.log("📤 Server callback response:", response);
      setServerResponse(response?.content || "No callback response");
    });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-2xl font-bold">Vite WebSocket Test</h1>
      <p className="mt-2">서버에서 받은 메시지: {message || "없음"}</p>
      <p className="mt-2 text-blue-400">
        서버 응답: {serverResponse || "대기 중..."}
      </p>
      <p className="mt-2">
        상태:{" "}
        <span className={connected ? "text-green-400" : "text-red-400"}>
          {connected ? "연결됨" : "연결 끊김"}
        </span>
      </p>
      <button
        className="mt-4 bg-blue-500 px-4 py-2 rounded hover:bg-blue-700 transition"
        onClick={sendMessage}
        disabled={!connected}
      >
        서버로 메시지 보내기
      </button>
    </div>
  );
}

export default Test;