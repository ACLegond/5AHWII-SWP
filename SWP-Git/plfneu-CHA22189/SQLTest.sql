
CREATE TABLE Customers (
    'id'INT Primary KEY UNIQUE,
    'name' VARCHAR(255)
);

CREATE TABLE Orders (
    'id' INT Primary KEY UNIQUE,
    'customerId' INT,
    FOREIGN KEY (id) REFERENCES Customers(id)
);


INSERT INTO `Customers` (`id`, `name`) VALUES (1, `hallo`);


-- Select 'name', 'id' FROM Customers As c LEFT JOIN Orders As o ON c.id != a.id



-- 2

/*
CREATE TABLE Person (
    'id'INT Primary KEY UNIQUE,
    'email' VARCHAR NOT NULL()
);

Select NOT DISTINCT 'email', FROM PERSON;
*/

-- SELECT NOT DISTINCT
