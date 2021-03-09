import Registration from "./registration";
import Logo2 from "./logo2";
import Footer from "./footer";
import Video from "./bgvideo";
import { HashRouter, Route } from "react-router-dom";
import Login from "./login";

export default function Welcome() {
    return (
        <div id="welcomeMain">
            <Video />
            <Logo2 />
            <h3>A network of creators blending music and colors</h3>
            <HashRouter>
                <div>
                    <Route exact path="/" component={Registration} />
                    <Route path="/login" component={Login} />
                </div>
            </HashRouter>
            <Footer />
        </div>
    );
}
