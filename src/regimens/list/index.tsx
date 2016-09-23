import * as React from "react";
import { RegimenListItem } from "./regimen_list_item";
import { Everything } from "../../interfaces";
import { AddRegimen } from "./add_button";

export function RegimensList(props: Everything) {
    return <div>
              <div className="widget-wrapper regimens-widget">
                <div className="row">
                  <div className="col-sm-12">
                    <div className="main-nav-button">
                      <button className="navbar-toggle hidden-sm hidden-md hidden-lg"
                              data-target="#navbar"
                              data-toggle="collapse"
                              type="button">
                        <span className="glyphicon glyphicon-menu-hamburger" />
                      </button>
                    </div>
                    <AddRegimen dispatch={ props.dispatch } />
                    <div className="widget-header">
                      <h5> {__("Regimens")} </h5>
                      <i className="fa fa-question-circle widget-help-icon">
                        <div className="widget-help-text">
                        {__("This is a list of all of your regimens. Coming soon: Regimens, and regimen cloning!")}
                        </div>
                      </i>
                    </div>
                  </div>
                </div>
                <div className="widget-content no-bottom-padding">
                  <div className="row">
                    <div className="col-sm-12">
                      <div>
                        { props
                            .regimens
                            .all
                            .map((regimen, inx) => <RegimenListItem
                                                 dispatch={ props.dispatch }
                                                 regimen={ regimen }
                                                 index={inx}
                                                 key={inx} />)
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>;
}
