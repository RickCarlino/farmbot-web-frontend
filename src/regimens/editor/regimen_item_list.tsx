import * as React from "react";
import { RegimenItem } from "../interfaces";
import * as moment from "moment";
import { duration } from "moment";
import { removeRegimenItem } from "../actions";

interface RegimenItemListProps {
  items: RegimenItem[];
  dispatch: Function;
}

export function RegimenItemList({ items, dispatch }: RegimenItemListProps) {
  let groups = _.groupBy<RegimenItem>(items, function(item: RegimenItem) {
    return Math.round(duration(item.time_offset).asDays());
  });

  let list = _.map(groups, function(innerItems: RegimenItem[], day: string) {
    return <RegimenItemDayGroup day={ day }
                                items={ innerItems }
                                key={ day }
                                dispatch={ dispatch }/>;
  });
  let display = list.length ? list : <EmptyList/>;
  return <div>
    <hr/>
    { display }
  </div>;
}

function EmptyList({}) {
  return <div>
    <p> {__("This regimen doesn't have any items!")} </p>
    <p> <i className="fa fa-arrow-left"/>
    {__("You can add items by using the 'bulk scheduler'")}
    </p>
  </div>;
}

interface RegimenItemStepProps {
  item: RegimenItem;
  dispatch: Function;
}
function RegimenItemStep({ item, dispatch }: RegimenItemStepProps) {
  let d = duration(item.time_offset);
  let time = moment({
    hour: d.hours(),
    minute: d.minutes()
  }).format("h:mm a");
  return <div className="regimen-event">
  <span className="regimen-event-title"> { item.sequence.name } </span>
  <span className="regimen-event-time"> { time } </span>
  <i className="fa fa-trash regimen-control"
     onClick={ () => dispatch(removeRegimenItem(item)) } />
  </div>;
}

interface RegimenItemDayGroupProps {
    day: string;
    items: RegimenItem[];
    dispatch: Function;
}

function RegimenItemDayGroup({ day,
                               items,
                               dispatch }: RegimenItemDayGroupProps) {
    return <div className="regimen-day">
        <label> {__("Day {{daystr}}", {daystr: day })}  </label>
        { items.map(function(item, inx) {
            return <RegimenItemStep item={ item }
                                    key={ inx }
                                    dispatch={ dispatch } />;
        }) }
    </div>;
}
