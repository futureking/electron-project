import * as richtap from "@/../share/data/IRichTap";
import store from "@/stores";

export function addHeToGroup(name: string, obj: richtap.HeV1 | richtap.HeV2, start: number) {
  let pid = store.selection.pid;
  if (pid === '') {
    pid = store.projectStore.addProject('', 'Basic');
    store.selection.setSelection('', pid);
  }
  const gid = store.projectStore.projects.get(pid)!.addGroup(name)
  store.projectStore.projects.get(pid)!.groups.get(gid)!.setStart(start)
  if (obj.Metadata.Version === 1) {
    (obj as richtap.HeV1).Pattern.map((value, index) => {
      switch (value.Event.Type) {
        case richtap.EventType.Transient:
          store.projectStore.projects.get(pid)!.addTransient(
            gid, value.Event.Parameters.Intensity, value.Event.Parameters.Frequency, value.Event.Index, value.Event.RelativeTime
          );
          break;
        case richtap.EventType.Continuous:
          store.projectStore.projects.get(pid)!.addContinuous(
            gid, value.Event.Duration, value.Event.Parameters.Intensity, value.Event.Parameters.Frequency,
            value.Event.Index, value.Event.RelativeTime, value.Event.Parameters.Curve
          );
          break;
      }
    })
  }
  else if (obj.Metadata.Version === 2) {
    (obj as richtap.HeV2).PatternList.map(pattern => {
      const t = pattern.AbsoluteTime
      pattern.Pattern.map(value => {
        switch (value.Event.Type) {
          case richtap.EventType.Transient:
            store.projectStore.projects.get(pid)!.addTransient(
              gid, value.Event.Parameters.Intensity, value.Event.Parameters.Frequency, value.Event.Index, value.Event.RelativeTime + t
            );
            break;
          case richtap.EventType.Continuous:
            store.projectStore.projects.get(pid)!.addContinuous(
              gid, value.Event.Duration, value.Event.Parameters.Intensity, value.Event.Parameters.Frequency,
              value.Event.Index, value.Event.RelativeTime + t, value.Event.Parameters.Curve
            );
            break;
        }
      })
    })
  }
  console.log(store.projectStore.projects.get(pid)!.groupCount)
  console.log(store.projectStore.projects.get(pid)!.eventCount)
}

export function formatHe() {
  const pid = store.selection.pid;
  let pattrenList = new Array<richtap.PatternItem>();
  let meta = new richtap.Metadata(2, (new Date().toLocaleDateString('zh-CN')), 'Export from RichTap Creator Pro');
  let ret = '';
  switch (store.selection.type) {
    case 'Project':
    case '':
      const eventCount = store.projectStore.projects.get(pid)!.eventCount;
      const validEvents = store.projectStore.projects.get(pid)!.sortedValidEvents;
      const validEventCount = validEvents.length;

      const pattrenListCount = Math.ceil(validEventCount / 16);
      let count = 0;
      console.log(`format ${eventCount} events with ${validEventCount} valid into ${pattrenListCount} pattrenList`);

      let eventList: Array<richtap.IEventItem>;
      let absolutetime: number = 0;
      validEvents.map((event) => {
        if (count % 16 === 0) {
          absolutetime = event.relativeTime;
          eventList = new Array<richtap.IEventItem>();
        }
        let curve = new Array<richtap.CurvePoint>();
        if (event.type === 'Continuous' && event.curve !== null) {
          curve = new Array<richtap.CurvePoint>();
          event.curve.map(p => {
            curve!.push(new richtap.CurvePoint(p.time, p.intensity, p.frequency));
          })
        }
        let param = new richtap.Parameters(event.intensity, event.frequency, curve!);
        let e = new richtap.Event(event.type.toLowerCase(), event.relativeTime - absolutetime, event.index, param, event.duration!);

        eventList!.push(new richtap.EventItem(e));
        if (count % 16 === 15 || count === validEventCount - 1) {
          let pattren = new richtap.PatternItem(absolutetime, eventList!);
          pattrenList.push(pattren);
        }
        count++;
      })
      break;
    case 'Group':
      break;
  }
  let he = new richtap.HeV2(meta, pattrenList);
  ret = JSON.stringify(he, (k, v) => {
    if (k === 'Type')
      return richtap.EventType[v].toString().toLowerCase();
    else
      return v;
  }, 4);
  return ret;
}