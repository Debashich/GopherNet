package store

import(
	"database/sql"
	_"github.com/lib/pq"
)

type PostgresStore struct {
	db *sql.DB
}

func NewPostgresStore(conn string) (*PostgresStore, error) {
	db, err := sql.Open("postgres", conn)
	if err != nil {
		return nil, err
	}
	return &PostgresStore{db: db}, nil
}

func (p *PostgresStore) Save(e Event) error {
	_, err := p.db.Exec(
		"INSERT INTO events (topic, message, timestamp) VALUES ($1, $2, $3)",
		e.Topic, e.Message, e.Timestamp,
	)
	return err
}

// func (p *PostgresStore) ListByTopic(topic string) ([]Event, error) {
// 	var out []Event
// 	for _, e := range p.events {
// 		if topic == "" || e.Topic == topic {
// 			out = append(out, e)
// 		}
// 	}
// 	return out, nil
// }

func (p *PostgresStore) ListAfter(topic string, lastID int) ([]Event, error) {
	rows, err := p.db.Query(
		"SELECT id, topic, message, timestamp FROM events WHERE topic=$1 AND id>$2 ORDER BY id",
		topic, lastID,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var out []Event
	for rows.Next() {
		var e Event
		rows.Scan(&e.ID, &e.Topic, &e.Message, &e.Timestamp)
		out = append(out, e)
	}
	return out, nil
}

func (p *PostgresStore) ListAll() ([]Event, error) {
	rows, err := p.db.Query(
		"SELECT id, topic, message, timestamp FROM events ORDER BY id",
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var out []Event
	for rows.Next() {
		var e Event
		rows.Scan(&e.ID, &e.Topic, &e.Message, &e.Timestamp)
		out = append(out, e)
	}
	return out, nil
}
