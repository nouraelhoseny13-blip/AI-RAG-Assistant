export default function Layout({ children }) {
  return (
    <div style={{ display: "flex", height: "100vh" }}>

      {/* Sidebar */}
      <div style={{
        width: "220px",
        background: "#0f172a",
        color: "white",
        padding: "20px"
      }}>
        <h2>AI RAG</h2>

        <p style={{ fontSize: "12px", color: "#aaa" }}>
          Assistant
        </p>

        <hr style={{ margin: "15px 0" }} />

        <button style={{ display: "block", marginBottom: "10px" }}>
          Upload
        </button>

        <button>
          Chat
        </button>
      </div>

      {/* Main Page */}
      <div style={{ flex: 1, padding: "20px" }}>
        {children}
      </div>

    </div>
  );
}