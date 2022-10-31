import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "./Auth0/LoginButton";
import { PageProvider } from "./PageProvider";

function App() {
  const { isAuthenticated, isLoading } = useAuth0();

  if (!isAuthenticated) {
    return <LoginButton />;
  } else if (isLoading) {
    return "The website is loading";
  } else {
    return <PageProvider />;
  }
}

export default App;
