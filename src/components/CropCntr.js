import React, { useState, useEffect } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import './CropCntr.css';
import CropDashboard from "./CropDashboard";

/* Protocol
    uploadSizeboxData()
    uploadImgFileName()
    uploadCropImg()
    uploadCropBoxSize()
    triggerUndoCrop()
    triggerSetNewImg()
*/

const src_default_img = "default_img.png";

export default function CropCntr(props) {
    const [rawImg, setRawImg] = useState(src_default_img);
    const [cropper, setCropper] = useState();

    useEffect(() => {
        // 存在快照则使用快照
        if (props.snapshotRawImg !== null) {
            setRawImg(props.snapshotRawImg);
        }
    }, [props.snapshotRawImg]);

    //-- Protocol Begin

    const uploadSizeboxData = (newSizeboxData) => {
        props.ptc_uploadSizeboxData(newSizeboxData);
    }

    const uploadImgFile = (newImgFile) => {
        setRawImg(newImgFile);
        props.ptc_triggerSetNewImg();

        // if (typeof cropper !== "undefined") {
        //     cropper.setData({width: 75});
        // }
    }

    const uploadImgFileName = (newImgFileName) => {
        props.ptc_uploadImgFileName(newImgFileName);
    }

    const triggerDoCrop = () => {
        if (typeof cropper !== "undefined") {
            props.ptc_uploadCropImg(cropper.getCroppedCanvas().toDataURL())
            props.ptc_uploadCropBoxSize({
                width: cropper.getCropBoxData().width,
                height: cropper.getCropBoxData().height,
            })
            props.ptc_uploadImgNaturalSize({
                width: cropper.getImageData().naturalWidth,
                height: cropper.getImageData().naturalHeight,
            });
        }
    }

    const triggerUndoCrop = () => {
        props.ptc_triggerUndoCrop();
    }
    
    //-- Protocol End


    return (
        <div className="chmt-cropcntr">

            <Cropper
                style={{ height: 400, width: "100%" }}
                zoomable={false}
                modal={false}
                highlight={false}
                zoomTo={0.5} //
                initialAspectRatio={0.15}
                preview=".img-preview"
                src={rawImg}
                viewMode={1}
                minCropBoxHeight={10}
                minCropBoxWidth={10}
                background={false}
                responsive={true}
                autoCropArea={1}
                checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
                onInitialized={(instance) => {
                    setCropper(instance);
                }}
                // data={{width: 75}}
                guides={true}
            />

            <CropDashboard 
                sizeboxData={props.sizeboxData}

                ptc_uploadSizeboxData={uploadSizeboxData} 
                ptc_uploadImgFile={uploadImgFile}
                ptc_uploadImgFileName={uploadImgFileName}
                ptc_triggerDoCrop={triggerDoCrop}
                ptc_triggerUndoCrop={triggerUndoCrop}
            />
        </div>
    );
    
}
