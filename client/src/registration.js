import React from "react";
import axios from "axios";

export default class Registration extends React.Component {
    constructor() {
        super();
        this.state = {
            success: true,
            error: false,
        };
    }

    handleClick() {
        // console.log("clicked!!!");
        axios
            .post("/registration", this.state)
            .then(({ data }) => {
                console.log("data", data);
                if (data.success) {
                    // redirect
                    location.replace("/");
                } else {
                    // render an error message
                    this.setState({
                        error: true,
                    });
                }
            })
            .catch((error) => {
                console.log("err in axios POST /registration: ", error);
            });
    }

    handleChange(e) {
        // console.log("change is running!");
        this.setState(
            {
                [e.target.name]: e.target.value,
            },
            // this callback runs after setState finishes updating state
            // because we're logging state here in the callback, this means this
            // log won't run until state has been updated, ensuring us that
            // we're seeing the most updated log
            () => console.log("this.state after setState: ", this.state)
        );

        // console.log("this.state after setState: ", this.state);
    }

    render() {
        return (
            <div className="form">
                <h3>Register here:</h3>
                {this.state.error && <p>Something went wrong</p>}
                <span>
                    *
                    <input
                        type="text"
                        name="first"
                        placeholder="First name"
                        onChange={(e) => this.handleChange(e)}
                    />
                </span>
                <br />
                <span>
                    *
                    <input
                        type="text"
                        name="last"
                        placeholder="Last Name"
                        onChange={(e) => this.handleChange(e)}
                    />
                </span>
                <br />
                <span>
                    *
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        onChange={(e) => this.handleChange(e)}
                    />
                </span>
                <br />
                <span>
                    *
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={(e) => this.handleChange(e)}
                    />
                </span>
                <span id="mandatory">* Mandatory fields</span>
                <br />
                <button id="submit" onClick={() => this.handleClick()}>
                    SUBMIT
                </button>
                <p>
                    Already a member?{" "}
                    <a href="#" id="loginClick">
                        LOG IN
                    </a>
                </p>
            </div>
        );
    }
}
