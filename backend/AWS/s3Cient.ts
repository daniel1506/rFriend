import { S3Client } from "@aws-sdk/client-s3";

// Set the AWS Region.
// const REGION = "ap-southeast-1"; //e.g. "us-east-1"
const REGION = process.env.REGION; //e.g. "us-east-1"

// Create an Amazon S3 service client object.
const s3Client = new S3Client({ region: REGION });

// const bucketName = process.env.bucketName;

// export { s3Client, bucketName, REGION };
export { s3Client };