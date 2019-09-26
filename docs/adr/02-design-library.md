# Use a design library

## Status

Approved

## Context

### Problem

1. We want to provide a good design out-of-the-box, so that users of the library do not feel obligated to override it
2. Nobody in the core team is a professional designer
3. Implementing a design is expensive (especially accounting for browser compatibility)
4. We want to make it as easy as possible to override the design (for users of the library) and to use it (for contributors)

### Options

1. Find a designer, implement their design

- This is expensive (in designer time and dev time)
- Any future requirement has to involve a designer

2. Use a component library

- Cheaper (no designer time, no design implementation time)
- Hard to find a library that everyone agrees on
- Potential bloat
- Opinionated libraries won't make it easy to override the design for users of nestjs-admin

### Component library options

1. Bootstrap 4

**Pros:**

- Well-known by devs
  - Easy for contributors
  - Easy to extend for nestjs-admin users
- Good accessibility
- Good browser compatibility
- Lots of UI widgets available
  - We probably won't use them, but nestjs-admin users might (when we support custom widget for form input)
- Easy customization through SCSS variables
- High-level components (list group, navs, page header...)
- Well maintained

**Cons:**

- Not liked a lot by devs
- A bit bulkly (68kb, 12kb gzipped)
- Significant DOM bloat (`.row` and `.col-*`)
- Utils classes ("CSS-in-classes" such as `.d-flex`, `.border`, `h-100`...) make it harder for nestjs-admin users to override the design without touching HTML

2. Bulma

**Pros:**

- Readable syntax
- Fontawesome support
- Light (73kb, 10kb gzipped)
- Generally liked by devs
- Well maintained

**Cons:**

- Lack of high-level components
- Accessibility (from bulma.io: "90% of Bulma works in IE11")

3. Semantic UI

**Pros:**

- Fairly well-known
- Looks sleek
- Good collection of UI widgets
- Nice to read, semantic classes

**Cons:**

- Complex installation
- Very heavy (146kb, 20kb gzipped)
- Not clear how to customize it as a nestjs-admin user
- Poorly maintained

4. Tailwind

The utility class focus makes it a non-starter for a lib that wants to be customizable.

## Decision

After a hesitation with Bulma, we decided to go with Bootstrap 4, for the following reasons:

- Though it seems to not be the most liked library by the dev community, most front-end devs know the basics
  - This makes it very easy to contribute to and extend
- Better browser compatibility
- Better accessibility
- Reasonable size, we can import only the elements we need
- Easy install => easy to get rid of if we want to change later

## Conclusion

Using a design library allow us to focus on features while providing a good UI.

- We install and use Bootstrap - done
  - We avoid using utility classes
- We define and document how to extend the design => needs to be subject of another ADR
