//go:generate mockgen -source=image_repository.go -destination=./mock/image_repository_mock.go
package image

import (
	"context"
)

type ImageRepository interface {
	ListImages(ctx context.Context) (ListImages, error)
}