# Dashboard and Notes Flow Implementation

**User Request:**
"Let's work inside of the application, the authentification is working (amazing, thank you)

Let's work on the basic flows of our app. Please, I add reference images of the UI and Design you should stick to it.

On the dashboard (route: /) we should see:
- Sidebar with the categories, this one filters the notes based on the category
    - to unmark the category selected, you should click again the filter and should be unfiltered
    - this is not included in the design but I want a user picture with the initials of the user (for this we can implement the avatar and the dropdown menu from shadcn, this should be the first step)
- Main area showing all the notes
- Upper top right the new Note button
    - When click this button we are going to a new route (/new-note) to create a new note
    - On this route we have on the top left the select with the categories
        - the note background change based on the category
    - on the top right a close button to go back to the dashboard without saving
    - on the bottom right we should have two buttons with icon:
        - one with a headset to record voice notes
        - one with a check mark or save icon to save the note
- When we click on a note from the dashboard we go to the route (/note/:id)
    - we keep the top right close button

After all those changes, we need to connect all of this on the API, you can re-read the notes app in the django project."
