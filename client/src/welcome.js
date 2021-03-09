import Registration from "./registration";
import Logo2 from "./logo2";
import Footer from "./footer";
import Video from "./bgvideo";

export default function Welcome() {
    return (
        <div id="welcomeMain">
            <Video />
            <Logo2 />
            <h3>A network of creators blending music and colors</h3>
            <Registration />
            <Footer />
        </div>
    );
}
