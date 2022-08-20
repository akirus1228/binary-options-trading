// import { Asset } from "../types/backend-types";

// const validateImage = (url: string, timeout = 5000): Promise<boolean> => {
//   return new Promise((resolve, reject) => {
//     const img = new Image();
//     const timer = setTimeout(() => {
//       img.src = "";
//       reject(false);
//     }, timeout);

//     img.onerror = img.onabort = () => {
//       clearTimeout(timer);
//       reject(false);
//     };

//     img.onload = () => {
//       clearTimeout(timer);
//       resolve(true);
//     };
//     img.src = url;
//   });
// };

// export const useBestImage = async (
//   asset: Asset,
//   preferredWidth: number
// ): Promise<string> => {
//   const imageLoadOrder = [
//     asset.osData?.image_url,
//     asset.thumbUrl,
//     asset.imageUrl,
//     asset.frameUrl,
//   ];

//   // do any of the images contain googleusercontent?
//   const img = imageLoadOrder.find((imageString) =>
//     imageString?.includes("googleusercontent")
//   );

//   if (img) {
//     return `${img}=w${preferredWidth}`;
//   }

//   imageLoadOrder.forEach((imageString) => {
//     if (imageString && (await validateImage(imageString))) {
//       return imageString;
//     } else {
//       imageLoadOrder.shift();
//     }
//   });

//   return "";
// };
