package image

import (
	"github.com/labstack/echo/v4"

	imageDomain "github.com/keito-isurugi/kei-talk/domain/image"
)

type DeleteImageUseCase interface {
	Exec(c echo.Context, path string) error
}

type deleteImageUseCase struct {
	imageRepo imageDomain.ImageRepository
}

func NewDeleteImageUseCase(imageRepo imageDomain.ImageRepository) DeleteImageUseCase {
	return &deleteImageUseCase{
		imageRepo: imageRepo,
	}
}

func (uc *deleteImageUseCase) Exec(c echo.Context, path string) error {
	err := uc.imageRepo.DeleteImage(c.Request().Context(), path)
	if err != nil {
		return err
	}
	return nil
}
