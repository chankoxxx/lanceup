"use client";
import { useEffect } from "react";
import { canTrackLead, track } from "@/lib/tracking";
export function ThanksTracker(){useEffect(()=>{if(canTrackLead(sessionStorage))track("lead_complete")},[]);return null;}
