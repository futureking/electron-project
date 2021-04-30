interface IMetadata {
  Created: string;
  Description: string;
  Version: number;
}
enum EventType {
  'Transient',
  'Continuous'
}
interface ICurvePoint {
  Time: number;
  Intensity: number;
  Frequency: number;
}
interface IParameters {
  Intensity: number;
  Frequency: number;
  Curve?: Array<ICurvePoint>;
}
interface IEvent {
  Type: EventType;
  RelativeTime: number;
  Duration?: number;
  Index: number;
  Parameters: IParameters;
}
interface IEventItem {
  Event: IEvent
}
interface IHeV1 {
  Metadata: IMetadata;
  Pattern: Array<IEventItem>;
}

interface IPatternItem {
  AbsoluteTime: number;
  Pattern: Array<IEventItem>;
}

interface IHeV2 {
  Metadata: IMetadata;
  PatternList: Array<IPatternItem>;
}

class Metadata implements IMetadata {
  Version: number
  Created: string
  Description: string

  constructor(version: number, created: string, description: string) {
    this.Version = version;
    this.Created = created;
    this.Description = description;
  }
}

class EventItem implements IEventItem {
  Event: IEvent
  constructor(event: IEvent) {
    this.Event = event;
  }
}

class Event implements IEvent {
  Type: EventType;
  RelativeTime: number;
  Duration?: number;
  Parameters: IParameters;
  Index: number;
  constructor(type: string, relativeTime: number, index: number, parameters: IParameters, duration?: number) {
    if (type === 'transient')
      this.Type = EventType.Transient
    else if (type === 'continuous') {
      this.Type = EventType.Continuous
      this.Duration = duration
    }
    else
      this.Type = EventType.Continuous
    this.Index = index
    this.RelativeTime = relativeTime
    this.Parameters = parameters
  }
}

class Parameters implements IParameters {
  Intensity: number;
  Frequency: number;
  Curve?: Array<ICurvePoint>;
  constructor(intensity: number, frequency: number, curve?: Array<ICurvePoint>) {
    this.Intensity = intensity;
    this.Frequency = frequency;
    if (!!curve)
      this.Curve = curve;
  }
}

class CurvePoint implements ICurvePoint {
  Time: number;
  Intensity: number;
  Frequency: number;
  constructor(time: number, intensity: number, frequency: number) {
    this.Time = time;
    this.Intensity = intensity;
    this.Frequency = frequency;
  }
}

class HeV1 implements IHeV1 {
  Metadata: IMetadata;
  Pattern: Array<IEventItem>;
  constructor(metadata: IMetadata, pattern: Array<IEventItem>) {
    this.Metadata = metadata;
    this.Pattern = pattern;
  }
}

class PatternItem implements IPatternItem {
  AbsoluteTime: number;
  Pattern: Array<IEventItem>;

  constructor(time: number, pattern: Array<IEventItem>) {
    this.AbsoluteTime = time;
    this.Pattern = pattern;
  }
}

class HeV2 implements IHeV2 {
  Metadata: IMetadata;
  PatternList: Array<IPatternItem>;
  constructor(metadata: IMetadata, patternList: Array<IPatternItem>) {
    this.Metadata = metadata;
    this.PatternList = patternList;
  }
}


export { EventType, IMetadata, Metadata, IEventItem, EventItem, IEvent, Event, IParameters, Parameters, ICurvePoint, CurvePoint, IPatternItem, PatternItem, IHeV1, HeV1, IHeV2, HeV2 };
