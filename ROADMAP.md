# Roadmap

Paradox is being repositioned around a simpler idea:

> The batteries I wish vanilla JavaScript came with.

That means this iteration is not about building a framework, a component runtime, or a full application architecture. It is about providing a focused set of utilities that remove repetitive browser work while staying close to the platform.

## Where We Are

Paradox already has a few useful primitives:

- `buildElement` for DOM creation
- `Router` for simple route matching
- `pubsub` for lightweight event distribution
- `buildApp` as an early experiment in reactive rendering

The main gap is not a lack of features. The gap is product direction and polish. Right now the project mixes "utility library" ideas with "mini framework" ideas, and that makes the roadmap harder than it needs to be.

## What We Are Leaving Behind

The previous roadmap had a few items that do not fit the current direction, or should be rethought before more work happens:

- Drop "state management support" as a roadmap goal for this iteration
- Drop "reactive components" as a positioning goal
- Drop "add submodules to the Paradox namespace" as a goal by itself
- Treat `buildApp` as experimental until its purpose is redefined
- Replace vague roadmap items with outcome-based work

These ideas are not forbidden forever, but they are not the right center of gravity if Paradox is meant to stay vanilla-first and lightweight.

## Principles For This Iteration

- Stay close to platform APIs
- Prefer small composable utilities over app-wide abstractions
- Make common DOM tasks easier without hiding how the browser works
- Be safe to adopt incrementally in existing projects
- Keep the public API small and well documented

## Current Iteration Goals

## 1. Core Identity And Packaging

- [x] Update README, package metadata, and examples to describe Paradox as a vanilla JavaScript utility library
- [x] Define which APIs are stable, experimental, or internal
- [x] Publish a modern package shape for current tooling
- [ ] Remove or hide deep-import expectations from the docs

## 2. DOM Utilities

- [ ] Refine `buildElement` into a dependable DOM helper instead of a pseudo-component system
- [ ] Support modern attribute ergonomics consistently
- [ ] Support multiple event handlers predictably
- [ ] Improve typing for element options and child nodes
- [ ] Add tests for real-world DOM creation cases

## 3. Router

- [ ] Make `Router` explicitly useful for simple SPA navigation
- [ ] Fix route re-entry, param reset, and navigation lifecycle issues
- [ ] Add support for link interception and `popstate`
- [ ] Document the intended scope of the router so it stays intentionally small

## 4. PubSub And Small Utilities

- [ ] Add `once` to `pubsub`
- [ ] Add `clear` to `pubsub`
- [ ] Tighten typing and behavior around wildcard subscriptions
- [ ] Add a small `utils` module only for truly general-purpose helpers
- [ ] Re-evaluate `debounce` and `throttle` once module boundaries are defined

## 5. Documentation And Examples

- [ ] Replace framework-like language in the docs
- [ ] Add examples that show incremental adoption in plain HTML or simple apps
- [ ] Turn the example app into a showcase of utilities, not a pseudo-framework demo
- [ ] Add guidance on when Paradox is a good fit and when it is not

## 6. Testing And Quality

- [ ] Run tests from source instead of compiled output
- [ ] Add coverage for `buildApp` if it remains public
- [ ] Add integration tests for router navigation and DOM behavior
- [ ] Add release and changelog automation only after the public API is clearer

## Experimental Track

`buildApp` does not currently match the new positioning well enough to be a headline feature. For now, the plan is:

- [ ] Decide whether `buildApp` becomes a tiny reactive helper, an internal experiment, or is removed from the main API
- [ ] Do not expand it with framework features until that decision is made

## Definition Of Success

This iteration will be successful if Paradox becomes:

- Easy to understand in five minutes
- Useful without requiring architectural buy-in
- Reliable for DOM, routing, and event utility work
- Small enough that vanilla JavaScript developers still feel at home
