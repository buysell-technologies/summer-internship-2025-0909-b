package handler

import (
	"net/http"

	"github.com/buysell-technologies/summer-internship-2024-backend/api/domain/model"
	"github.com/buysell-technologies/summer-internship-2024-backend/api/handler/request"
	usecaseRequest "github.com/buysell-technologies/summer-internship-2024-backend/api/usecase/request"
	"github.com/labstack/echo/v4"
)

// convertGenderForDisplay converts gender values for API response
func convertGenderForDisplay(gender *string) *string {
	switch *gender {
	case "male":
		maleStr := "男性"
		return &maleStr
	case "female":
		femaleStr := "女性"
		return &femaleStr
	default:
		return gender
	}
}

// convertUserForDisplay converts a user model for API response
func convertUserForDisplay(user *model.User) *model.User {
	if user == nil {
		return nil
	}
	userCopy := *user
	userCopy.Gender = convertGenderForDisplay(user.Gender)
	return &userCopy
}

// convertUsersForDisplay converts users for API response
func convertUsersForDisplay(users []*model.User) []*model.User {
	if users == nil {
		return nil
	}
	result := make([]*model.User, len(users))
	for i, user := range users {
		result[i] = convertUserForDisplay(user)
	}
	return result
}

// GetUsers godoc
//
//	@Summary		従業員一覧の取得
//	@Description	従業員一覧の取得
//	@Produce		json
//	@Security		ApiKeyAuth
//	@Param			limit	query		int		false	"取得件数"	minimum(0)	example(10)
//	@Param			offset	query		int		false	"取得開始位置"	minimum(0)	example(0)
//	@Success		200	{object}	[]model.User
//	@Failure		400	{object}	error
//	@Failure		500	{object}	error
//	@Router			/users [get]
func (h *Handler) GetUsers(c echo.Context) error {
	ctx := h.GetCtx(c)

	var req request.GetUsersRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err).
			WithInternal(err)
	}

	if err := c.Validate(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err).
			WithInternal(err)
	}

	users, err := h.Usecase.GetUsers(ctx, usecaseRequest.GetUsersRequest{
		TenantID: c.Get("tenant_id").(string),
		Limit:    req.Limit,
		Offset:   req.Offset,
	})
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err).
			WithInternal(err)
	}

	convertedUsers := convertUsersForDisplay(users)
	return c.JSON(http.StatusOK, convertedUsers)
}

// GetUser godoc
//
//	@Summary		従業員の取得
//	@Description	従業員の取得
//	@Produce		json
//	@Security		ApiKeyAuth
//	@Param			id	path		string	true	"従業員ID"	format(uuid)
//	@Success		200	{object}	model.User
//	@Failure		400	{object}	error
//	@Failure		500	{object}	error
//	@Router			/users/{id} [get]
func (h *Handler) GetUser(c echo.Context) error {
	ctx := h.GetCtx(c)

	var req request.GetUserRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err).
			WithInternal(err)
	}

	if err := c.Validate(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err).
			WithInternal(err)
	}

	user, err := h.Usecase.GetUser(ctx, c.Get("tenant_id").(string), req.UserID)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err).
			WithInternal(err)
	}

	convertedUser := convertUserForDisplay(user)
	return c.JSON(http.StatusOK, convertedUser)
}

// CreateUser godoc
//
//	@Summary		従業員の作成
//	@Description	従業員の作成
//	@Produce		json
//	@Security		ApiKeyAuth
//	@Param			req	body		request.CreateUserRequest	true	"作成条件"
//	@Success		201	{string}	string
//	@Failure		400	{object}	error
//	@Failure		500	{object}	error
//	@Router			/users [post]
func (h *Handler) CreateUser(c echo.Context) error {
	ctx := h.GetCtx(c)

	var req request.CreateUserRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err).
			WithInternal(err)
	}

	if err := c.Validate(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err).
			WithInternal(err)
	}

	userID, err := h.Usecase.CreateUser(ctx, usecaseRequest.CreateUserRequest{
		Name:           req.Name,
		Email:          req.Email,
		EmployeeNumber: req.EmployeeNumber,
		Gender:         req.Gender,
		StoreID:        req.StoreID,
	})
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err).
			WithInternal(err)
	}

	return c.JSON(http.StatusCreated, userID)
}

// UpdateUser godoc
//
//	@Summary		従業員の更新
//	@Description	従業員の更新
//	@Accept			json
//	@Produce		json
//	@Security		ApiKeyAuth
//	@Param			id		path		string					true	"従業員ID"		format(uuid)
//	@Param			req		body		request.UpdateUserRequest	true	"更新条件"
//	@Success		200	{object}	model.User
//	@Failure		400	{object}	error
//	@Failure		500	{object}	error
//	@Router			/users/{id} [put]
func (h *Handler) UpdateUser(c echo.Context) error {
	ctx := h.GetCtx(c)

	var req request.UpdateUserRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err).
			WithInternal(err)
	}

	if err := c.Validate(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err).
			WithInternal(err)
	}

	user, err := h.Usecase.UpdateUser(ctx, c.Get("tenant_id").(string), usecaseRequest.UpdateUserRequest{
		ID:             req.UserID,
		Name:           req.Name,
		Email:          req.Email,
		EmployeeNumber: req.EmployeeNumber,
		Gender:         req.Gender,
		StoreID:        req.StoreID,
	})
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err).
			WithInternal(err)
	}

	convertedUser := convertUserForDisplay(user)
	return c.JSON(http.StatusOK, convertedUser)
}

// DeleteUser godoc
//
//	@Summary		従業員の削除
//	@Description	従業員の削除
//	@Produce		json
//	@Security		ApiKeyAuth
//	@Param			id	path		string	true	"従業員ID"	format(uuid)
//	@Success		204	{string}	string
//	@Failure		400	{object}	error
//	@Failure		500	{object}	error
//	@Router			/users/{id} [delete]
func (h *Handler) DeleteUser(c echo.Context) error {
	ctx := h.GetCtx(c)

	var req request.DeleteUserRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err).
			WithInternal(err)
	}

	if err := c.Validate(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err).
			WithInternal(err)
	}

	err := h.Usecase.DeleteUser(ctx, c.Get("tenant_id").(string), req.UserID)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err).
			WithInternal(err)
	}

	return c.NoContent(http.StatusNoContent)
}
