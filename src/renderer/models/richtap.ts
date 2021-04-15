export interface IMetadata {
  Created: string;
  Description: string;
  Version: number;
}
export enum EventType {
  'Transient',
  'Continuous',
}
export interface ICurvePoint {
  Time: number;
  Intensity: number;
  Frequency: number;
}
export interface IParameters {
  Intensity: number;
  Frequency: number;
  Curve?: Array<ICurvePoint>;
}
export interface IEvent {
  Type: EventType;
  RelativeTime: number;
  Duration?: number;
  Index: number;
  Parameters: IParameters;
}
export interface IEventItem {
  Event: IEvent;
}
export interface IHeV1 {
  Metadata: IMetadata;
  Pattern: Array<IEventItem>;
}
export interface IPatternItem {
  AbsoluteTime: number;
  Pattern: Array<IEventItem>;
}

export interface IHeV2 {
  Metadata: IMetadata;
  PatternList: Array<IPatternItem>;
}
