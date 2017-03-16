import * as React from "react";
import { selectSequence, addSequence } from "./actions";
import { Sequence, SequencesListProps, EditorProps } from "./interfaces";
import { t } from "i18next";
import { connect } from "react-redux";
import { Everything } from "../interfaces";
import { isMobile } from "../util";
import { Link } from "react-router";
import { Widget, WidgetHeader, WidgetBody, Row, Col } from "../ui/index";

let buttonList = (dispatch: Function) => (seq: Sequence, index: number) => {
  let css = ["block-wrapper",
    "block",
    "full-width",
    "text-left",
    `${seq.color || "purple"}-block`,
    "block-header"];
  let click = () => { dispatch(selectSequence(index)); };
  if (!isMobile()) {
    return <button key={seq.id || index}
      onClick={click}
      className={css.join(" ")}>
      {seq.name + (seq.dirty ? "*" : "")}
      <i className="fa fa-pencil block-control" />
    </button>;
  } else {
    return <Link
      to={`/app/sequences/${seq.name.replace(" ", "_").toLowerCase()}`}
      key={seq.id || index}
      onClick={click}
      className={css.join(" ")}>
      {seq.name + (seq.dirty ? "*" : "")}
    </Link>;
  }
};

export class SequencesList extends React.Component<EditorProps, {}> {
  render() {
    let { dispatch } = this.props;
    let sequences = this.props.all;
    return <Widget className="sequence-list-widget">
      <WidgetHeader title="Sequences"
        helpText={`Here is the list of all of your sequences.
                   Click one to edit.`}>
        <button className="green button-like"
          onClick={() => dispatch(addSequence())}>
          {t("Add")}
        </button>
      </WidgetHeader>
      <WidgetBody>
        <Row>
          <Col xs={12}>
            {sequences.map(buttonList(dispatch))}
          </Col>
        </Row>
      </WidgetBody>
      <i className="fa fa-plus plus-button"
        onClick={() => dispatch(addSequence())}></i>
    </Widget>;
  }
}
