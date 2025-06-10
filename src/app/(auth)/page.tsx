import CheckIfLogged from "./checkIfLogged";

export default async function Home() {
    // Get cookie store instance - await the Promise
    

    // If no valid user cookie, render the page
    return (
        <CheckIfLogged />
    );
}