package handler

import (
	"net/http"

	"github.com/buysell-technologies/summer-internship-2024-backend/api/handler/request"
	usecaseRequest "github.com/buysell-technologies/summer-internship-2024-backend/api/usecase/request"
	"github.com/labstack/echo/v4"
)

// GetStocks godoc
//
//	@Summary		在庫一覧の取得
//	@Description	在庫一覧の取得
//	@Produce		json
//	@Security		ApiKeyAuth
//	@Param			limit	query		int		false	"取得件数"	minimum(0)	example(10)
//	@Param			offset	query		int		false	"取得開始位置"	minimum(0)	example(0)
//	@Success		200	{object}	[]model.Stock
//	@Failure		400	{object}	error
//	@Failure		500	{object}	error
//	@Router			/stocks [get]
func (h *Handler) GetStocks(c echo.Context) error {
	ctx := h.GetCtx(c)

	var req request.GetStocksRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err).
			WithInternal(err)
	}

	if err := c.Validate(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err).
			WithInternal(err)
	}

	stocks, err := h.Usecase.GetStocks(ctx, usecaseRequest.GetStocksRequest{
		StoreID: c.Get("store_id").(string),
		Limit:   req.Limit,
		Offset:  req.Offset,
	})
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err).
			WithInternal(err)
	}

	return c.JSON(http.StatusOK, stocks)
}

// GetStock godoc
//
//	@Summary		在庫の取得
//	@Description	在庫の取得
//	@Produce		json
//	@Security		ApiKeyAuth
//	@Param			id	path		int	true	"在庫ID"	minimum(1)
//	@Success		200	{object}	model.Stock
//	@Failure		400	{object}	error
//	@Failure		500	{object}	error
//	@Router			/stocks/{id} [get]
func (h *Handler) GetStock(c echo.Context) error {
	ctx := h.GetCtx(c)

	var req request.GetStockRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err).
			WithInternal(err)
	}

	if err := c.Validate(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err).
			WithInternal(err)
	}

	stock, err := h.Usecase.GetStock(ctx, c.Get("store_id").(string), req.StockID)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err).
			WithInternal(err)
	}

	return c.JSON(http.StatusOK, stock)
}

// CreateStock godoc
//
//	@Summary		在庫の作成
//	@Description	在庫の作成
//	@Accept			json
//	@Produce		json
//	@Security		ApiKeyAuth
//	@Param			req	body		request.CreateStockRequest	true	"在庫情報"
//	@Success		201	{object}	int
//	@Failure		400	{object}	error
//	@Failure		500	{object}	error
//	@Router			/stocks [post]
func (h *Handler) CreateStock(c echo.Context) error {
	ctx := h.GetCtx(c)

	var req request.CreateStockRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err).
			WithInternal(err)
	}

	if err := c.Validate(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err).
			WithInternal(err)
	}

	stock, err := h.Usecase.CreateStock(ctx, usecaseRequest.CreateStockRequest{
		Name:     req.Name,
		Quantity: req.Quantity,
		Price:    req.Price,
		StoreID:  req.StoreID,
		UserID:   req.UserID,
	})
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err).
			WithInternal(err)
	}

	return c.JSON(http.StatusCreated, stock)
}

// CreateBulkStock godoc
//
//	@Summary		在庫の一括作成
//	@Description	在庫の一括作成
//	@Accept			json
//	@Produce		json
//	@Security		ApiKeyAuth
//	@Param			req	body		request.CreateBulkStockRequest	true	"在庫情報"
//	@Success		201	{object}	[]int
//	@Failure		400	{object}	error
//	@Failure		500	{object}	error
//	@Router			/stocks/bulk [post]
func (h *Handler) CreateBulkStock(c echo.Context) error {
	ctx := h.GetCtx(c)

	var req request.CreateBulkStockRequest
	if err := c.Bind(&req.Stocks); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err).
			WithInternal(err)
	}

	if err := c.Validate(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err).
			WithInternal(err)
	}

	var stocks []usecaseRequest.CreateStockRequest
	for _, stock := range req.Stocks {
		stocks = append(stocks, usecaseRequest.CreateStockRequest{
			Name:     stock.Name,
			Quantity: stock.Quantity,
			Price:    stock.Price,
			StoreID:  stock.StoreID,
			UserID:   stock.UserID,
		})
	}

	stockIDs, err := h.Usecase.CreateBulkStock(ctx, stocks)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err).
			WithInternal(err)
	}

	return c.JSON(http.StatusCreated, stockIDs)
}

// UpdateStock godoc
//
//	@Summary		在庫の更新
//	@Description	在庫の更新
//	@Accept			json
//	@Produce		json
//	@Security		ApiKeyAuth
//	@Param			id		path		int						true	"在庫ID"		minimum(1)
//	@Param			req		body		request.UpdateStockRequest	true	"在庫情報"
//	@Success		200	{object}	model.Stock
//	@Failure		400	{object}	error
//	@Failure		500	{object}	error
//	@Router			/stocks/{id} [put]
func (h *Handler) UpdateStock(c echo.Context) error {
	ctx := h.GetCtx(c)

	var req request.UpdateStockRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err).
			WithInternal(err)
	}

	if err := c.Validate(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err).
			WithInternal(err)
	}

	stock, err := h.Usecase.UpdateStock(ctx, usecaseRequest.UpdateStockRequest{
		StockID:  req.StockID,
		Name:     req.Name,
		Quantity: req.Quantity,
		Price:    req.Price,
		StoreID:  req.StoreID,
		UserID:   req.UserID,
	})
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err).
			WithInternal(err)
	}

	return c.JSON(http.StatusOK, stock)
}

// DeleteStock godoc
//
//	@Summary		在庫の削除
//	@Description	在庫の削除
//	@Produce		json
//	@Security		ApiKeyAuth
//	@Param			id	path		int	true	"在庫ID"	minimum(1)
//	@Success		204	{string}	string
//	@Failure		400	{object}	error
//	@Failure		500	{object}	error
//	@Router			/stocks/{id} [delete]
func (h *Handler) DeleteStock(c echo.Context) error {
	ctx := h.GetCtx(c)

	var req request.DeleteStockRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err).
			WithInternal(err)
	}

	if err := c.Validate(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err).
			WithInternal(err)
	}

	err := h.Usecase.DeleteStock(ctx, c.Get("store_id").(string), req.StockID)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err).
			WithInternal(err)
	}

	return c.NoContent(http.StatusNoContent)
}
