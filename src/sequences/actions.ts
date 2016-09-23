import * as axios from "axios";
import { Everything, Thunk } from "../interfaces"
import { AuthState } from "../auth/interfaces";
import { SequenceOptions,
         Step,
         UnplacedStep,
         Sequence,
         SequenceReducerState } from "./interfaces";
import { success, error } from "../logger";
import { randomColor } from "../util";


export function nullSequence(): Sequence {
  return {
    color: randomColor(),
    name: "New Sequence",
    steps: [],
    dirty: false
  };
}
function fetchSequencesNo(err: Error) {
  return {
    type: "FETCH_SEQUENCE_NO",
    payload: {}
  };
}

export interface FetchSequencesOk {
  type: "FETCH_SEQUENCES_OK";
  payload: Array<Sequence>;
};

function fetchSequencesOk(sequences: Array<Sequence>): FetchSequencesOk {
  return {
    type: "FETCH_SEQUENCES_OK",
    payload: sequences
  };
}

export function fetchSequences() {
  return (dispatch: Function, getState: Function) => {
    let state: AuthState = getState().auth;
    let { iss } = state;
    axios.get<Sequence[]>(`${iss}/api/sequences`)
      .then(({data}) => {
        dispatch(fetchSequencesOk(data));
      }, (e: Error) => {
        error(__("Could not download sequences"));
        dispatch(fetchSequencesNo(e));
      });
  };
};

export interface EditCurrentSequence {
  type: "EDIT_CURRENT_SEQUENCE";
  payload: {
    name?: String;
  };
};

export function editCurrentSequence(updates: SequenceOptions): EditCurrentSequence {
  return {
    type: "EDIT_CURRENT_SEQUENCE",
    payload: updates
  };
}

export interface PushStep {
  type: "PUSH_STEP";
  payload: {
    step: UnplacedStep;
  };
}

export function pushStep(step: UnplacedStep): PushStep {
  return {
    type: "PUSH_STEP",
    payload: {step}
  };
}

type CHANGE_STEP = "CHANGE_STEP";
export interface ChangeStep {
  type: CHANGE_STEP;
  payload: {
    step: Step;
    index: number;
  };
}

export function changeStep(index: number, step: Step): ChangeStep {
  return {
    type: "CHANGE_STEP",
    payload: {step, index}
  };
}

export interface RemoveStep {
  type: "REMOVE_STEP";
  payload: {
    index: number;
  };
};

export function removeStep(index: number): RemoveStep {
  return {
    type: "REMOVE_STEP",
    payload: {index}
  };
}

export function saveSequence(sequence: Sequence): Thunk {
  return function(dispatch, getState) {
    let state: AuthState = getState().auth;
    let { iss} = state;
    let url = `${iss}/api/sequences/`;
    let method: Function;
    if (sequence.id) {
      url += sequence.id;
      method = axios.put;
    } else {
      method = axios.post;
    };
    return method(url, sequence)
    .then(function(resp: {data: Sequence; }) {
      let seq: Sequence = resp.data;
      success(`Saved ${("'" + seq.name + "'") || "sequence"}`);
      dispatch(saveSequenceOk(resp.data));
    },
    function(err: { data: Error; }) {
      let msg: string = _.values(err.data).join("\n");
      error(`Unable to save ${ ("'" + sequence.name + "'") }.` + msg);
      dispatch(saveSequenceNo(error));
    });
  };
};

export interface SaveSequenceOk {
  type: string;
  payload: Sequence;
}
export function saveSequenceOk(sequence: Sequence) {
  return {
    type: "SAVE_SEQUENCE_OK",
    payload: sequence
  };
}

export function saveSequenceNo(error: any) {
  return {
    type: "SAVE_SEQUENCE_NO",
    payload: error
  };
}

export interface SelectSequence {
  type: "SELECT_SEQUENCE";
  payload: number;
};

export function selectSequence(index: number): SelectSequence {
  return {
    type: "SELECT_SEQUENCE",
    payload: index
  };
}

export function addSequence() {
  return {
    type: "ADD_SEQUENCE",
    payload: {}
  };
}

export function deleteSequence(index: number) {
  // use cases: 
  // unsaved sequence. (in state)
  // saved sequence  (http DELETE)
  // misc errors 
  // dependency error. 

  return function(dispatch: Function, getState: Function){
    let state: Everything = getState();
    let { iss } = state.auth;
    let sequence: Sequence = state.sequences.all[index];

    function deleteSequenceOK() {
      dispatch( {
        type: "DELETE_SEQUENCE_OK",
        payload: sequence
      });
    }

    interface SequenceApiResponse {
      sequence?: string;
    }
    function deleteSequenceErr(response: Axios.AxiosXHR<SequenceApiResponse> ) {
      if (response && response.data.sequence ) {
        error(response.data.sequence);
      } else {
        error(__("Unable to delete sequence"));
      }
    }

    if (sequence.id) {
      let url = `${iss}/api/sequences/` + sequence.id;
      axios.delete(url)
        .then(deleteSequenceOK)
        .catch(deleteSequenceErr);
    }else {
      // Sequence is unsaved.
      deleteSequenceOK();
    }
  };
}
