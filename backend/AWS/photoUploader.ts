import { PutObjectCommand, PutObjectCommandInput } from "@aws-sdk/client-s3";
import { s3Client } from "./s3Cient";

const photoUploadS3 = async (uploadName: string, photoBase64: string): Promise<string> => {
  /* 
    find out the type of the image
    Note that profile has the format: image/jpeg;base64,xxxx.....
  */
  let type: string = photoBase64.split("/")[1].split(";")[0];

  // turn the string into binary data. The image cannot be shown without doing this
  const encoded_image: Buffer = Buffer.from(photoBase64.split(",")[1], "base64");

  // Set the parameters.
  const bucketParams: PutObjectCommandInput = {
    Bucket: process.env.BUCKET_NAME,
    // Specify the name of the new object. For example, 'index.html'.
    // To create a directory for the object, use '/'. For example, 'myApp/package.json'.
    Key: uploadName,
    Body: encoded_image, // Content of the new object.
    ContentEncoding: "base64",
    ContentType: "image/" + type,
    ACL: "public-read", // for public access
  };

  await s3Client.send(new PutObjectCommand(bucketParams));

  return "https://" + process.env.BUCKET_NAME + ".s3." + process.env.REGION + ".amazonaws.com/" + uploadName;
};

export default photoUploadS3;
