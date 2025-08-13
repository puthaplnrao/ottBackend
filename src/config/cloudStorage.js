import AWS from "aws-sdk";

const s3 = new AWS.S3({
  apiVersion: "2006-03-01",
  region: process.env.AWS_REGION,
});
const bucket = process.env.S3_BUCKET;
const baseFolder = process.env.S3_BASE_FOLDER || "videos";

export function toKey(filename) {
  return `${baseFolder}/${filename}`;
}

export async function uploadBuffer(
  filename,
  buffer,
  contentType = "application/octet-stream"
) {
  const Key = toKey(filename);
  await s3
    .putObject({ Bucket: bucket, Key, Body: buffer, ContentType: contentType })
    .promise();
  return { bucket, key: Key };
}

export function getObjectStreamWithRange(key, rangeHeader) {
  const params = { Bucket: bucket, Key: key };
  if (rangeHeader) params.Range = rangeHeader;
  return s3.getObject(params).createReadStream();
}

export async function headObject(key) {
  return s3.headObject({ Bucket: bucket, Key: key }).promise();
}
