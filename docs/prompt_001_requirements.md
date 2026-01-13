The app we want to have is a straightforward but powerfull note taking app. We want the user:

- Can manage (create, update, delete and see) notes on text and/or voice.
- Can manage (create, update, delete and see) categories for his notes
- We want a closed app, we need to implement a simple auth system for our users.
- Offline first app and we want to create a PWA to use in Smartphones and Desktop
- You can consult your notes for differents months of the year or different months in years.

Some technical especification:

- I want a mono-repo powered on Docker for the backend and frontend.
- The frontend should be done with cutting edge Nextjs and Typescript using the app router
- Django should be using:
    - djoser for auth
    - django rest framework
    - good libraries for dates 
    - swagger or another popular library for documentation
- The database should be postgresql
- For the frontend we want to use shadcn, we can implement the stone color scheme first and later we can implement the one from the design
- The routes for the frontend app are:
    - authorized and not-authorized (sign in, sign up and forgot password)
    - We need routes for the notes per categories, detail of the note (with update in the same), create of the note

Expected models on the Backend:
    - Notes model (id: uuid, title: string, description: string, category: Category, creator: User and timestamps)
    - Category (id: uuid, creator: User, color tag: HEX Color, name: string, notes: Note[])
    - User (id: uuid, first_name, last_name, email, not username for this one)

Considerations for the Backend and Frontend in terms of code quality:
    - We want highly re-usable and deocupled components in the Frontend
    - Unit tests on the backend should have a threshold of 90%
    - Cover all the components in the Frontend with Unit tests with a treshold of 70%

For every step:

- We want to save all the prompts after his successful execution in a docs folder a root level 
