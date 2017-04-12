import * as React from "react";
import { ToolsState, Props } from "./interfaces";
import { Col, Row, Page } from "../ui";
import { ToolBayList, ToolBayForm, ToolList, ToolForm } from "./components";
import { connect } from "react-redux";
import { mapStateToProps } from "./state_to_props";

@connect(mapStateToProps)
export class Tools extends React.Component<Props, Partial<ToolsState>> {
  constructor() {
    super();
    this.state = {};
  }

  toggleBays = () => { this.setState({ editingBays: !this.state.editingBays }); }
  toggleTools = () => { this.setState({ editingTools: !this.state.editingTools }); }

  render() {
    let isEditingBays = this.state.editingBays;
    let isEditingTools = this.state.editingTools;
    return <Page className="tools">
      <Row>
        <Col sm={7}>
          {!isEditingBays && <ToolBayList
            toggle={this.toggleBays}
            dispatch={this.props.dispatch}
            getToolByToolSlotUUID={this.props.getToolByToolSlotUUID}
            toolBays={this.props.toolBays}
            getToolSlots={this.props.getToolSlots}
          />}
          {isEditingBays && <ToolBayForm
            toggle={this.toggleBays}
            dispatch={this.props.dispatch}
            toolBays={this.props.toolBays}
            toolSlots={this.props.toolSlots}
            getToolSlots={this.props.getToolSlots}
            getChosenToolOption={this.props.getChosenToolOption}
            getToolOptions={this.props.getToolOptions}
            changeToolSlot={this.props.changeToolSlot}
          />}
        </Col>
        <Col sm={5}>
          {!isEditingTools && <ToolList
            isActive={this.props.isActive}
            toggle={this.toggleTools}
            dispatch={this.props.dispatch}
            tools={this.props.tools}
          />}
          {isEditingTools && <ToolForm
            toggle={this.toggleTools}
            dispatch={this.props.dispatch}
            tools={this.props.tools}
          />}
        </Col>
      </Row>
    </Page>;
  }
}
