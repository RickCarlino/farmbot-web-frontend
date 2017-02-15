import * as React from "react";
import { Link } from "react-router";
import { Everything } from "../../interfaces";
import { Select } from "../../ui";
import { connect } from "react-redux";
import { t } from "i18next";
import * as moment from "moment";
import { Option } from "react-select";
import {
  FarmEventExecutableData,
  FarmEvent,
  FinalEventData
} from "../interfaces";
import { CustomOptionProps } from "../../interfaces";

interface FarmEventSelectOption extends Option {
  iso_string: string;
  id: number;
}

interface FarmEventSelectOptionProps extends CustomOptionProps {
  option: {
    iso_string: string;
    id: number;
  };
}

class OptionComponent extends React.Component<FarmEventSelectOptionProps, {}> {
  handleMouseEnter(e: React.SyntheticEvent<HTMLDivElement>) {
    this.props.onFocus(this.props.option, e);
  };

  handleMouseMove(e: React.SyntheticEvent<HTMLDivElement>) {
    if (this.props.isFocused) { return; };
    this.props.onFocus(this.props.option, e);
  };
  render() {
    return <Link to={`/app/designer/farm_events/${this.props.option.id}`}>
      <div className={this.props.className}
        onMouseEnter={this.handleMouseEnter.bind(this)}
        onMouseMove={this.handleMouseMove.bind(this)}>
        <div>
          {this.props.children}
        </div>
        <span className="event-select-date">
          {moment(this.props.option.iso_string).format("MM/DD")}
        </span>
        <span className="event-select-time">
          {moment(this.props.option.iso_string).format("HH:mma")}
        </span>
      </div>
    </Link>;
  }
};

@connect((state: Everything) => state)
export class FarmEvents extends React.Component<Everything, {}> {

  hasPassed(start_time: string) {
    return start_time < new Date().toISOString();
  }

  renderEvents(finalEvents: FarmEventExecutableData[]) {
    { /** FarmEventExecutableData includes FarmEvent with exec `type` */ }
    finalEvents.sort(
      (a: FarmEventExecutableData, b: FarmEventExecutableData) => {
        return (
          a.farm_event_data.start_time > b.farm_event_data.start_time
        ) ? 1 : 0;
      });
    return finalEvents.map((fe: FarmEventExecutableData) => {
      let { id, start_time } = fe.farm_event_data;
      let hasPassed = this.hasPassed(start_time) ? "has-passed" : "";
      return <div className={`farm-event col-xs-12 ${hasPassed}`}
        key={id}>
        <div className="event-time col-xs-3">
          {moment(start_time).format("hh:mma")}
        </div>
        <div className="event-title col-xs-9">
          {fe.executable_data.name || "No name?"}
        </div>
        <Link to={`/app/designer/farm_events/${id}`}>
          <i className="fa fa-pencil-square-o edit-icon"></i>
        </Link>
      </div>;
    });
  }

  render() {
    let farmEvents = this.props.sync.farm_events || [];
    let eventsWithExecutableData: FarmEventExecutableData[] = [];

    /** Merging the data needed from the executable type, refactor? */
    farmEvents.map(
      (farmEvent: FarmEvent) => {
        switch (farmEvent.executable_type) {
          // If type `regimen`
          case "Regimen":
            this.props.regimens.all.map(regimen => {
              // Search all regimens and match id
              if (regimen.id === farmEvent.executable_id) {
                eventsWithExecutableData.push({
                  farm_event_data: farmEvent,
                  executable_data: { name: regimen.name }
                });
              }
            });
            break;
          case "Sequence":
            // If type `sequence`
            this.props.sequences.all.map(sequence => {
              // Search all sequences and match id
              if (sequence.id === farmEvent.executable_id) {
                eventsWithExecutableData.push({
                  farm_event_data: farmEvent,
                  executable_data: { name: sequence.name }
                });
              }
            });
            break;
          default:
            throw new Error("Something went wrong with events.");
        }
      });


    /** Used to hold the search results in select box */
    let selectOptions: FarmEventSelectOption[] = [];

    /** Used to hold the final rendered Date and FarmEvents[] */
    let farmEventsData: FinalEventData[] = [];

    eventsWithExecutableData.map((fe: FarmEventExecutableData) => {
      let { next_time } = fe.farm_event_data;

      selectOptions.push({
        label: fe.executable_data.name,
        value: fe.farm_event_data.id,
        iso_string: fe.farm_event_data.next_time,
        id: fe.farm_event_data.id
      });

      /** We just want to compare the day, month, and year */
      let comparableDate = moment(`${next_time}`)
        .set("minutes", 0)
        .set("hours", 0)
        .toISOString();

      /** If the date isn't in FinalEventData[], push it with FarmEvent */
      if (!!_.find(farmEventsData, { date: comparableDate })) {
        let eventDate = _.findWhere(farmEventsData,
          { date: comparableDate });
        eventDate.finalEvents.push(fe);
      } else {
        farmEventsData.push({
          date: comparableDate,
          finalEvents: [fe]
        });
      }
    });

    /** Sort */
    farmEventsData.sort((a: FinalEventData, b: FinalEventData) => {
      return (a.date > b.date) ? 1 : 0;
    });

    return <div className="panel-container magenta-panel">
      <div className="panel-header magenta-panel">
        <div className="panel-tabs">
          <Link to="/app/designer" className="mobile-only">
            {t("Designer")}
          </Link>
          <Link to="/app/designer/plants">
            {t("Plants")}
          </Link>
          <Link to="/app/designer/farm_events" className="active">
            {t("Farm Events")}
          </Link>
        </div>
      </div>

      <div className="panel-content events">

        <div className="row">
          <i className="col-xs-2 fa fa-calendar"></i>

          <Select className="col-xs-10"
            options={selectOptions}
            optionComponent={OptionComponent} />

          <div className="farm-events row">
            {/** Includes unique date and associated events */}
            {farmEventsData.map((evt: FinalEventData) => {
              return <div className="farm-event-wrapper col-xs-12"
                key={evt.date}>

                <div className="farm-event-date col-xs-2">
                  <div className="farm-event-date-month">
                    {/** i.e. `Feb` */}
                    {/*moment(evt.date).format("MMM")*/}
                    {evt.date.toString()}
                  </div>
                  <div className="farm-event-date-day">
                    {/** i.e. `14` */}
                    {moment(`${evt.date}`).format("DD")}
                  </div>
                </div>

                <div className="col-xs-10 events">
                  {this.renderEvents(evt.finalEvents)}
                </div>
              </div>;
            })}
          </div>
        </div>

        <Link to="/app/designer/farm_events/add">
          <div className="plus-button add-event button-like"
            data-toggle="tooltip" title="Add event">
            <i className="fa fa-2x fa-plus" />
          </div>
        </Link>

      </div>
    </div>;
  }
}
