package cors

import (
	"net/http"
	"slices"
	"strings"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

var (
	allowedOrigins = []string{
		"http://localhost:1234",
		"http://localhost:5173",
		"https://example.com",
		"https://stg.example.com",
		"https://dev.example.com",
	}
	allowMethods = []string{
		http.MethodGet,
		http.MethodPut,
		http.MethodPost,
		http.MethodDelete,
		http.MethodOptions,
	}
	allowHeaders = []string{
		echo.HeaderOrigin,
		echo.HeaderContentType,
		echo.HeaderContentLength,
		echo.HeaderAuthorization,
	}
)

func Define() echo.MiddlewareFunc {
	return middleware.CORSWithConfig(
		middleware.CORSConfig{
			// Method
			AllowMethods: allowMethods,
			// Header
			AllowHeaders: allowHeaders,
			// Credentials
			AllowCredentials: true,
			// Origin
			AllowOrigins: allowedOrigins,
		},
	)
}

func Check(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		// Swaggerの閲覧を許可
		if strings.HasPrefix(c.Request().URL.Path, "/v1/swagger/") {
			return next(c)
		}

		// Originチェック
		origin := c.Request().Header.Get(echo.HeaderOrigin)
		if !slices.Contains(allowedOrigins, origin) {
			return c.NoContent(http.StatusForbidden)
		}

		// MIMEタイプチェック
		contentType := c.Request().Header.Get(echo.HeaderContentType)
		if contentType != echo.MIMEApplicationJSON {
			return c.NoContent(http.StatusForbidden)
		}

		// Methodチェック
		method := c.Request().Method
		if !slices.Contains(allowMethods, method) {
			return c.NoContent(http.StatusForbidden)
		}

		return next(c)
	}
}
