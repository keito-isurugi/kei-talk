//go:generate mockgen -source=image_repository.go -destination=./mock/image_repository_mock.go
package image_tag

import (
	"context"
)

type ImageTagRepository interface {
	ListImageTags(ctx context.Context) (*ListImageTags, error)
	GetImageTag(ctx context.Context, id int) (*ImageTag, error)
	DeleteImageTag(ctx context.Context, id int) error
	DeleteMultipleImageTags(ctx context.Context, ids *UpdateMultipleImageTags) error
	RegisterImageTag(ctx context.Context, imgTag *ImageTag) (int, error)
	RegisterMultipleImageTags(ctx context.Context, ids *UpdateMultipleImageTags) ([]int, error)
}
