import HeaderHomePage from "@/components/(homePage)/headerHomePage";
import SideBar from "@/components/(homePage)/sideBar";
export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
   
    return (
        <html lang="en">
            <body>
            <HeaderHomePage/>
            <div style={{
                display: "flex",
                flexDirection: "row",
                height: "80vh",
                width: "100%",
                left: "0",
                marginLeft: "2%",
            }}>
                <SideBar/>
               
            {children}
        </div>          
            
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