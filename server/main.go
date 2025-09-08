package main

import (
	"fmt"
	"log/slog"
	"net/http"
	"os"

	"github.com/buysell-technologies/summer-internship-2024-backend/api/handler"
	"github.com/buysell-technologies/summer-internship-2024-backend/api/handler/validator"
	"github.com/buysell-technologies/summer-internship-2024-backend/api/middleware/auth"
	"github.com/buysell-technologies/summer-internship-2024-backend/api/middleware/cors"
	"github.com/buysell-technologies/summer-internship-2024-backend/api/repository"
	"github.com/buysell-technologies/summer-internship-2024-backend/api/usecase"
	"github.com/buysell-technologies/summer-internship-2024-backend/config"
	_ "github.com/buysell-technologies/summer-internship-2024-backend/docs"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	slogecho "github.com/samber/slog-echo"
)

//	@title						Summer Internship 2024 Backend API
//	@version					1
//	@description				This is the API for the Summer Internship 2024 Backend.
//	@host						localhost:1234
//	@BasePath					/v1
//	@schemes					http https
//	@securityDefinitions.apikey	ApiKeyAuth
//	@in							header
//	@name						Authorization

func main() {
	cfg, err := config.New()
	if err != nil {
		panic(err)
	}

	logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))
	e := echo.New()

	e.Use(slogecho.New(logger))
	e.Use(middleware.Recover())
	e.Use(cors.Define())
	e.Use(cors.Check)
	e.Use(auth.Complex())

	if err := di(e, cfg); err != nil {
		e.Logger.Fatal(err)
		panic(err)
	}
	e.Validator = validator.NewValidator()

	if err := e.Start(fmt.Sprintf(":%v", cfg.Port)); err != http.ErrServerClosed {
		e.Logger.Fatal(err)
		panic(err)
	}
}

func di(e *echo.Echo, cfg *config.Config) error {
	// Repository層
	r, err := repository.New(cfg)
	if err != nil {
		return err
	}

	// Usecase層
	ub := &usecase.UsecaseBundle{
		Repository: r,
	}
	u := usecase.NewUsecase(ub)

	// Handler層
	h := handler.NewHandler(u)
	h.AssignRoutes(e)

	return nil
}
