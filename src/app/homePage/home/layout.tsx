import { parseCookies } from "nookies";
import HeaderHomePage from "../../components/(homePage)/headerHomePage";
import SideBar from "../../components/(homePage)/sideBar";
export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
   
    return (
       
           
                <div
            style={{
                display: "flex",
                boxShadow: "5px 5px 5px rgba(0, 0, 0, 0.1)",
                marginTop: "50px",
                borderRadius: "10px",
                backgroundColor: "#f0f0f0",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                marginLeft: "auto",
                marginRight: "auto",
                height: "calc(70vh)",
                width: "75%",
                padding: "20px",
            }}
        >
            {children}
        </div>            
            
           
    );
}