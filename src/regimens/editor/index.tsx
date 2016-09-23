import * as React from "react";
import { RegimensState } from "../interfaces";
import { SaveButton } from "./save_button";
import { DeleteButton } from "./delete_button";
import { EmptyEditor } from "./empty_editor";
import { ActiveEditor } from "./active_editor";
import { AuthState } from "../../auth/interfaces";

interface RegimenEditorWidgetProps {
  regimens: RegimensState;
  dispatch: Function;
  auth: AuthState;
}
export function RegimenEditorWidget({regimens, dispatch, auth}: RegimenEditorWidgetProps) {
  let regimen = regimens.all[regimens.current];
  let Wow = regimen ? ActiveEditor : EmptyEditor;
  let saveButtenProps = {
    dispatch,
    regimen,
    token: auth.token,
    baseUrl: auth.iss
  };
  return (<div>
    <div className="widget-wrapper regimen-editor-widget">
      <div className="row">
        <div className="col-sm-12">
          <SaveButton regimen={regimen}
            dispatch={dispatch}
            url={auth.iss} />
          <DeleteButton {...saveButtenProps} />
          <div className="widget-header">
            <h5>Regimen Editor</h5>
            <i className="fa fa-question-circle widget-help-icon">
              <div className="widget-help-text">
              {__(`
                Regimens allow FarmBot
                to take care of a plant throughout its entire life. A
                regimen consists of many sequences that are scheduled to run
                based on the age of the plant. Regimens are applied to
                plants from the farm designer and can be re-used on many
                plants growing at the same or different times. Multiple
                regimens can be applied to any one plant. Coming soon: Regimens!
                `)}
              </div>
            </i>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-12">
          <div className="widget-content">
            <Wow regimen={regimen} dispatch={dispatch} />
          </div>
        </div>
      </div>
    </div>
  </div>);

}
