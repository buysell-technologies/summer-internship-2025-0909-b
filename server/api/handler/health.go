package handler

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

// GetHealth godoc
//
//	@Summary		ヘルスチェック
//	@Description	ヘルスチェック
//	@Produce		json
//	@Success		200	{string}	string
//	@Router			/health [get]
func (h *Handler) GetHealth(c echo.Context) error {
	return c.String(http.StatusOK, "OK")
}
