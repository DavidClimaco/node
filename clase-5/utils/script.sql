drop database if exists moviesdb;
create database moviesdb;

use moviesdb;

create table movie(
id binary(16) primary key default (UUID_TO_BIN(UUID())),
title varchar(255) not null,
year int not null,
director varchar(255) not null,
duration int not null,
poster text,
rate decimal(2,1) unsigned not null
);

create table genre(
id int auto_increment primary key,
name VARCHAR(255) not null unique
);

create table movie_genres(
movie_id BINARY(16) references movie(id),
genre_id int references genre(id),
primary key (movie_id, genre_id)
);


#inserción de datos
insert into genre(name) values ('Drama'), ('Action'), ('Crime'), ('Adventure'), ('Sci-Fi'), ('Romance');
insert into movie(id, title, year, director, duration, poster, rate) values
(UUID_TO_BIN(UUID()), "Interstellar", 2014, "Christopher Nolan", 169, "https://m.media-amazon.com/images/I/91obuWzA3XL._AC_UF1000,1000_QL80_.jpg", 8.6),
(UUID_TO_BIN(UUID()), "The Shawshank Redemption", 1994, "Frank Darabont", 142, "https://i.ebayimg.com/images/g/4goAAOSwMyBe7hnQ/s-l1200.webp", 9.3),
(UUID_TO_BIN(UUID()), "The Dark Knight", 2008, "Christopher Nolan", 152, "https://i.ebayimg.com/images/g/yokAAOSw8w1YARbm/s-l1200.jpg", 9.0);

insert into movie_genres (movie_id, genre_id)
values
((select id from movie where title= 'Interstellar'), (select id from genre where name = 'Drama')),
 ((select id from movie where title = 'Interstellar'), (select id from genre where name = 'Sci-Fi')),
 ((select id from movie where title = 'The Shawshank Redemption'), (select id from genre where name = 'Drama')),
 ((select id from movie where title = 'The Dark Knight'), (select id from genre where name = 'Drama')),
 ((select id from movie where title = 'The Dark Knight'), (select id from genre where name = 'Action'))


SELECT *, BIN_TO_UUID(id) id FROM movie;