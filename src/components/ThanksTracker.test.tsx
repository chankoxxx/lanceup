import { render, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { ThanksTracker } from "./ThanksTracker";

describe("ThanksTracker",()=>{
  beforeEach(()=>{sessionStorage.clear();window.dataLayer=[];});
  it("does not fire a conversion on direct access",async()=>{render(<ThanksTracker/>);await waitFor(()=>expect(window.dataLayer).toEqual([]));});
  it("fires lead_complete once after successful submission",async()=>{sessionStorage.setItem("lead_completed","true");render(<ThanksTracker/>);await waitFor(()=>expect(window.dataLayer).toContainEqual({event:"lead_complete"}));expect(sessionStorage.getItem("lead_completed")).toBeNull();});
});
