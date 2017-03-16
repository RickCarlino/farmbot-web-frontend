import * as React from "react";
import * as _ from "lodash";
import { MobileSequencesNavProps } from "./interfaces";

export function MobileSequencesNav(props: MobileSequencesNavProps) {
  return <div className="mobile-only sequences-mobile-nav col-md-3 col-sm-12">
    <div className="widget-wrapper">
      <div className="widget-header">
        <a href="javascript:history.back()" className="back-arrow">
          <i className="fa fa-arrow-left"></i>&nbsp;&nbsp;
          {_.capitalize((props.sequenceName || "Name not found").toString())}
        </a>
      </div>
    </div>
  </div>;
}
