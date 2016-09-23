import * as React from "react";
import { copy, remove, StepParams } from "./step_tiles";
import { Step, Sequence } from "./interfaces";
import { changeStep } from "./actions";

/** Removes un-executable sequences, such as "self" or unsaved ones */
function filterSequenceList(sequences: Sequence[], sequence: Sequence) {
    let isSaved = (s: Sequence) => !!s.id;
    let notRecursive = (me: Sequence, you: Sequence) => me !== you;
    return sequences
        .filter(function(seq) {
            // Can't function recurseCant use unsaved sequences.
            return isSaved(seq) && notRecursive(sequence, seq);
        });
}

interface SequenceSelectBoxParams {
    dispatch: Function;
    step: Step;
    sequence: Sequence;
    sequences: Sequence[];
    index: number;
}

function SequenceSelectBox({dispatch,
    step,
    sequence,
    sequences,
    index}: SequenceSelectBoxParams) {

    let eligibleSequences: Sequence[] = filterSequenceList(sequences, sequence);

    function iter(seq: Sequence) {
        if (seq.id) {
            return <option value={ seq.id.toString() } key={ seq.id } > { seq.name } </option>;
        } else {
            throw new Error("Sequence must have ID.");
        }
    };

    function change(e: React.FormEvent) {
        let update = {
            command: {
                value: "0",
                operator: ">",
                variable: "time",
                sub_sequence_id: (e.target as any).value
            }
        };
        let newStep = _.assign<{}, Step>({}, step, update);
        dispatch(changeStep(index, newStep));
    };

    let choices = eligibleSequences.map(iter);
    let ssid = step.command.sub_sequence_id;
    let subSeq = _.find(eligibleSequences, (s) => s.id === ssid) || {
        id: ""
    };

    return <select onChange={ change }
        value={ (subSeq.id || "").toString() }>
        <option value="">Pick a sequence (or save a new one) </option>
        { choices }
    </select>;
}

// Execute block was too complex to be kept in step_tiles.tsx.
export function ExecuteBlock({dispatch, step, index, sequence, sequences}: StepParams) {
    // HACK: if_statement is temporarily being called "execute".
    // TODO: Make a "real" execute block.
    return (<div>
        <div className="step-wrapper">
            <div className="row">
                <div className="col-sm-12">
                    <div className="step-header execute-step">
                        <input className="step-label" placeholder="Execute"/>
                        <i className="fa fa-arrows-v step-control" />
                        <i className="fa fa-clone step-control"
                            onClick={ () => copy({ dispatch, step }) } />
                        <i className="fa fa-trash step-control"
                            onClick={ () => remove({ dispatch, index }) } />
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-sm-12">
                    <div className="step-content execute-step">
                        <div className="row">
                            <div className="col-xs-12">
                                <label> {__("Sequence")} </label>
                                <SequenceSelectBox dispatch={dispatch}
                                    step={step}
                                    sequence={sequence}
                                    sequences={sequences}
                                    index={index}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>);
}
