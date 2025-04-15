import LogIn from "../../components/button1";
import SignUp from "../../components/button2";
export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
            <header
            style={
                {
                    display: "flex",
                    boxShadow: "5px 5px 5px rgba(0, 0, 0, 0.1)",
                    height: "50px",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px",
                    backgroundColor: "#f0f0f0",
                }
            }>
                <div style={{ display: "flex", alignItems: "center" }}>

                <LogIn />
                <SignUp/>
                </div>
                
                    <h1 
                    style={{
                        marginLeft: "35.5%",
                        marginRight: "auto",
                    }}
                    >WORKER</h1>
            </header>
            {children}
            <footer
            style={
                {
                    bottom: "0",
                    boxShadow: "5px 5px 5px rgba(0, 0, 0, 0.1)",

                    width: "100%",
                    height: "50px",
                    position: "absolute",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px",
                    backgroundColor: "#f0f0f0",
                }
            }>

            </footer>
            </body>
            
        </html>
    );
}