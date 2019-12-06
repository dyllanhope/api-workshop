create table favourites
(
    id serial not null primary key,
    username text not null,
    make text not null,
    model text not null,
    color text not null,
    price text not null,
    reg_number text not null
);

create table users (
    id serial not null primary key,
    username text not null
);