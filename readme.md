Refactor todos:
- One simple game asset loading mechanism
- Powerfull animation manager
    - **All** game animations (character, tilemaps, ...) should be handled by this generic animator
    - Animations should be able to use a `Transition`
- Make `@UseAnimation` more generic to allow add more meta information to a class. Use a texture resource, or other resources...
- Canvas renderer should be quicker