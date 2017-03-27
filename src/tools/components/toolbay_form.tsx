import * as React from "react";
import { ToolBayFormProps } from "../interfaces";
import {
  Widget,
  WidgetBody,
  WidgetHeader,
  Col,
  Row,
  BlurableInput
} from "../../ui";
import { t } from "i18next";
import { TaggedToolSlot } from "../../resources/tagged_resources";
import { edit, destroy, saveAll, initSave } from "../../api/crud";
import { NewFBSelect } from "../../ui/new_fb_select";

export class ToolBayForm extends React.Component<ToolBayFormProps, {}> {
  emptyToolSlot = (tool_bay_id: number): TaggedToolSlot => {
    return {
      uuid: "ERROR: GENERATED BY REDUCER - SHOULD BE UNSEEN",
      kind: "tool_slots",
      body: {
        x: 0,
        y: 0,
        z: 0,
        tool_bay_id
      }
    }
  }

  render() {
    let { toggle, dispatch } = this.props;
    return <div>
      {this.props.toolBays.map(bay => {
        return <Widget key={bay.body.id}>
          <WidgetHeader
            helpText={t(`Toolbays are where you store your FarmBot Tools. Each
              Toolbay has Slots that you can put your Tools in, which should be
              reflective of your real FarmBot hardware configuration.`)}
            title={"ToolBay 1"}>
            <button
              className="gray button-like" onClick={toggle}>
              {t("Back")}
            </button>
            <button
              className="green button-like"
              onClick={() => {
                dispatch(saveAll(this.props.getToolSlots(), () => {
                  toggle();
                }))
              }}>
              {t("Save")}
            </button>
            <button
              className="green button-like"
              onClick={() => {
                dispatch(initSave(this.emptyToolSlot(bay.body.id)));
              }}>
              <i className="fa fa-plus" />
            </button>
          </WidgetHeader>
          <WidgetBody>
            <Row>
              <Col xs={2}>
                <label>{t("Slot")}</label>
              </Col>
              <Col xs={2}>
                <label>{t("X")}</label>
              </Col>
              <Col xs={2}>
                <label>{t("Y")}</label>
              </Col>
              <Col xs={2}>
                <label>{t("Z")}</label>
              </Col>
              <Col xs={3}>
                <label>{t("Tool")}</label>
              </Col>
            </Row>
            {this.props.getToolSlots().map(
              (slot: TaggedToolSlot, index: number) => {
                return <Row key={slot.body.id}>
                  <Col xs={2}>
                    <label>{index + 1}</label>
                  </Col>
                  <Col xs={2}>
                    <BlurableInput
                      value={(slot.body.x || 0).toString()}
                      onCommit={(e) => {
                        dispatch(edit(slot, { x: e.currentTarget.value }));
                      }}
                      type="number"
                    />
                  </Col>
                  <Col xs={2}>
                    <BlurableInput
                      value={(slot.body.y || 0).toString()}
                      onCommit={(e) => {
                        dispatch(edit(slot, { y: e.currentTarget.value }));
                      }}
                      type="number"
                      name="y"
                    />
                  </Col>
                  <Col xs={2}>
                    <BlurableInput
                      value={(slot.body.z || 0).toString()}
                      onCommit={(e) => {
                        dispatch(edit(slot, { z: e.currentTarget.value }));
                      }}
                      type="number"
                    />
                  </Col>
                  <Col xs={3}>
                    <NewFBSelect
                      list={this.props.getToolOptions()}
                      selectedItem={this.props.getChosenToolOption(slot.uuid)}
                      allowEmpty={true}
                      onChange={this.props.changeToolSlot(slot,
                        this.props.dispatch)}
                    />
                  </Col>
                  <Col xs={1}>
                    <button
                      className="red button-like"
                      onClick={() => dispatch(destroy(slot.uuid))}>
                      <i className="fa fa-times" />
                    </button>
                  </Col>
                </Row>;
              })}
          </WidgetBody>
        </Widget>;
      })}
    </div>;
  }
};
