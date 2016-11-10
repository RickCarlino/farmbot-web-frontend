import * as React from "react";
import { Navbar } from "../nav/navbar";
import { connect } from "react-redux";
import { Everything } from "../interfaces";
import { updateUser, deleteUser } from "./actions";
import { Settings } from "./settings";
import { DeleteAccount } from "./delete_account";
import { ChangePassword } from "./change_password";
import { UserAccountUpdate } from "./interfaces";

class XAccount extends React.Component<Everything, UserAccountUpdate> {
    constructor(props: Everything) {
        super();
        this.state = {};
    }

    componentDidMount() {
        if (this.props.auth.user) {
            let { name, email } = this.props.auth.user;
            this.setState({ name, email });
        }
    }

    set(event: React.FormEvent<HTMLInputElement>) {
        let { name, value } = event.currentTarget;
        this.setState({ [name]: value });
    }

    saveUser() {
        this.props.dispatch(updateUser(this.state));
    }

    savePassword() {
        this
            .props
            .dispatch(updateUser(this.state));

        this.setState({
            password: "",
            new_password: "",
            new_password_confirmation: ""
        });
    }

    // Hear ye, hear ye!
    enactDeletion() {
        let password = this.state.deletion_confirmation || "NEVER SET";
        this.props.dispatch(deleteUser({ password }));
        console.log("X");
    }

    render() {
        if (this.props.auth.user) {
            return (
                <div>
                    <Navbar { ...this.props } />
                    <div className="all-content-wrapper account">
                        <Settings name={this.state.name || ""}
                            email={this.state.email || ""}
                            set={this.set.bind(this)}
                            save={this.saveUser.bind(this)} />
                        <ChangePassword
                            password={this.state.password || ""}
                            new_password={this.state.new_password || ""}
                            new_password_confirmation={this.state.new_password_confirmation || ""}
                            set={this.set.bind(this)}
                            save={this.savePassword.bind(this)} />
                        <DeleteAccount
                            deletion_confirmation={this.state.deletion_confirmation || ""}
                            set={this.set.bind(this)}
                            save={this.enactDeletion.bind(this)} />
                    </div>
                </div>
            );

        } else {
            return <div>Please Log In</div>;
        };
    }
}

export let Account = connect((state: Everything) => state)(XAccount);
