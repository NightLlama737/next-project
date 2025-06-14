export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
            
            <div style={{
                display: "flex",
                boxShadow: "5px 5px 5px rgba(0, 0, 0, 0.1)",
                marginTop: "50px",
                borderRadius: "10px",
                backgroundColor: "#f0f0f0",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
                marginLeft: "auto",
                marginRight: "auto",
                height: "calc(70vh - 50px)",
                width: "50%",
                padding: "20px",
            }}>{children}</div>
            
    );
}