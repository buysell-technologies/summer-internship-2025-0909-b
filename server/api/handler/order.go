package handler

import (
	"net/http"

	"github.com/buysell-technologies/summer-internship-2024-backend/api/handler/request"
	usecaseRequest "github.com/buysell-technologies/summer-internship-2024-backend/api/usecase/request"
	"github.com/labstack/echo/v4"
)

// GetOrders godoc
//
//	@Summary		発注一覧の取得
//	@Description	発注一覧の取得
//	@Produce		json
//	@Security		ApiKeyAuth
//	@Param			limit	query		int		false	"取得件数"	minimum(0)	example(10)
//	@Param			offset	query		int		false	"取得開始位置"	minimum(0)	example(0)
//	@Success		200	{object}	[]model.Order
//	@Failure		400	{object}	error
//	@Failure		500	{object}	error
//	@Router			/orders [get]
func (h *Handler) GetOrders(c echo.Context) error {
	ctx := h.GetCtx(c)

	var req request.GetOrdersRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err).
			WithInternal(err)
	}

	if err := c.Validate(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err).
			WithInternal(err)
	}

	orders, err := h.Usecase.GetOrders(ctx, usecaseRequest.GetOrdersRequest{
		TenantID: c.Get("tenant_id").(string),
		Limit:    req.Limit,
		Offset:   req.Offset,
	})
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err).
			WithInternal(err)
	}

	return c.JSON(http.StatusOK, orders)
}

// GetOrder godoc
//
//	@Summary		発注の取得
//	@Description	発注の取得
//	@Produce		json
//	@Security		ApiKeyAuth
//	@Param			id	path		int	true	"発注ID"	minimum(1)
//	@Success		200	{object}	model.Order
//	@Failure		400	{object}	error
//	@Failure		500	{object}	error
//	@Router			/orders/{id} [get]
func (h *Handler) GetOrder(c echo.Context) error {
	ctx := h.GetCtx(c)

	var req request.GetOrderRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err).
			WithInternal(err)
	}

	if err := c.Validate(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err).
			WithInternal(err)
	}

	order, err := h.Usecase.GetOrder(ctx, c.Get("tenant_id").(string), req.OrderID)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err).
			WithInternal(err)
	}

	return c.JSON(http.StatusOK, order)
}

// CreateOrder godoc
//
//	@Summary		発注の作成
//	@Description	発注の作成
//	@Accept			json
//	@Produce		json
//	@Security		ApiKeyAuth
//	@Param			req	body		request.CreateOrderRequest	true	"作成条件"
//	@Success		201	{object}	int
//	@Failure		400	{object}	error
//	@Failure		500	{object}	error
//	@Router			/orders [post]
func (h *Handler) CreateOrder(c echo.Context) error {
	ctx := h.GetCtx(c)

	var req request.CreateOrderRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err).
			WithInternal(err)
	}

	if err := c.Validate(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err).
			WithInternal(err)
	}

	orderID, err := h.Usecase.CreateOrder(ctx, usecaseRequest.CreateOrderRequest{
		TotalAmount:  req.TotalAmount,
		Quantity:     req.Quantity,
		DeliveryDate: req.DeliveryDate,
		Status:       req.Status,
		StockID:      req.StockID,
		CustomerID:   req.CustomerID,
	})
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err).
			WithInternal(err)
	}

	return c.JSON(http.StatusCreated, orderID)
}

// UpdateOrder godoc
//
//	@Summary		発注の更新
//	@Description	発注の更新
//	@Accept			json
//	@Produce		json
//	@Security		ApiKeyAuth
//	@Param			id		path		int						true	"発注ID"		minimum(1)
//	@Param			req		body		request.UpdateOrderRequest	true	"更新条件"
//	@Success		200	{object}	model.Order
//	@Failure		400	{object}	error
//	@Failure		500	{object}	error
//	@Router			/orders/{id} [put]
func (h *Handler) UpdateOrder(c echo.Context) error {
	ctx := h.GetCtx(c)

	var req request.UpdateOrderRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err).
			WithInternal(err)
	}

	if err := c.Validate(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err).
			WithInternal(err)
	}

	order, err := h.Usecase.UpdateOrder(ctx, usecaseRequest.UpdateOrderRequest{
		ID:           req.ID,
		TenantID:     req.TenantID,
		TotalAmount:  req.TotalAmount,
		Quantity:     req.Quantity,
		DeliveryDate: req.DeliveryDate,
		Status:       req.Status,
	})
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err).
			WithInternal(err)
	}

	return c.JSON(http.StatusOK, order)
}

// CreateBulkOrder godoc
//
//	@Summary		発注の一括作成
//	@Description	発注の一括作成
//	@Accept			json
//	@Produce		json
//	@Security		ApiKeyAuth
//	@Param			req	body		request.CreateBulkOrderRequest	true	"作成条件"
//	@Success		201	{object}	[]int
//	@Failure		400	{object}	error
//	@Failure		500	{object}	error
//	@Router			/orders/bulk [post]
func (h *Handler) CreateBulkOrder(c echo.Context) error {
	ctx := h.GetCtx(c)

	var req request.CreateBulkOrderRequest
	if err := c.Bind(&req.Orders); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err).
			WithInternal(err)
	}

	if err := c.Validate(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err).
			WithInternal(err)
	}

	var orders []usecaseRequest.CreateOrderRequest
	for _, order := range req.Orders {
		orders = append(orders, usecaseRequest.CreateOrderRequest{
			TotalAmount:  order.TotalAmount,
			Quantity:     order.Quantity,
			DeliveryDate: order.DeliveryDate,
			Status:       order.Status,
			StockID:      order.StockID,
			CustomerID:   order.CustomerID,
		})
	}

	orderIDs, err := h.Usecase.CreateBulkOrder(ctx, orders)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err).
			WithInternal(err)
	}

	return c.JSON(http.StatusCreated, orderIDs)
}
