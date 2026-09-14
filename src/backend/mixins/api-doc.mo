mixin () {
  public query func getApiDoc() : async Text {
    "# Future Message — Backend API\n" #
    "\n" #
    "This canister powers the **Future Message** app: users write a message, choose a\n" #
    "future unlock date/time, and save it as a locked time capsule. Before the unlock\n" #
    "time the message is hidden; after it, the message is revealed. The backend stores\n" #
    "capsules and exposes them through a small CRUD-style API plus an OQL query layer\n" #
    "for the Caffeine Data Intelligence agent.\n" #
    "\n" #
    "## Public methods\n" #
    "\n" #
    "### Capsules\n" #
    "\n" #
    "- `createCapsule(title : Text, message : Text, unlockAt : Int) : async Capsule`\n" #
    "  Creates a new time capsule and returns it. `unlockAt` must be in the future\n" #
    "  (greater than the current time) and `message` must be non-empty; otherwise the\n" #
    "  call traps. The capsule is assigned the next sequential id.\n" #
    "- `listCapsules() : async [Capsule]` — Returns every stored capsule, in no\n" #
    "  guaranteed order.\n" #
    "- `getCapsule(id : Nat) : async ?Capsule` — Returns the capsule with the given\n" #
    "  id, or `null` if no such capsule exists.\n" #
    "\n" #
    "### Authorization\n" #
    "\n" #
    "- `assignCallerUserRole(role : UserRole) : async ()` — Assigns a role to the\n" #
    "  caller. Admin-only internally.\n" #
    "- `getCallerUserRole() : async UserRole` — Returns the caller's current role.\n" #
    "- `isCallerAdmin() : async Bool` — Returns whether the caller is an admin.\n" #
    "\n" #
    "### OQL (Data Intelligence)\n" #
    "\n" #
    "- `schema() : async Text` — Returns the OQL schema for the queryable entities.\n" #
    "- `execute(query : Text) : async Text` — Executes an OQL JSON query against the\n" #
    "  queryable entities.\n" #
    "\n" #
    "### Documentation\n" #
    "\n" #
    "- `getApiDoc() : async Text` — This document.\n" #
    "\n" #
    "## Types\n" #
    "\n" #
    "- `Capsule = { id : Nat; title : Text; message : Text; unlockAt : Int }`\n" #
    "- `UserRole = { #admin; #user; #guest }`\n" #
    "\n" #
    "## Authentication and authorization\n" #
    "\n" #
    "The app uses Internet Identity. The first authenticated user to sign in through\n" #
    "the app's frontend automatically becomes the admin; no token or secret is\n" #
    "required. Anonymous (not signed in) callers are treated as guests.\n" #
    "\n" #
    "The capsule endpoints (`createCapsule`, `listCapsules`, `getCapsule`) do **not**\n" #
    "require a signed-in caller — they are open to any caller, including anonymous\n" #
    "ones. The authorization endpoints (`assignCallerUserRole`, `getCallerUserRole`,\n" #
    "`isCallerAdmin`) come from the authorization mixin and behave as described\n" #
    "above; `assignCallerUserRole` is admin-only.\n" #
    "\n" #
    "The app's frontend pins an Internet Identity derivation origin, published at\n" #
    "`/.well-known/ii-derivation-origin` when available. An agent already holding the\n" #
    "user's Internet Identity authorization derives the correct per-app principal\n" #
    "against that origin, for example `icp identity link web <name> --app <host>`.\n" #
    "Such a delegation acts with the user's full authority in this app until it\n" #
    "expires.\n" #
    "\n" #
    "Registration happens only when a caller signs in through the app's own frontend.\n" #
    "A principal that never did so is unregistered even when it belongs to the app's\n" #
    "owner, and a signed-in caller derived against a different origin is a different\n" #
    "principal than the one the frontend registered.\n" #
    "\n" #
    "## Units and encodings\n" #
    "\n" #
    "- `unlockAt` is an `Int` in **nanoseconds since the Unix epoch** (the same unit\n" #
    "  as `Time.now()`). Compare it against the current time to decide whether a\n" #
    "  capsule is unlocked.\n" #
    "- `id` is a `Nat` assigned sequentially starting at 0.\n" #
    "- `title` and `message` are plain UTF-8 `Text`.\n" #
    "- `getCapsule` returns `?Capsule`; `null` means the id does not exist.\n" #
    "- `UserRole` is a variant: `#admin`, `#user`, or `#guest`.\n" #
    "\n" #
    "## Lifecycle and polling\n" #
    "\n" #
    "A capsule is **locked** while `unlockAt > Time.now()` and **unlocked** once\n" #
    "`unlockAt <= Time.now()`. The backend stores the message regardless of lock\n" #
    "state; it is the client's responsibility to hide the message until the unlock\n" #
    "time. To show a countdown, poll `getCapsule(id)` (or `listCapsules()`) and\n" #
    "recompute the remaining time from `unlockAt`. There is no server push; poll at\n" #
    "a reasonable interval (for example once per second for a countdown).\n" #
    "\n" #
    "## Mutation retry safety and idempotency\n" #
    "\n" #
    "`createCapsule` is **not** idempotent: each successful call creates a new\n" #
    "capsule with a fresh id and increments the internal counter. Retrying a call\n" #
    "that already succeeded (for example after a network timeout) creates a\n" #
    "duplicate capsule. There is no edit or delete endpoint, so a created capsule\n" #
    "cannot be removed or modified.\n" #
    "\n" #
    "## Errors, traps, and limits\n" #
    "\n" #
    "- `createCapsule` traps if `message` is empty or if `unlockAt` is not strictly\n" #
    "  in the future.\n" #
    "- `getCapsule` returns `null` for an unknown id rather than trapping.\n" #
    "- `assignCallerUserRole` traps for non-admin callers.\n" #
    "- There is no pagination; `listCapsules` returns all capsules in one response.\n" #
    "\n" #
    "## Non-obvious gotchas\n" #
    "\n" #
    "- The capsule endpoints are unauthenticated by design (demo/local data). Do not\n" #
    "  rely on them for access control.\n" #
    "- `unlockAt` is nanoseconds, not milliseconds or seconds — convert carefully\n" #
    "  when building a countdown from a wall-clock date.\n" #
    "- Capsules cannot be edited or deleted once created.\n" #
    "- The OQL `capsule` entity is `controllerOnly`: end users cannot query it\n" #
    "  directly; only the platform controller (the Data Intelligence agent) reads it."
  };
};
