import { NavBar } from "../NavBar";
import { Helmet } from "react-helmet";
const Layout = ({children}: {children: React.ReactNode}) => {
  return (
    <div>
        <Helmet>
            <meta charSet="utf-8" />
            <title>Event Manager</title>
            <meta name="description" content="Event Manager" />
        </Helmet>
      <NavBar />
      {children}
    </div>
  );
};

export default Layout;