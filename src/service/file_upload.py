import string

import boto3
import os

from botocore.exceptions import ClientError


class FileUploadService:
    def __init__(self, config):
        """

        :param config: Config object
        :type config: Config
        """
        session = boto3.session.Session()
        self.client = session.client('s3',
                                     region_name=config.DO_SPACES_REGION,
                                     endpoint_url='https://%s.digitaloceanspaces.com' % config.DO_SPACES_REGION,
                                     aws_access_key_id=config.DO_SPACES_KEY,
                                     aws_secret_access_key=config.DO_SPACES_SECRET)
        self.base_url = 'https://%s.%s.digitaloceanspaces.com' % (config.DO_SPACES_BUCKET, config.DO_SPACES_REGION)
        self.bucket = config.DO_SPACES_BUCKET
        self.gif_dir = config.DO_GIF_DIR
        self.movie_dir = config.DO_MOVIE_DIR

    def upload_gif(self, filename):
        key = os.path.basename(filename)
        upload_args = {
            'ContentType': 'image/gif',
            'ACL': 'public-read'
        }
        self.client.upload_file(filename, self.bucket, self.gif_dir + key, ExtraArgs=upload_args)
        return self.get_url_of_gif(key)

    def upload_cover(self, movie_name, filename):

        tmdb = os.path.join(os.path.dirname(filename), 'tmdb.url')
        if os.path.exists(tmdb):
            key = open(tmdb).readlines()[1].split('/')[-1].strip()
        else:
            key = str(filter(lambda c: c in string.ascii_lowercase + "_", movie_name.lower().replace(" ", "_")))

        filetype = str(os.path.splitext(filename)[-1])

        key = '%s%s-cover%s' % (self.movie_dir, key, filetype)

        if not self.file_exists(key):
            upload_args = {
                'ContentType': 'image/' + filetype.replace(".", "").replace("jpg", "jpeg"),
                'ACL': 'public-read'
            }

            self.client.upload_file(filename, self.bucket, key, ExtraArgs=upload_args)
        return "%s/%s" % (self.base_url, key)

    def gif_exists(self, key):
        return self.file_exists(self.gif_dir + key)

    def file_exists(self, key):
        try:
            self.client.head_object(Bucket=self.bucket, Key=key)
            return True
        except ClientError as e:
            if e.response['Error']['Code'] == '404':
                return False
            else:
                raise e

    def get_url_of_gif(self, key):
        return '%s/%s%s' % (self.base_url, self.gif_dir, key)
