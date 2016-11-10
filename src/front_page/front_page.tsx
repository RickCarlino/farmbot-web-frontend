import * as React from "react";
import * as i18next from "i18next";
import * as axios from "axios";
import { AuthResponse } from "../auth/actions";
import { error as log } from "../logger";
import { prettyPrintApiErrors } from "../util";
import { API } from "../api";

interface FrontPageState {
    regName: string;
    regEmail: string;
    regPassword: string;
    regConfirmation: string;
    loginEmail: string;
    loginPassword: string;
}

interface FrontPageProps { };

export class FrontPage extends React.Component<FrontPageProps, FrontPageState> {

    constructor() {
        super();
        this.state = {
            regEmail: "",
            regName: "",
            regPassword: "",
            regConfirmation: "",
            loginEmail: "",
            loginPassword: ""
        };
    }

    componentDidMount() {
        API.setBaseUrl(API.fetchBrowserLocation());
    }

    set(name: string) {
        return function (event: React.FormEvent<HTMLInputElement>) {
            let state: { [name: string]: string } = {};
            state[name] = (event.currentTarget).value;
            this.setState(state);
        };
    }

    submitLogin(e: React.FormEvent<{}>) {
        e.preventDefault();
        let { loginEmail, loginPassword } = this.state;
        let payload = { user: { email: loginEmail, password: loginPassword } };

        axios.post<AuthResponse>(API.current.tokensPath, payload)
            .then(resp => {
                let { token } = resp.data;
                localStorage["token"] = JSON.stringify(token);
                window.location.replace("/app/dashboard/controls");
            }).catch(error => {
                log(prettyPrintApiErrors(error));
            });
    }

    submitRegistration(e: React.FormEvent<{}>) {
        e.preventDefault();
        let { regEmail, regName, regPassword, regConfirmation } = this.state;
        let form = {
            user: {
                name: regName,
                email: regEmail,
                password: regPassword,
                password_confirmation: regConfirmation
            }
        };
        axios.post<AuthResponse>(API.current.usersPath, form).then(resp => {
            let { token } = resp.data;
            localStorage["token"] = JSON.stringify(token);
            window.location.replace("/app/dashboard/controls");
        }).catch(error => {
            log(prettyPrintApiErrors(error));
        });
    }

    render() {
        return (
            <div className="all-content-wrapper">
                <div className="row">
                    <div className="col-xs-12 col-sm-6 col-sm-offset-3 col-md-4 col-md-offset-4">
                        <div className="widget-wrapper">
                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="widget-header">
                                        <h5>{i18next.t("Login")}</h5>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <form onSubmit={this.submitLogin.bind(this)}>
                                    <div className="col-sm-12">
                                        <div className="widget-content">
                                            <div className="input-group">
                                                <label> {i18next.t("Email")} </label>
                                                <input type="email"
                                                    onChange={this.set("loginEmail").bind(this)}>
                                                </input>
                                                <label>{i18next.t("Password")}</label>
                                                <input type="password"
                                                    onChange={this.set("loginPassword").bind(this)}>
                                                </input>
                                            </div>
                                            <div className="row">
                                                <div className="col-xs-6">
                                                    <p className="auth-link">
                                                        <a href={
                                                            "/users/password/new"
                                                        }>
                                                            {i18next.t("Reset password")}
                                                        </a>
                                                    </p>
                                                </div>
                                                <div className="col-xs-6">
                                                    <button className="button-like button green login">
                                                        {i18next.t("Login")}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12 col-sm-6 col-sm-offset-3 col-md-4 col-md-offset-4">
                        <div className="widget-wrapper">
                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="widget-header">
                                        <h5> {i18next.t("Register")} </h5>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12">
                                    <form onSubmit={this.submitRegistration.bind(this)} >
                                        <div className="widget-content">
                                            <div className="input-group">
                                                <label>{i18next.t("Email")} </label>
                                                <input type="email" onChange={this.set("regEmail").bind(this)} ></input>
                                                <label>Name</label>
                                                <input type="text" onChange={this.set("regName").bind(this)}></input>
                                                <label>Password</label>
                                                <input type="password"
                                                    onChange={this.set("regPassword").bind(this)}>
                                                </input>
                                                <label>{i18next.t("Verfy Password")}</label>
                                                <input type="password"
                                                    onChange={
                                                        this.set("regConfirmation").bind(this)}>
                                                </input>
                                            </div>
                                            <div className="row">
                                                <div className="col-xs-6">
                                                </div>
                                                <div className="col-xs-6">
                                                    <div className="auth-button">
                                                        <button className="button-like button green create-account">
                                                            {i18next.t("Create Account")}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

