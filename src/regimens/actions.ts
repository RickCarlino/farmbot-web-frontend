import { Regimen, RegimenItem } from "./interfaces";
import { ReduxAction } from "../interfaces";
import { warning, success, error } from "../logger";
import * as Axios from "axios";
import { regimenSerializer } from "./serializers";

const REGIMEN_URL = "/api/regimens/";

export function editRegimen(regimen: Regimen,
  update: Object):
  ReduxAction<{ regimen: Regimen, update: Object }> {
  return {
    type: "EDIT_REGIMEN",
    payload: {
      regimen,
      update
    }
  };
}

export function saveRegimen(regimen: Regimen, baseUrl: string) {
  return function (dispatch: Function) {
    dispatch({
      type: "SAVE_REGIMEN_START",
      payload: regimen
    });

    const action = regimen.id ? Axios.put : Axios.post;
    return action<Regimen>(baseUrl + REGIMEN_URL + (regimen.id || ""),
      regimenSerializer(regimen))
      .then(function(resp) {
        success(__("Regimen saved."));
        dispatch(saveRegimenOk(resp.data));
      })
      .catch(err => dispatch(saveRegimenErr(err)));
  };
}

function saveRegimenOk(regimen: Regimen) {
  return { type: "SAVE_REGIMEN_OK", payload: regimen };
}

function saveRegimenErr(payload: Error) {
  error(__("Unable to save regimen."));
}

export function deleteRegimen(regimen: Regimen, baseUrl: string) {
  return function (dispatch: Function) {
    if (regimen && regimen.id) {
      let url = baseUrl + REGIMEN_URL + regimen.id;

      Axios.delete<Regimen>(url)
           .then(function(resp) {
             dispatch(deleteRegimenOk(regimen));
            })
           .catch(function(error) {
             deleteRegimenErr(error);
            });
    } else {
      dispatch(deleteRegimenOk(regimen));
    };
  };
}

function deleteRegimenOk(payload: Regimen) {
  success(__("Regimen deleted."));
  return {
    type: "DELETE_REGIMEN_OK",
    payload
  };
}

function deleteRegimenErr(payload: Error) {
  error(__("Unable to delete regimen."));
}

export function newRegimen(): ReduxAction<{}> {
  return {
    type: "NEW_REGIMEN",
    payload: {}
  };
}

export function selectRegimen(index: number): ReduxAction<number> {
  return {
    type: "SELECT_REGIMEN",
    payload: index
  };
}

export function removeRegimenItem(item: RegimenItem): ReduxAction<RegimenItem> {
  return {
    type: "REMOVE_REGIMEN_ITEM",
    payload: item
  };
}

export function fetchRegimens(apiUrl: string) {
  return function (dispatch: Function) {
    return Axios
      .get<Regimen[]>(apiUrl + REGIMEN_URL)
      .then(r => dispatch({
        type: "FETCH_REGIMENS_OK",
        payload: r.data
      }))
      .catch(e => {
        warning("Could not download regimens.");
        dispatch({
          type: "FETCH_REGIMENS_ERR",
          payload: e
        });
      });
  };
};
