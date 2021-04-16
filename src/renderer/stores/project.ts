import { randomUuid } from '@/utils/utils';
import { types } from 'mobx-state-tree';
import { Event } from './events';
import { Group } from './group';
import { EventType, ICurvePoint } from '@/models/richtap';
import { keys, values } from 'mobx';

function sortEvents(events: any) {
  return events
      .sort((a: any, b: any) => (a.relativeTime > b.relativeTime ? 1 : a.relativeTime === b.relativeTime ? 0 : -1))
}

const Project = types
  .model({
    id: types.identifier,
    name: types.string,
    type: types.enumeration(['Basic', 'Stereo']),
    desc: types.optional(types.string, ""),
    events: types.map(Event),
    groups: types.map(Group),
  })
  .views(self => ({
    get groupCount() {
      return self.groups.size;
    },
    get eventCount() {
      return self.events.size;
    },
  }))
  .actions(self => ({
    setName(name: string) {
      self.name = name;
    },
    setDesc(desc: string) {
      self.desc = desc;
    },
    addGroup(name: string): string {
      let id = randomUuid()
      self.groups.set(id, {id: id, name: name , start: 0, events: []});
      return id;
    },
    addToGroup(gid: string, eid: string) {
      if (self.groups.has(gid) && self.events.has(eid)) {
        self.groups.get(gid)?.events.push(eid)
      }
    },
    addTransient(group: string, intensity: number = 100, frequency: number = 50, time?: number) {
      console.log('addTransient', intensity, frequency, time);
      const id = randomUuid();
      const event = Event.create({
        id: id,
        name: 'Transient ' + self.eventCount,
        type: 'Transient',
        relativeTime: time,
        intensity: intensity,
        frequency: frequency,
      })
      self.events.set(id, event)
      if (group !== '' && self.groups.has(group)) {
        this.addToGroup(group, id)
      }
      return id
    },
    addContinuous(group: string, duration: number = 200, intensity: number = 100, frequency: number = 50, time?: number, curve?: Array<ICurvePoint>) {
      console.log('addContinuous', intensity, frequency, time, duration);
      const id = randomUuid();
      const event = Event.create({
        id: id,
        name: 'Continuous ' + self.eventCount,
        type: 'Continuous',
        relativeTime: time,
        duration: duration,
        intensity: intensity,
        frequency: frequency,
        curve: [],
      })
      if (!!curve) {
        curve.map((value: ICurvePoint) => {
          event.addCurvePoint(value.Time, value.Intensity, value.Frequency)
        })
      }
      else {
        event.addCurvePoint(0, 0, 0)
        event.addCurvePoint(1, 1, 0)
        event.addCurvePoint(duration - 1, 1, 0)
        event.addCurvePoint(duration, 0, 0)
      }
      self.events.set(id, event)
      if (group !== '' && self.groups.has(group)) {
        this.addToGroup(group, id)
      }
      return id
    },
    remove(id: string) {
      if (self.events.has(id)) {
        self.events.delete(id)
      }
    },
  }))

const ProjectStore = types
  .model({
    projects: types.map(Project),
  })
  .views(self => ({
    get count() {
      return self.projects.size;
    },
  }))
  .actions(self => ({
    addProject(name: string, type: 'Basic' | 'Stereo') {
      let id = randomUuid()
      if (name === '')
        name = 'Project' + self.count;
      self.projects.set(id, { id: id, name: name, type: type });
      return id
    },
    delProject(id: string) {
      if (self.projects.has(id)) {
        self.projects.delete(id)
      }
    },
  }))

export { Project, ProjectStore };
