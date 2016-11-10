import * as React from "react";
import { render } from "react-dom";
import { detectLanguage } from "../i18n";
import { FrontPage } from "./front_page";
import * as i18next from "i18next";
import "../css/index.scss";

detectLanguage().then((config) => {
    i18next.init(config, (err, t) => {
        let node = document.createElement("DIV");
        node.id = "root";
        document.body.appendChild(node);

        let reactElem = React.createElement(FrontPage, {});
        let domElem = document.getElementById("root");

        if (domElem) {
            render(reactElem, domElem);
        } else {
            throw new Error(t("Add a div with id `root` to the page first."));
        };
    });
});
