# Hello!

This project is a web page to display/search for books as well as apply Crud operations.
Done in the context of the technical task for WorkNomads during the interview.

## Additional Changes/Improvements:

### Model
Added Author model and necessary implementations / tests , 
Authors and Books have a many to many relationship.
Users can select authors during book creation/edit .

### Performance

**Memoization:** Components are wrapped inside React.memo to apply memoization preventing unnecessary re-renders unless props or relevant state changes.

**Function Caching:** UseCallback for major functions: fetch / handle*Success / handleSubmits:
This ensures these functions retain stable references between renders, especially important when passing them as props or dependencies.  
### Ux
When creating or updating a book users can now search for authors in an autocomplete search input, if the result is not found in the existing list they can create a new Author on the fly.

Transitions on operations

Snackbar to give feedback on success / error

Loading feedback / Initial backdrop

## Init/Run/Test:
cd **/server**

npm install

npm run test

npm run start

cd **/client**

npm install

npm run start


***Thank you for your time.*** 
