import * as React from "react";
import { StepButton } from "./step_buttons/index";
import { t } from "i18next";
import { Farmbot } from "farmbot";
import { smoothScrollToBottom } from "../util";
import { Widget, WidgetHeader, WidgetBody, Row } from "../ui/index";
import { TaggedSequence } from "../resources/tagged_resources";

interface StepButtonProps {
  dispatch: Function;
  current: TaggedSequence | undefined;
}
export function StepButtonCluster({ dispatch, current }: StepButtonProps) {
  const ALL_THE_BUTTONS = [
    <StepButton dispatch={dispatch}
      current={current}
      step={{
        kind: "loop",
        args: {
          sequence_id: 0
        },
        body: []
      }}
      color="gray">
      {t("LOOP")}
    </StepButton>,
    <StepButton dispatch={dispatch}
      current={current}
      step={{
        kind: "move_absolute",
        args: {
          location: {
            kind: "coordinate",
            args: { x: 0, y: 0, z: 0 }
          },
          offset: {
            kind: "coordinate",
            args: {
              x: 0,
              y: 0,
              z: 0
            },
          },
          speed: Farmbot.defaults.speed
        }
      }}
      color="blue">
      {t("MOVE ABSOLUTE")}
    </StepButton>,
    <StepButton dispatch={dispatch}
      current={current}

      step={{
        kind: "move_relative",
        args: { x: 0, y: 0, z: 0, speed: Farmbot.defaults.speed }
      }}
      color="green">
      {t("MOVE RELATIVE")}
    </StepButton>,
    <StepButton dispatch={dispatch}
      current={current}

      step={{
        kind: "write_pin",
        args: { pin_number: 0, pin_value: 0, pin_mode: 0 }
      }}
      color="orange">
      {t("WRITE PIN")}
    </StepButton>,
    <StepButton dispatch={dispatch}
      current={current}

      step={{
        kind: "read_pin",
        args: {
          pin_number: 0,
          pin_mode: 0,
          label: "---"
        }
      }}
      color="yellow">
      {t("READ PIN")}
    </StepButton>,
    <StepButton dispatch={dispatch}
      current={current}

      step={{
        kind: "wait",
        args: { milliseconds: 0 }
      }}
      color="brown">
      {t("WAIT")}
    </StepButton>,
    <StepButton dispatch={dispatch}
      current={current}

      step={{
        kind: "send_message",
        args: {
          message: "Bot is at position {{ x }}, {{ y }}, {{ z }}.",
          message_type: "success"
        }
      }}
      color="red">
      {t("SEND MESSAGE")}
    </StepButton>,
    <StepButton dispatch={dispatch}
      current={current}

      step={{
        kind: "_if",
        args: {
          lhs: "x",
          op: "is",
          rhs: 0,
          _then: { kind: "nothing", args: {} },
          _else: { kind: "nothing", args: {} }
        }
      }}
      color="purple">
      {t("IF STATEMENT")}
    </StepButton>,
    <StepButton dispatch={dispatch}
      current={current}

      step={{
        kind: "execute",
        args: { sequence_id: 0 }
      }}
      color="gray">
      {t("EXECUTE SEQUENCE")}
    </StepButton>,
    <StepButton dispatch={dispatch}
      current={current}
      step={{
        kind: "execute_script",
        args: { label: "plant-detection" }
      }}
      color="pink">
      {t("Run Farmware")}
    </StepButton>,
    <StepButton dispatch={dispatch}
      current={current}
      step={{
        kind: "take_photo",
        args: {}
      }}
      color="pink">
      {t("TAKE PHOTO")}
    </StepButton>
  ];
  return <Widget className="widget-wrapper step-button-cluster-widget">
    <WidgetHeader title="Commands"
      helpText={`These are the most basic commands FarmBot
                  can execute. Drag and drop them to create sequences
                  for watering, planting seeds, measuring soil
                  properties, and more.`}>
    </WidgetHeader>
    <WidgetBody>
      <Row>
        {
          ALL_THE_BUTTONS.map(function (el, inx) {
            return <div key={inx} onClick={
              // Follows user down the page as they add sequences.
              () => { smoothScrollToBottom(); }}>
              {el}
            </div>;
          })
        }
      </Row>
    </WidgetBody>
  </Widget>;
}
