package config

import (
	"fmt"

	"github.com/kelseyhightower/envconfig"
)

type Platform string

const (
	Local Platform = "local"
	Dev   Platform = "dev"
	Stg   Platform = "stg"
	Prod  Platform = "prod"
)

type Config struct {
	Env  Platform `split_words:"true" default:"local"`
	Port string   `split_words:"true" default:"1234"`
	Database
}

type Database struct {
	DBHost     string `envconfig:"DB_HOST" default:"pgsql"`
	DBPort     string `envconfig:"DB_PORT" default:"5432"`
	DBName     string `envconfig:"DB_NAME" default:"api"`
	DBPassword string `envconfig:"DB_PASSWORD" default:"password"`
	DBUser     string `envconfig:"DB_USER" default:"postgres"`
}

func New() (*Config, error) {
	c := &Config{}
	if err := envconfig.Process("", c); err != nil {
		return nil, err
	}

	return c, nil
}

func (d Database) DSN() string {
	return fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		d.DBHost,
		d.DBUser,
		d.DBPassword,
		d.DBName,
		d.DBPort,
	)
}
