package image

import (
	"bytes"
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/aws/aws-sdk-go/service/s3/s3iface"
	"github.com/google/uuid"
	imageApp "github.com/keito-isurugi/kei-talk/application/image"
	"github.com/keito-isurugi/kei-talk/infrastructure/env"
	"github.com/labstack/echo/v4"
)

type ImageHandler interface {
	ListImages(c echo.Context) error
	GetImage(c echo.Context) error
	DeleteImage(c echo.Context) error
	RegisterImage(c echo.Context) error
	RegisterImages(c echo.Context) error
	GetUntaggedImagesByTags(c echo.Context) error
}

type imageHandler struct {
	ev                        *env.Values
	awsClient                 s3iface.S3API
	listImagesUseCase         imageApp.ListImagesUseCase
	getImageUseCase           imageApp.GetImageUseCase
	deleteImageUseCase        imageApp.DeleteImageUseCase
	registerImageUseCase      imageApp.RegisterImageUseCase
	listImagesNoTaggedUseCase imageApp.ListImagesNoTaggedUseCase
}

func NewImageHandler(
	ev *env.Values,
	awsClient s3iface.S3API,
	listImagesUseCase imageApp.ListImagesUseCase,
	getImageUseCase imageApp.GetImageUseCase,
	deleteImageUseCase imageApp.DeleteImageUseCase,
	registerImageUseCase imageApp.RegisterImageUseCase,
	listImagesNoTaggedUseCase imageApp.ListImagesNoTaggedUseCase,
) ImageHandler {
	return &imageHandler{
		ev:                        ev,
		awsClient:                 awsClient,
		listImagesUseCase:         listImagesUseCase,
		getImageUseCase:           getImageUseCase,
		deleteImageUseCase:        deleteImageUseCase,
		registerImageUseCase:      registerImageUseCase,
		listImagesNoTaggedUseCase: listImagesNoTaggedUseCase,
	}
}

func (ih *imageHandler) ListImages(c echo.Context) error {
	li, err := ih.listImagesUseCase.Exec(c)
	if err != nil {
		return err
	}

	res := make([]imageResponseModel, len(*li))
	for i, img := range *li {
		// Tags をレスポンスモデルに変換
		tags := make([]tagResponseModel, len(img.Tags)) // img.Tags をフロント用に変換
		for j, tag := range img.Tags {
			tags[j] = tagResponseModel{
				ID:   tag.ID,
				Name: tag.Name,
			}
		}

		// 画像情報 + Tags をレスポンスにセット
		res[i] = imageResponseModel{
			ID:          img.ID,
			ImagePath:   img.ImagePath,
			DisplayFlag: img.DisplayFlag,
			Tags:        tags,
		}
	}

	return c.JSON(http.StatusOK, res)
}

func (ih *imageHandler) GetImage(c echo.Context) error {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		return err
	}

	gi, err := ih.getImageUseCase.Exec(c, id)
	if err != nil {
		return err
	}

	res := imageResponseModel{
		ID:          gi.ID,
		ImagePath:   gi.ImagePath,
		DisplayFlag: gi.DisplayFlag,
	}

	return c.JSON(http.StatusOK, res)
}

func (ih *imageHandler) DeleteImage(c echo.Context) error {
	path := c.Param("path")

	_, err := ih.awsClient.DeleteObject(&s3.DeleteObjectInput{
		Bucket: aws.String(ih.ev.AwsS3BucketName),
		Key:    aws.String(path),
	})
	if err != nil {
		log.Printf("failed to delete file from S3: %v\n", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "failed to delete image from S3"})
	}

	// DBから削除処理
	err = ih.deleteImageUseCase.Exec(c, path)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "failed to delete image from database"})
	}

	return c.JSON(http.StatusOK, map[string]string{"status": "image deleted successfully"})
}

func (ih *imageHandler) RegisterImage(c echo.Context) error {
	file, err := c.FormFile("image")
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "failed to get file"})
	}

	// ファイルを開く
	src, err := file.Open()
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "failed to open file"})
	}
	defer src.Close()

	// ファイル内容を読み込む
	buf := bytes.NewBuffer(nil)
	if _, err := buf.ReadFrom(src); err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "failed to read file"})
	}

	// key生成
	key := uuid.New().String()

	// Content-Type を推測
	contentType := file.Header.Get("Content-Type")
	if contentType == "" {
		contentType = "application/octet-stream" // デフォルト値
	}

	// S3 にアップロード
	_, err = ih.awsClient.PutObject(&s3.PutObjectInput{
		Bucket:      aws.String(ih.ev.AwsS3BucketName),
		Key:         aws.String(key),
		Body:        bytes.NewReader(buf.Bytes()),
		ContentType: aws.String(contentType),
	})
	if err != nil {
		log.Printf("failed to upload file to S3: %v\n", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "failed to upload to S3"})
	}

	// アップロードしたパス
	uploadedPath := fmt.Sprintf("%s/%s/%s", ih.ev.AwsS3EndpointExternal, ih.ev.AwsS3BucketName, key)

	// DBに保存
	path, err := ih.registerImageUseCase.Exec(c, key)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, map[string]string{
		"path":         path,
		"uploadedPath": uploadedPath,
	})
}

func (ih *imageHandler) RegisterImages(c echo.Context) error {
	form, err := c.MultipartForm()
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "failed to parse multipart form"})
	}

	// 画像ファイルを取得
	files := form.File["images"]
	if len(files) == 0 {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "no files uploaded"})
	}

	uploadedPaths := []map[string]string{}

	for _, file := range files {
		// ファイルを開く
		src, err := file.Open()
		if err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": "failed to open file"})
		}
		defer src.Close()

		// ファイル内容を読み込む
		buf := bytes.NewBuffer(nil)
		if _, err := buf.ReadFrom(src); err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": "failed to read file"})
		}

		// key生成
		key := uuid.New().String()

		// Content-Type を推測
		contentType := file.Header.Get("Content-Type")
		if contentType == "" {
			contentType = "application/octet-stream" // デフォルト値
		}

		// S3 にアップロード
		_, err = ih.awsClient.PutObject(&s3.PutObjectInput{
			Bucket:      aws.String(ih.ev.AwsS3BucketName),
			Key:         aws.String(key),
			Body:        bytes.NewReader(buf.Bytes()),
			ContentType: aws.String(contentType),
		})
		if err != nil {
			log.Printf("failed to upload file to S3: %v\n", err)
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": "failed to upload to S3"})
		}

		// アップロードしたパス
		uploadedPath := fmt.Sprintf("%s/%s/%s", ih.ev.AwsS3EndpointExternal, ih.ev.AwsS3BucketName, key)

		// DBに保存
		path, err := ih.registerImageUseCase.Exec(c, key)
		if err != nil {
			return err
		}

		uploadedPaths = append(uploadedPaths, map[string]string{
			"path":         path,
			"uploadedPath": uploadedPath,
		})
	}

	// 全てのファイルのパスをまとめて返す
	return c.JSON(http.StatusOK, uploadedPaths)
}

func (ih *imageHandler) GetUntaggedImagesByTags(c echo.Context) error {
	var req getUntaggedImagesByTagsRequest
	if err := c.Bind(&req); err != nil {
		return err
	}

	input := imageApp.ListImagesNoTaggedInputDto{
		TagIDs: req.TagIDs,
	}

	li, err := ih.listImagesNoTaggedUseCase.Exec(c, input)
	if err != nil {
		return err
	}

	res := make([]imageResponseModel, len(*li))
	for i, img := range *li {
		// Tags をレスポンスモデルに変換
		tags := make([]tagResponseModel, len(img.Tags)) // img.Tags をフロント用に変換
		for j, tag := range img.Tags {
			tags[j] = tagResponseModel{
				ID:   tag.ID,
				Name: tag.Name,
			}
		}

		// 画像情報 + Tags をレスポンスにセット
		res[i] = imageResponseModel{
			ID:          img.ID,
			ImagePath:   img.ImagePath,
			DisplayFlag: img.DisplayFlag,
			Tags:        tags,
		}
	}

	return c.JSON(http.StatusOK, res)
}
