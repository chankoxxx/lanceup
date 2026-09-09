declare global{interface Window{dataLayer?:unknown[];gtag?:(...args:unknown[])=>void}}
export type TrackingEvent="page_view"|"check_start"|"check_step_complete"|"form_submit"|"lead_complete";
export function track(event:TrackingEvent,params:Record<string,unknown>={}){if(typeof window==="undefined")return;window.dataLayer=window.dataLayer||[];window.dataLayer.push({event,...params});if(!window.gtag)window.gtag=(...args:unknown[])=>window.dataLayer?.push(args);window.gtag("event",event,params)}
export function canTrackLead(storage:Pick<Storage,"getItem"|"removeItem">){const allowed=storage.getItem("lead_completed")==="true";if(allowed)storage.removeItem("lead_completed");return allowed}
