package validator

import (
	"regexp"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
)

type CustomValidator struct {
	validator *validator.Validate
}

func NewValidator() echo.Validator {
	return &CustomValidator{
		validator: validator.New(),
	}
}

func (cv *CustomValidator) Validate(i interface{}) error {
	if err := cv.validator.RegisterValidation("len10", is10CharecterUnder); err != nil {
		return err
	}
	if err := cv.validator.RegisterValidation("jp_phone_number", isJPPhoneNumber); err != nil {
		return err
	}
	if err := cv.validator.RegisterValidation("future_date", isFutureDate); err != nil {
		return err
	}

	return cv.validator.Struct(i)
}

func is10CharecterUnder(fl validator.FieldLevel) bool {
	return fl.Field().Len() >= 10
}

func isJPPhoneNumber(fl validator.FieldLevel) bool {
	phoneRegex := `^(0[1-9]\d{0,3}-\d{1,4}-\d{4}|` +
		`0[1-9]\d{0,3}\d{1,4}\d{4}|` +
		`0[5789]0-\d{4}-\d{4}|` +
		`0[5789]0\d{4}\d{4}|` +
		`110|119|0120-\d{3}-\d{3})$`
	r := regexp.MustCompile(phoneRegex)

	return r.MatchString(fl.Field().String())
}

func isFutureDate(fl validator.FieldLevel) bool {
	date, err := time.Parse("2006-01-02", fl.Field().String())
	if err != nil {
		return false
	}

	return date.After(time.Now())
}
