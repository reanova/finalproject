import React from "react";
import instance from "./axios";
import { Link } from "react-router-dom";

export default class ResetPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 1,
        };
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    submitEmail() {
        instance
            .post("/password/reset/start", {
                email: this.state.email,
            })
            .then(({ data }) => {
                if (data.success) {
                    this.setState({
                        error: false,
                        step: 2,
                    });
                } else {
                    this.setState({
                        success: false,
                        error: true,
                    });
                }
            })
            .catch((err) => {
                console.log("Error submitting email: ", err);
                this.setState({
                    success: false,
                    error: true,
                });
            });
    }

    submitCodeAndPassword() {
        instance
            .post("/password/reset/verify", {
                email: this.state.email,
                code: this.state.code,
                newPassword: this.state.password,
            })
            .then(({ data }) => {
                if (data.success) {
                    this.setState({
                        error: false,
                        step: 3,
                    });
                } else {
                    this.setState({
                        success: false,
                        error: true,
                    });
                }
            })
            .catch((err) => {
                console.log("Error verifying code: ", err);
                this.setState({
                    success: false,
                    error: true,
                });
            });
    }

    render() {
        const step = this.state.step;
        return (
            <div className="reset-passwd">
                <h3>Reset Password</h3>
                {this.state.error && <p>Oops, something went wrong.</p>}
                {step == 1 && (
                    <div>
                        <h4>Please enter your email address</h4>
                        <input
                            name="email"
                            type="email"
                            placeholder="Email"
                            key="email"
                            required
                            onChange={(e) => this.handleChange(e)}
                        ></input>
                        <br />
                        <button id="submit" onClick={() => this.submitEmail()}>
                            Submit
                        </button>
                    </div>
                )}
                {step == 2 && (
                    <div>
                        <h4>Please enter the code you received</h4>
                        <input
                            name="code"
                            type="text"
                            placeholder="Code"
                            key="code"
                            required
                            onChange={(e) => this.handleChange(e)}
                        />
                        <br />
                        <h4>Please enter a new password</h4>
                        <input
                            name="password"
                            type="password"
                            placeholder="Password"
                            required
                            onChange={(e) => this.handleChange(e)}
                        />
                        <br />
                        <button
                            id="submit"
                            onClick={() => this.submitCodeAndPassword()}
                        >
                            Submit
                        </button>
                    </div>
                )}
                {step == 3 && (
                    <div>
                        <h4>Success!</h4>
                        <p>
                            You can now <Link to="/login">LOGIN</Link> with your
                            new password.
                        </p>
                    </div>
                )}
            </div>
        );
    }
}
