package handler

import (
	"context"

	"github.com/buysell-technologies/summer-internship-2024-backend/api/usecase"
	"github.com/labstack/echo/v4"
	echoSwagger "github.com/swaggo/echo-swagger"
)

type Handler struct {
	Usecase usecase.UsecaseInterface
}

func NewHandler(
	u usecase.UsecaseInterface,
) *Handler {
	return &Handler{
		Usecase: u,
	}
}

func (h *Handler) AssignRoutes(e *echo.Echo) {
	g := e.Group("/v1")
	{
		g.GET("/health", h.GetHealth)
		g.GET("/swagger/*", echoSwagger.WrapHandler)

		/* user */
		ug := g.Group("/users")
		{
			ug.GET("", h.GetUsers)
			ug.GET("/:id", h.GetUser)
			ug.POST("", h.CreateUser)
			ug.PUT("/:id", h.UpdateUser)
			ug.DELETE("/:id", h.DeleteUser)
		}

		/* stock */
		sg := g.Group("/stocks")
		{
			sg.GET("", h.GetStocks)
			sg.GET("/:id", h.GetStock)
			sg.POST("", h.CreateStock)
			sg.POST("/bulk", h.CreateBulkStock)
			sg.PUT("/:id", h.UpdateStock)
			sg.DELETE("/:id", h.DeleteStock)
		}

		/* customer */
		cg := g.Group("/customers")
		{
			cg.GET("", h.GetCustomers)
			cg.GET("/:id", h.GetCustomer)
			cg.POST("", h.CreateCustomer)
			cg.PUT("/:id", h.UpdateCustomer)
			cg.DELETE("/:id", h.DeleteCustomer)
		}

		/* order */
		og := g.Group("/orders")
		{
			og.GET("", h.GetOrders)
			og.GET("/:id", h.GetOrder)
			og.POST("", h.CreateOrder)
			og.POST("/bulk", h.CreateBulkOrder)
			og.PUT("/:id", h.UpdateOrder)
		}
	}
}

func (h *Handler) GetCtx(ec echo.Context) context.Context {
	return ec.Request().Context()
}
