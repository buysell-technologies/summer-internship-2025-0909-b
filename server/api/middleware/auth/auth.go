package auth

import (
	"strings"

	"github.com/golang-jwt/jwt"
	"github.com/labstack/echo/v4"
)

func Complex() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			// Swaggerの閲覧を許可
			if strings.HasPrefix(c.Request().URL.Path, "/v1/swagger/") {
				return next(c)
			}

			token := c.Request().Header.Get("Authorization")
			if token == "" {
				return echo.ErrUnauthorized
			}

			splitToken := strings.Split(token, " ")
			if len(splitToken) != 2 {
				return echo.ErrUnauthorized
			}

			parsedJWT, _ := jwt.Parse(splitToken[1], nil)
			claims := parsedJWT.Claims.(jwt.MapClaims)

			tenantID, ok := claims["tenant_id"]
			if !ok {
				return echo.ErrUnauthorized
			}
			c.Set("tenant_id", tenantID)

			storeID, ok := claims["store_id"]
			if !ok {
				return echo.ErrUnauthorized
			}
			c.Set("store_id", storeID)

			return next(c)
		}
	}
}
