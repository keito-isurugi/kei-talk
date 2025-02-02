package aws

import (
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/aws/aws-sdk-go/service/s3/s3iface"

	"github.com/keito-isurugi/kei-talk/infrastructure/env"
)

func NewS3Client(ev *env.Values) (s3iface.S3API, error) {
	awsConfig := &aws.Config{
		Region:           aws.String(ev.AwsRegion),
		S3ForcePathStyle: aws.Bool(true),
	}

	// エンドポイント設定がある場合のみ、エンドポイントを設定
	if ev.AwsS3Endpoint != "" {
		awsConfig.Endpoint = aws.String(ev.AwsS3Endpoint)
	}

	awsSession := session.Must(session.NewSession(awsConfig))

	return s3.New(awsSession), nil
}
