import ReactDOM from "react-dom";
import Welcome from "./welcome";
import Logo1 from "./logo";

let elem;
if (location.pathname === "/welcome") {
    elem = <Welcome />;
} else {
    elem = <Logo1 />;
}

ReactDOM.render(elem, document.querySelector("main"));
