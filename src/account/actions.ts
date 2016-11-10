import * as axios from "axios";
import { t } from "i18next";
import { Thunk } from "../redux/interfaces";
import { success, error } from "../logger";
import { User } from "../auth/interfaces";
import { API } from "../api";
import { ReduxAction } from "../redux/interfaces";
import { UserAccountUpdate } from "./interfaces";
import { prettyPrintApiErrors, AxiosErrorResponse } from "../util";

function updateUserSuccess(payload: User): ReduxAction<User> {
    return {
        type: "UPDATE_USER_SUCCESS",
        payload
    };
}

export function updateUser(user: UserAccountUpdate): Thunk {
    return (dispatch, getState) => {
        axios.patch<User>(API.current.usersPath, user)
            .then((resp) => {
                success(t("User successfully updated."));
                dispatch(updateUserSuccess(resp.data));
            }, (e: Error) => {
                error(t(`User could not be updated: ${e.message}`));
            });
    };
}

interface DeletionRequest {
    password: string;
}

export function deleteUser(payload: DeletionRequest): Thunk {
    return (dispatch, getState) => {

        let user = getState().auth.user;
        if (user) {
            // https://github.com/mzabriskie/axios/issues/312
            axios<{}>({
                method: "delete",
                url: API.current.usersPath,
                data: payload,
                params: { force: true }
            })
                .then((resp) => {
                    alert("We're sorry to see you go. :(");
                    localStorage.clear();
                    sessionStorage.clear();
                    window.location.href = "/";
                })
                .catch((e: AxiosErrorResponse) => { error(prettyPrintApiErrors(e)); });
        } else {
            throw new Error("Impossible");
        }

    };
}
