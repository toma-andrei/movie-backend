# movie-backend

## BACKEND: 
 - register POST, 
 - login POST,
 - movie POST,
 - preferences POST,
 - movie list GET,
 - movie by genre GET

## DATABASE
### Tables:
	- Users(id PK, username UNIQUE, password)
	- Preferences(id FK, pref_genres, pref_movies, pref_actors)
	- Movies(id PK, name, plot)
	- Genres(movie_id FK, genre)
	- Actors(movie_id FK, actor)
	- Producers(movie_id FK, producer)
