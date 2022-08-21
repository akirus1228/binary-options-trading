// import { useEffect, useMemo, useState } from "react";
// import { Asset } from "../types/backend-types";

// export const useBestImage = (asset: Asset, preferredWidth: number) => {
//   const [url, setUrl] = useState("");
//   const imageLoadOrder = [
//     asset.osData?.image_url,
//     asset.thumbUrl,
//     asset.imageUrl,
//     asset.frameUrl,
//   ];

//   useEffect(() => {
//     const validateImage = (url: string, timeout = 5000): Promise<string> => {
//       return new Promise((resolve, reject) => {
//         const img = new Image();
//         const timer = setTimeout(() => {
//           img.src = "";
//           reject(false);
//         }, timeout);

//         img.onerror = img.onabort = () => {
//           clearTimeout(timer);
//           reject(false);
//         };

//         img.onload = () => {
//           clearTimeout(timer);
//           resolve(url);
//         };
//         img.src = url;
//       });
//     };

//     // do any of the images contain googleusercontent?
//     // if so this is what we want to use
//     const img = imageLoadOrder.find((imageString) =>
//       imageString?.includes("googleusercontent")
//     );
//     if (img) {
//       setUrl(`${img}=w${preferredWidth}`);
//       return;
//     }

//     // no googleusercontent images, so use the the best sized version we have
//     imageLoadOrder.forEach((imageString) => {
//       if (imageString) {
//         validateImage(imageString)
//           .then((validatedUrl: string) => {
//             setUrl(validatedUrl);
//           })
//           .catch(() => {
//             // do nothing
//           });
//       } else {
//         imageLoadOrder.shift(); // remove unloadable image from the list
//       }
//     });
//   }, [imageLoadOrder]);

//   return url;
// };
