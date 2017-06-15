import { OpenFarm } from "./openfarm";
import { DropDownItem } from "../ui/index";
import { CowardlyDictionary } from "../util";
import {
  TaggedFarmEvent,
  TaggedSequence,
  TaggedRegimen,
  TaggedGenericPointer,
  TaggedPlantPointer,
  TaggedCrop,
} from "../resources/tagged_resources";
import {
  TightlyCoupledFarmEventDropDown
} from "./farm_events/map_state_to_props_add_edit";
import { PlantPointer } from "../interfaces";
import { SlotWithTool } from "../resources/interfaces";

export type BotOriginQuadrant = 1 | 2 | 3 | 4;
export type ZoomLevel =
  | 0.1
  | 0.2
  | 0.3
  | 0.4
  | 0.5
  | 0.6
  | 0.7
  | 0.8
  | 0.9
  | 1;

export function isBotOriginQuadrant(mystery: any):
  mystery is BotOriginQuadrant {
  return [1, 2, 3, 4].includes(mystery);
}

let zoomLevelArray = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];

export function isValidZoomLevel(mystery: any):
  mystery is ZoomLevel {
  return zoomLevelArray.includes(mystery);
}

export interface State {
  legendMenuOpen: boolean;
  showPlants: boolean;
  showPoints: boolean;
  showSpread: boolean;
  showFarmbot: boolean;
}

export interface Props {
  zoomLevel: ZoomLevel;
  dispatch: Function;
  selectedPlant: TaggedPlantPointer | undefined;
  designer: DesignerState;
  hoveredPlant: TaggedPlantPointer | undefined;
  points: TaggedGenericPointer[];
  plants: TaggedPlantPointer[];
  toolSlots: SlotWithTool[];
  crops: TaggedCrop[];
}

export type TimeUnit =
  | "never"
  | "minutely"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly";

export type ExecutableType = "Sequence" | "Regimen";

export interface FarmEvent {
  id?: number | undefined;
  start_time: string;
  end_time?: string | undefined;
  repeat?: number | undefined;
  time_unit: TimeUnit;
  executable_id: number;
  executable_type: ExecutableType;
  readonly calendar?: string[] | undefined;
};

export interface MovePlantProps {
  deltaX: number;
  deltaY: number;
  plant: TaggedPlantPointer;
}

/** OFCrop bundled with corresponding profile image from OpenFarm API. */
export interface CropLiveSearchResult {
  crop: OpenFarm.OFCrop;
  image: string;
}

export interface Crop {
  id?: undefined;
  svg_icon?: string | undefined;
  spread?: number | undefined;
  slug: string;
}

export interface DesignerState {
  selectedPlant: string | undefined;
  hoveredPlant: HoveredPlantPayl;
  botOriginQuadrant: BotOriginQuadrant;
  zoomLevel: ZoomLevel | number;
  cropSearchQuery: string;
  cropSearchResults: CropLiveSearchResult[];
}

export type TaggedExecutable = TaggedSequence | TaggedRegimen;
export type ExecutableQuery = (kind: ExecutableType, id: number) => TaggedExecutable;
export interface AddEditFarmEventProps {
  executableOptions: TightlyCoupledFarmEventDropDown[];
  repeatOptions: DropDownItem[];
  farmEvents: TaggedFarmEvent[];
  regimensById: CowardlyDictionary<TaggedRegimen>;
  sequencesById: CowardlyDictionary<TaggedSequence>;
  farmEventsById: CowardlyDictionary<TaggedFarmEvent>;
  getFarmEvent(): TaggedFarmEvent | undefined;
  formatDate(input: string): string;
  formatTime(input: string): string;
  handleTime(e: React.SyntheticEvent<HTMLInputElement>, currentISO: string): string;
  dispatch: Function;
  findExecutable: ExecutableQuery;
}

/** One CalendarDay has many CalendarOccurrences. For instance, a FarmEvent
 * that executes every 8 hours will create 3 CalendarOccurrences in a single
 * CalendarDay */
export interface CalendarOccurrence {
  sortKey: number;
  timeStr: string;
  executableName: string;
  executableId: number;
  id: number;
}

/** A group of FarmEvents for a particular day on the calendar. */
export interface CalendarDay {
  /** Unix timestamp. Used as a unique key in JSX and for sorting. */
  sortKey: number;
  month: string;
  day: number;
  /** Every event that will execute on that day. */
  items: CalendarOccurrence[];
}

export interface FarmEventProps {
  /** Sorted list of the first (100?) events due on the calendar. */
  calendarRows: CalendarDay[];
  /** Call this function to navigate to different pages. */
  push: (url: string) => void;
}

export interface GardenMapProps {
  showPlants: boolean | undefined;
  showPoints: boolean | undefined;
  showSpread: boolean | undefined;
  showFarmbot: boolean | undefined;
  dispatch: Function;
  designer: DesignerState;
  points: TaggedGenericPointer[];
  plants: TaggedPlantPointer[];
  toolSlots: SlotWithTool[];
  selectedPlant: TaggedPlantPointer | undefined;
  hoveredPlant: TaggedPlantPointer | undefined;
  crops: TaggedCrop[];
}

export interface GardenMapState {
  isDragging: boolean | undefined;
  botOriginQuadrant: BotOriginQuadrant;
  pageX: number | undefined;
  pageY: number | undefined;
}

export interface GardenPlantProps {
  quadrant: BotOriginQuadrant;
  dispatch: Function;
  plant: Readonly<TaggedPlantPointer>;
  selected: boolean;
  dragging: boolean;
  onClick: (plant: Readonly<TaggedPlantPointer>) => void;
}

export interface GardenPlantState {
  icon: string;
}

export interface GardenPointProps {
  quadrant: BotOriginQuadrant;
  point: TaggedGenericPointer;
}

export type PlantOptions = Partial<PlantPointer>;

export interface SpeciesInfoProps {
  cropSearchResults: CropLiveSearchResult[];
}

export interface EditPlantInfoProps {
  push(url: string): void;
  dispatch: Function;
  findPlant(stringyID: string | undefined): TaggedPlantPointer | undefined;
}

export interface DNDSpeciesMobileState {
  isDragging: boolean;
}

export interface DraggableEvent {
  currentTarget: HTMLImageElement;
  dataTransfer: {
    setDragImage: Function;
  };
}

export interface OFSearchProps {
  cropSearchResults: CropLiveSearchResult[];
}

export interface HoveredPlantPayl {
  /* Use UUID here to prevent denormalization? */
  plantUUID: string | undefined;
  icon: string;
}
