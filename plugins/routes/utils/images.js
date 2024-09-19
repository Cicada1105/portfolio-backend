/*
  File for handling uploading and removing of images
  using NodeJS ImageKit SDK
*/

const crypto = require('crypto');
const ImageKit = require('imagekit');

function uploadImage({ buffer, fileExtension }){
  var imageKit = new ImageKit({
      publicKey : process.env.IMAGE_KIT_PUBLIC_KEY,
      privateKey : process.env.IMAGE_KIT_PRIVATE_KEY,
      urlEndpoint : `https://ik.imagekit.io/${process.env.IMAGE_KIT_ID}/`
  });

  let imageUploadOptions = {
    file: buffer.toString('base64'),
    fileName: `${crypto.randomUUID()}.${fileExtension}`
  }

  return imageKit.upload(imageUploadOptions);
}

function removeImage(imageId){
  var imageKit = new ImageKit({
      publicKey : process.env.IMAGE_KIT_PUBLIC_KEY,
      privateKey : process.env.IMAGE_KIT_PRIVATE_KEY,
      urlEndpoint : `https://ik.imagekit.io/${process.env.IMAGE_KIT_ID}/`
  });

  return imageKit.deleteFile(imageId);
}

module.exports = {
  uploadImage, removeImage
}