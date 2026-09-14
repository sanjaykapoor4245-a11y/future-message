import { PocketIc } from "@dfinity/pic";
import { afterAll, beforeAll, expect, it } from "vitest";

import { idlFactory } from "../../src/frontend/src/declarations/backend.did.js";
import type { _SERVICE } from "../../src/frontend/src/declarations/backend.did";

const PIC_URL = process.env.POCKET_IC_URL ?? "";
const BACKEND_WASM = process.env.BACKEND_WASM ?? "";

let pic: PocketIc | undefined;
let actor: _SERVICE;

beforeAll(async () => {
  pic = await PocketIc.create(PIC_URL);
  ({ actor } = await pic.setupCanister<_SERVICE>({ idlFactory, wasm: BACKEND_WASM }));
});

afterAll(async () => {
  await pic?.tearDown();
});

it("answers an empty-state read instead of trapping", async () => {
  await expect(actor.listCapsules()).resolves.toEqual([]);
});

it("rejects an empty message instead of trapping", async () => {
  const future = BigInt(Date.now() + 60_000) * 1_000_000n;
  await expect(actor.createCapsule("Title", "", future)).rejects.toThrow();
});

it("rejects a past unlock time instead of trapping", async () => {
  // The canister's Time.now() lags the host clock in this PocketIC environment
  // (a host-relative "1 day ago" still read as future), so use a timestamp that
  // is unambiguously in the past for any real canister clock.
  const past = BigInt(Date.UTC(2000, 0, 1)) * 1_000_000n;
  await expect(actor.createCapsule("Title", "message", past)).rejects.toThrow();
});

it("round-trips a capsule through the real canister", async () => {
  const future = BigInt(Date.now() + 60_000) * 1_000_000n;
  const created = await actor.createCapsule("Graduation", "You made it!", future);
  expect(created.title).toBe("Graduation");
  expect(created.message).toBe("You made it!");
  expect(created.unlockAt).toBe(future);

  const listed = await actor.listCapsules();
  expect(listed).toContainEqual(expect.objectContaining({ id: created.id, title: "Graduation" }));

  const fetched = await actor.getCapsule(created.id);
  expect(fetched).toEqual([created]);
});
