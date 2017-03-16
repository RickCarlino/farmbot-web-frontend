import * as React from "react";
import { SequencesList } from "./sequences_list";
import { StepButtonCluster } from "./step_button_cluster";
import { SequenceEditorMiddle } from "./sequence_editor_middle";
import { MobileSequencesNav } from "./mobile_nav";
import { connect } from "react-redux";
import { Everything } from "../interfaces";
import { isMobile } from "../util";
import { Page, Col } from "../ui/index";
import { EditorProps } from "./interfaces";
import { mapStateToProps } from "./map_state_to_props";

@connect(mapStateToProps)
export class Sequences extends React.Component<EditorProps, {}> {
  maybeRenderMobile = () => {
    return isMobile() && <MobileSequencesNav
      sequenceName={this.props.current.name} />;
  }
  render() {
    return <Page className="sequences">
      <Col xs={4} md={3}>
        <StepButtonCluster dispatch={this.props.dispatch} />
      </Col>
      <Col xs={8} md={6}>
        <SequenceEditorMiddle { ...this.props } />
      </Col>
      {this.maybeRenderMobile()}
      <Col xs={12} md={3}>
        <SequencesList { ...this.props } />
      </Col>
    </Page>;
  }
};
