package handler

import (
	"net/http"

	"github.com/buysell-technologies/summer-internship-2024-backend/api/handler/request"
	usecaseRequest "github.com/buysell-technologies/summer-internship-2024-backend/api/usecase/request"
	"github.com/labstack/echo/v4"
)

// GetCustomers godoc
//
//	@Summary		顧客一覧の取得
//	@Description	顧客一覧の取得
//	@Produce		json
//	@Security		ApiKeyAuth
//	@Param			limit	query		int		false	"取得件数"	minimum(0)	example(10)
//	@Param			offset	query		int		false	"取得開始位置"	minimum(0)	example(0)
//	@Success		200	{object}	[]model.Customer
//	@Failure		400	{object}	error
//	@Failure		500	{object}	error
//	@Router			/customers [get]
func (h *Handler) GetCustomers(c echo.Context) error {
	ctx := h.GetCtx(c)

	var req request.GetCustomersRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err).
			WithInternal(err)
	}

	if err := c.Validate(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err).
			WithInternal(err)
	}

	customers, err := h.Usecase.GetCustomers(ctx, usecaseRequest.GetCustomersRequest{
		TenantID: c.Get("tenant_id").(string),
		Limit:    req.Limit,
		Offset:   req.Offset,
	})
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err).
			WithInternal(err)
	}

	return c.JSON(http.StatusOK, customers)
}

// GetCustomer godoc
//
//	@Summary		顧客の取得
//	@Description	顧客の取得
//	@Produce		json
//	@Security		ApiKeyAuth
//	@Param			id	path		string	true	"顧客ID"	format(uuid)
//	@Success		200	{object}	model.Customer
//	@Failure		400	{object}	error
//	@Failure		500	{object}	error
//	@Router			/customers/{id} [get]
func (h *Handler) GetCustomer(c echo.Context) error {
	ctx := h.GetCtx(c)

	var req request.GetCustomerRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err).
			WithInternal(err)
	}

	if err := c.Validate(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err).
			WithInternal(err)
	}

	customer, err := h.Usecase.GetCustomer(ctx, c.Get("tenant_id").(string), req.CustomerID)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err).
			WithInternal(err)
	}

	return c.JSON(http.StatusOK, customer)
}

// CreateCustomer godoc
//
//	@Summary		顧客の作成
//	@Description	顧客の作成
//	@Accept			json
//	@Produce		json
//	@Security		ApiKeyAuth
//	@Param			req	body		request.CreateCustomerRequest	true	"作成条件"
//	@Success		201	{string}	string
//	@Failure		400	{object}	error
//	@Failure		500	{object}	error
//	@Router			/customers [post]
func (h *Handler) CreateCustomer(c echo.Context) error {
	ctx := h.GetCtx(c)

	var req request.CreateCustomerRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err).
			WithInternal(err)
	}

	if err := c.Validate(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err).
			WithInternal(err)
	}

	customerID, err := h.Usecase.CreateCustomer(ctx, usecaseRequest.CreateCustomerRequest{
		TenantID:    req.TenantID,
		Name:        req.Name,
		Email:       req.Email,
		PhoneNumber: req.PhoneNumber,
		Address:     req.Address,
	})
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err).
			WithInternal(err)
	}

	return c.JSON(http.StatusCreated, customerID)
}

// UpdateCustomer godoc
//
//	@Summary		顧客の更新
//	@Description	顧客の更新
//	@Accept			json
//	@Produce		json
//	@Security		ApiKeyAuth
//	@Param			id		path		string						true	"顧客ID"		format(uuid)
//	@Param			req		body		request.UpdateCustomerRequest	true	"更新条件"
//	@Success		200	{object}	model.Customer
//	@Failure		400	{object}	error
//	@Failure		500	{object}	error
//	@Router			/customers/{id} [put]
func (h *Handler) UpdateCustomer(c echo.Context) error {
	ctx := h.GetCtx(c)

	var req request.UpdateCustomerRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err).
			WithInternal(err)
	}

	if err := c.Validate(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err).
			WithInternal(err)
	}

	customer, err := h.Usecase.UpdateCustomer(ctx, usecaseRequest.UpdateCustomerRequest{
		ID:          req.ID,
		TenantID:    req.TenantID,
		Name:        req.Name,
		Email:       req.Email,
		PhoneNumber: req.PhoneNumber,
		Address:     req.Address,
	})
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err).
			WithInternal(err)
	}

	return c.JSON(http.StatusOK, customer)
}

// DeleteCustomer godoc
//
//	@Summary		顧客の削除
//	@Description	顧客の削除
//	@Produce		json
//	@Security		ApiKeyAuth
//	@Param			id	path		string	true	"顧客ID"	format(uuid)
//	@Success		204	{string}	string
//	@Failure		400	{object}	error
//	@Failure		500	{object}	error
//	@Router			/customers/{id} [delete]
func (h *Handler) DeleteCustomer(c echo.Context) error {
	ctx := h.GetCtx(c)

	var req request.DeleteCustomerRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err).
			WithInternal(err)
	}

	if err := c.Validate(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err).
			WithInternal(err)
	}

	err := h.Usecase.DeleteCustomer(ctx, c.Get("tenant_id").(string), req.CustomerID)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err).
			WithInternal(err)
	}

	return c.NoContent(http.StatusNoContent)
}
