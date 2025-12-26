CREATE TABLE events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  topic VARCHAR(255),
  message TEXT,
  timestamp DATETIME
);
