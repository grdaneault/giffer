import boto3
import os

from botocore.exceptions import ClientError


class GifUploadService:
    def __init__(self, config):
        session = boto3.session.Session()
        self.client = session.client('s3',
                                     region_name=config.DO_SPACES_REGION,
                                     endpoint_url='https://%s.digitaloceanspaces.com' % config.DO_SPACES_REGION,
                                     aws_access_key_id=config.DO_SPACES_KEY,
                                     aws_secret_access_key=config.DO_SPACES_SECRET)
        self.base_url = 'https://%s.%s.digitaloceanspaces.com' % (config.DO_SPACES_BUCKET, config.DO_SPACES_REGION)
        self.bucket = config.DO_SPACES_BUCKET

    def upload_file(self, filename):
        key = os.path.basename(filename)
        upload_args = {
            'ContentType': "image/gif",
            'ACL': "public-read"
        }
        self.client.upload_file(filename, self.bucket, key, ExtraArgs=upload_args)
        return self.get_url_of_upload(key)

    def file_exists(self, key):
        try:
            self.client.head_object(Bucket=self.bucket, Key=key)
            return True
        except ClientError as e:
            if e.response['Error']['Code'] == '404':
                return False
            else:
                raise e

    def get_url_of_upload(self, key):
        return '%s/%s' % (self.base_url, key)
