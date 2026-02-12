# Database Indexes vs Primary Keys

## What Are Indexes and Primary Keys?

**Primary Key (PK):**
A primary key is a column (or set of columns) that uniquely identifies each row in a table. Every table should have one primary key. It enforces uniqueness and non-nullability, ensuring each record is distinct and can be referenced reliably.

**Index:**
An index is a database structure that improves the speed of data retrieval operations on a table. Indexes can be created on any column(s) to accelerate queries, especially those involving WHERE, JOIN, or ORDER BY clauses. Unlike primary keys, indexes do not enforce uniqueness (unless explicitly set as unique).

---

## Differences Between Indexes and Primary Keys

| Feature         | Primary Key (PK)                | Index                                 |
|-----------------|---------------------------------|---------------------------------------|
| Uniqueness      | Enforced (must be unique)       | Optional (can be unique or not)       |
| Nullability     | Cannot be NULL                  | Can be NULL                           |
| Quantity        | One per table                   | Many per table                        |
| Purpose         | Row identity, referential integrity | Query performance                  |
| Automatically Indexed | Yes                        | Yes (PK is always indexed)            |

---

## Performance Effects

- **Indexes** speed up SELECT queries by allowing the database to quickly locate rows, much like a book index.
- **Primary keys** are always indexed, so lookups by PK are very fast.
- **Too many indexes** can slow down INSERT, UPDATE, and DELETE operations, as each index must be updated when data changes.
- **Indexes** consume additional disk space.

---

## Drawbacks of Too Many Indexes

- **Slower Writes:** Every data modification (insert, update, delete) requires updating all relevant indexes, increasing write latency.
- **Increased Storage:** Each index uses disk space, which can add up with many indexes.
- **Maintenance Overhead:** More indexes mean more complexity when tuning, migrating, or maintaining the database.
- **Diminishing Returns:** Indexes on rarely queried columns provide little benefit but still incur costs.

---

## Scalability Considerations

- **Well-chosen indexes** allow databases to scale to millions of rows and high query loads.
- **Over-indexing** can hurt performance and increase costs, especially in write-heavy applications.
- **Regularly review and optimize** indexes as data volume and query patterns evolve.
- **Partitioning and sharding** may be needed for very large datasets, but proper indexing is always foundational.

---

## Common Practices in Modern Software Engineering

- Always define a primary key for every table.
- Index columns that are frequently searched, filtered, joined, or sorted.
- Use composite indexes for queries involving multiple columns.
- Avoid indexing columns with low selectivity (e.g., boolean flags).
- Periodically analyze query performance and adjust indexes as needed.
- Use database tools (like EXPLAIN in MySQL/Postgres) to understand how queries use indexes.

---

## Basic Optimization Tips

- **Index only what you query:** Don’t index every column—focus on those used in WHERE, JOIN, and ORDER BY.
- **Monitor slow queries:** Use database logs to find and optimize slow queries with new or adjusted indexes.
- **Drop unused indexes:** Remove indexes that are not used by queries.
- **Use covering indexes:** Index all columns used in a query to allow the database to answer it using only the index.
- **Keep indexes narrow:** Index as few columns as necessary to minimize storage and update costs.

---

## Glossary

- **Primary Key (PK):** Unique identifier for table rows; always indexed.
- **Index:** Data structure to speed up data retrieval.
- **Unique Index:** Index that enforces uniqueness on a column or set of columns.
- **Composite Index:** Index on multiple columns.
- **Selectivity:** How well an index distinguishes between rows (higher is better).
- **Covering Index:** An index that contains all the columns needed for a query.
- **Sharding:** Splitting data across multiple databases for scalability.
- **Partitioning:** Dividing a table into smaller, more manageable pieces.

---

## References

- [MySQL Indexes Documentation](https://dev.mysql.com/doc/refman/8.0/en/mysql-indexes.html)
- [PostgreSQL Indexes](https://www.postgresql.org/docs/current/indexes.html)
- [Database Indexing Best Practices](https://use-the-index-luke.com/)