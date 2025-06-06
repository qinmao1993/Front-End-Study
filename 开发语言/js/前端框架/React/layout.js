import { Link, Outlet } from "react-router-dom";

export default function Layout() {
    return (
        <div>
            <h1>Layout</h1>
            <Link to="/app">App</Link>
            <br />
            <Link to="/demo/111">Demo</Link>

            <Outlet></Outlet>
        </div>
    );
}
