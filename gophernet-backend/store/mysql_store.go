package store

import (
	"database/sql"
	_ "github.com/go-sql-driver/mysql"
)

type MySQLStore struct {
	db *sql.DB
}

func NewMySQLStore(dsn string) (*MySQLStore, error) {
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		return nil, err
	}
	return &MySQLStore{db: db}, nil
}

func (m *MySQLStore) Save(e Event) error {
	_, err := m.db.Exec(
		`INSERT INTO events (topic, message, timestamp) VALUES (?, ?, ?)`,
		e.Topic,
		e.Message,
		e.Timestamp,
	)
	return err
}

func (m *MySQLStore) ListByTopic(topic string) ([]Event, error) {
	var rows *sql.Rows
	var err error

	if topic == "" {
		rows, err = m.db.Query(`SELECT id, topic, message, timestamp FROM events`)
	} else {
		rows, err = m.db.Query(
			`SELECT id, topic, message, timestamp FROM events WHERE topic=?`,
			topic,
		)
	}

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var events []Event
	for rows.Next() {
		var e Event
		if err := rows.Scan(&e.ID, &e.Topic, &e.Message, &e.Timestamp); err != nil {
			return nil, err
		}
		events = append(events, e)
	}

	return events, nil
}

func (m *MySQLStore) ListAfter(topic string, lastID int) ([]Event, error) {
	rows, err := m.db.Query(
		`SELECT id, topic, message, timestamp 
		 FROM events 
		 WHERE topic=? AND id > ?`,
		topic, lastID,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var events []Event
	for rows.Next() {
		var e Event
		if err := rows.Scan(&e.ID, &e.Topic, &e.Message, &e.Timestamp); err != nil {
			return nil, err
		}
		events = append(events, e)
	}

	return events, nil
}

func (m *MySQLStore) ListAll() ([]Event, error) {
    rows, err := m.db.Query(`SELECT id, topic, message, timestamp FROM events ORDER BY id`)
    if err != nil {
        return nil, err
    }
    defer rows.Close()

    var events []Event
    for rows.Next() {
        var e Event
        if err := rows.Scan(&e.ID, &e.Topic, &e.Message, &e.Timestamp); err != nil {
            return nil, err
        }
        events = append(events, e)
    }

    return events, nil
}