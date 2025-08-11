import { Inngest } from "inngest";

// Create a client to send and receive events
export const inngest = new Inngest({
  id: "ai-therapy-agent",
  eventKey:
    "dA5UuoXog5-5cCs1p5NRJN3A_1jsnDIBkS2uIUskh3mtVWfqdkTNwq1mnhd6p9mHv-wQ4tju_6T3EdYF4B3Wsg",
});

// Create an empty array where we'll export future Inngest functions
export const functions = [];
