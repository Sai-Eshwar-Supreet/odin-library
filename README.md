# odin-library

A small library management web app built with __vanilla JavaScript__, featuring a clean data model, predictable UI rendering, and a responsive card-based layout.

This project was built as part of __The Odin Project – JavaScript curriculum__.

## Live Demo
[View on GitHub Pages](https://sai-eshwar-supreet.github.io/odin-library/)

## Overview
The application allows users to:
- Add books via a modal form
- Display books as responsive cards
- Toggle read/unread status
- Remove books from the library

The UI updates based on the current application data and remains consistent after every interaction.

## Features
- __Vanilla JavaScript__
    - No frameworks or external libraries
    - Explicit data handling and rendering logic
- __Book data model__
    - Constructor-based objects
    - Stable unique identifiers using `crypto.randomUUID()`
    - Prototype method for toggling read status
- __UI rendering__
    - Card-based layout generated from application data
    - Responsive grid using CSS Grid
    - Centralized render function for updating the view
- __Modal form__
    - Built using the native `<dialog>` element
    - Uses `FormData` and `event.preventDefault()`

## Technical Notes
- Application data is stored in an in-memory array
- UI is regenerated from data when changes occur
- Event handling mutates data and triggers a re-render
- Layout uses CSS Grid with flexible columns via `auto-fill` and `minmax()`
- Styling is managed through CSS variables for consistency

## Limitations
- No persistent storage (data resets on reload)
- No backend or API integration
- Accessibility has not been fully audited

## Acknowledgements
- This project was completed as part of **[The Odin Project – JavaScript Course](https://www.theodinproject.com/)**
- Book cover images loaded from external sources for demonstration purposes