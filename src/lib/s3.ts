import S3 from "aws-sdk/clients/s3";

export const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_PUBLIC_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_PUBLIC_KEY,
  region: process.env.AWS_REGION_PUBLIC,
  signatureVersion: "v4",
});
